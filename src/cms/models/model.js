import Backbone from 'backbone';
import { cmslog } from 'Utility/logging';
import { confirm, complain } from 'Utility/notification';
import { getConfig } from 'Config/config';
import { translate } from 'Utility/i18n';
import { startWork, stopWork } from 'Utility/jobs';

class CmsModel extends Backbone.Model {
  constructor(...args) {
    super(...args);
    this.urlRoot = this.urlRoot.bind(this);
    this.prepareLoader = this.prepareLoader.bind(this);
    this.loadAnd = this.loadAnd.bind(this);
    this.whenLoaded = this.whenLoaded.bind(this);
    this.whenFailed = this.whenFailed.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.load = this.load.bind(this);
    this.fetch = this.fetch.bind(this);
    this.loaded = this.loaded.bind(this);
    this.notLoaded = this.notLoaded.bind(this);
    this.prepareSaver = this.prepareSaver.bind(this);
    this.save = this.save.bind(this);
    this.saved = this.saved.bind(this);
    this.confirmSave = this.confirmSave.bind(this);
    this.cancelSave = this.cancelSave.bind(this);
    this.notSaved = this.notSaved.bind(this);
    this.revert = this.revert.bind(this);
    this.resetUploads = this.resetUploads.bind(this);
    this.startProgress = this.startProgress.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.finishProgress = this.finishProgress.bind(this);
    this.build = this.build.bind(this);
    this.parse = this.parse.bind(this);
    this.toJSON = this.toJSON.bind(this);
    this.toJSONWithRootAndAssociations = this.toJSONWithRootAndAssociations.bind(this);
    this.toJSONWithAssociations = this.toJSONWithAssociations.bind(this);
    this.checkChanges = this.checkChanges.bind(this);
    this.recordAttributes = this.recordAttributes.bind(this);
    this.resetChanges = this.resetChanges.bind(this);
    this.significantAttributes = this.significantAttributes.bind(this);
    this.hasChangedAttributes = this.hasChangedAttributes.bind(this);
    this.significantChangedAttributes = this.significantChangedAttributes.bind(this);
    this.hasChangedAssociations = this.hasChangedAssociations.bind(this);
    this.significantChangedAssociations = this.significantChangedAssociations.bind(this);
    this.reloadAssociations = this.reloadAssociations.bind(this);
    this.validate = this.validate.bind(this);
    this.touch = this.touch.bind(this);
    this.isPopulated = this.isPopulated.bind(this);
    this.sig = this.sig.bind(this);
  }

  initialize() {
    this._class_name = this.constructor.name;
    this._original_attributes = {};
    this.checkState = _.debounce(this.checkChanges, 250);

    this.prepareLoader();
    if (this.autoload) { this.load(); }

    this.build();

    this.prepareSaver();
    this.recordAttributes();
    this.checkState();
    this.set('changed', false);
    this.on('change', this.checkState);
    this.on('change', this.validate);
  }

  // Construction
  // usually this is where we set up associations and listeners.
  build() {}

  discard() {
    if (this.collection) this.collection.remove(this);
  }


  // Loading
  // Loading is promised. Actions that should be taken only when a model needs no further fetching
  // can be triggered safely with `model.loadAnd(function)` or `model.whenLoaded(function)`,
  // which does not itself trigger loading but will call back when loading is complete.
  // The loaded promise is resolved when we are fetched either individually or in a collection.

  urlRoot() {
    if (this.collection) return this.collection.urlRoot();
    return [getConfig('api_url'), this.pluralName].join('/');
  }

  prepareLoader() {
    if (this._loader) this._loader.cancel();
    this._loaded = $.Deferred();
    if (this.isNew()) this._loaded.resolve();
    this._loading = false;
  }

  loadAnd(fn) {
    this._loaded.done(fn);
    this.load();
  }

  whenLoaded(fn) {
    this._loaded.done(fn);
  }

  whenFailed(fn) {
    this._loaded.fail(fn);
  }

  isLoaded() {
    return this._loaded.state() === 'resolved';
  }

  load() {
    if (!this._loading && !this.isLoaded()) {
      this._loading = true;
      this._loader = this.fetch({ error: this.notLoaded }).done(this.loaded);
    }
    return this._loaded.promise();
  }

  loaded(data) {
    this._loading = false;
    this._loader = null;
    this._saved.resolve();
    this._loaded.resolve(data);
    this.resetChanges();
  }

  notLoaded(error) {
    this._loading = false;
    this._loader = null;
    this._loaded.reject(error);
  }

  reload() {
    this.prepareLoader();
    this.load();
  }


  // Saving
  // Saving is also promised, with callbacks attached around.
  // In application.js we also override sync to add progress handlers.

  prepareSaver() {
    this._saved = $.Deferred();
    if (!this.isNew()) { this._saved.resolve(); }
    this._saving = false;
  }

  save(...args) {
    if (!this._saving) {
      this._saved = $.Deferred();
      this._saving = true;
      this._saver = super.save(...args);
      this._saver.fail(this.notSaved).done(this.saved);
    }
    return this._saved.promise();
  }

  saved(data) {
    this._saving = false;
    this._saved.resolve(data);
    this._saver = null;
    this.confirmSave();
    this.resetChanges();
    this.resetUploads();
    this.reloadAssociations();
  }

  confirmSave() {
    confirm('Saved');
  }

  notSaved(xhr, status, error) {
    this._saving = false;
    this._saved.reject(error);
    this._saver = null;
    this.set({
      progressing: false,
      progress: 0,
    });
    stopWork(this);
    if (status === 'abort') {
      complain(translate('warnings.upload_cancelled'));
    } else {
      // eslint-disable-next-line
      const response = xhr.responseJSON;
      if (response && response.errors) {
        complain(`${xhr.status}: ${response.errors}`);
      } else {
        complain(error);
      }
    }
  }

  cancelSave() {
    this.log('✋ cancelSave');
    if (this._saver) this._saver.abort();
  }

  revert() {
    this.reload();
  }

  resetUploads() {}

  // add progress hooks to sync
  sync(method, model, options = {}) {
    if (method !== 'read') {
      const originalBeforeSend = options.beforeSend;
      const originalSuccess = options.success;
      // whole point of this function is to reassign params :)
      // options.attrs = model.toJSONWithRootAndAssociations();
      // eslint-disable-next-line no-param-reassign
      options.beforeSend = (xhr, opts) => {
        model.startProgress();
        // eslint-disable-next-line no-param-reassign
        opts.xhr = () => {
          const pxhr = new window.XMLHttpRequest();
          pxhr.upload.addEventListener('progress', (e) => model.setProgress(e));
          return pxhr;
        };
        if (originalBeforeSend) {
          originalBeforeSend.apply(this, xhr, opts);
        }
      };
      // eslint-disable-next-line no-param-reassign
      options.success = (...args) => {
        model.finishProgress(true);
        if (originalSuccess) {
          originalSuccess(...args);
        }
      };
    }
    return Backbone.sync.call(this, method, model, options);
  }

  startProgress() {
    this.set({
      progressing: true,
      progress: 0,
    });
    startWork(this);
  }

  setProgress(p) {
    if (p.lengthComputable) {
      const progress = p.loaded / p.total;
      this.set({ progress });
      if (progress >= 0.99) {
        this.set({ progressing: false });
      }
    }
  }

  finishProgress() {
    this.set({
      progressing: false,
      progress: 1.0,
    });
    stopWork(this);
  }


  // Overriding a backbone instance method.
  parse(response) {
    const id = response.id;
    const data = response.data;
    const attributes = response.attributes || data.attributes;
    if (!attributes.id) {
      if (id) attributes.id = id;
      else if (data && data.id) attributes.id = data.id;
    }
    return this.inflateDates(attributes);
  }

  inflateDates(data = {}) {
    ['published_at', 'updated_at', 'created_at'].forEach((attribute) => {
      const date = data[attribute];
      // eslint-disable-next-line no-param-reassign
      if (date) data[attribute] = new Date(date);
    });
    return data;
  }

  toJSON() {
    return this.toJSONWithRootAndAssociations();
  }

  toJSONWithRootAndAssociations() {
    const root = this.jsonRoot();
    const json = {};
    json[root] = this.toJSONWithAssociations();
    return json;
  }

  jsonRoot() {
    return this.singularName;
  }

  toJSONWithAssociations() {
    const json = {};
    const associations = _.result(this, 'savedAssociations') || [];
    const attributes = _.result(this, 'savedAttributes') || [];
    attributes.forEach((att) => {
      json[att] = this.get(att);
    });
    associations.forEach((ass) => {
      json[`${ass}_data`] = this[ass].toJSONWithAssociations();
    });
    return json;
  }


  // Change monitoring

  checkChanges() {
    const changed = this.hasChangedAttributes() || this.hasChangedAssociations();
    const unchanged = !changed;
    const populated = this.isPopulated();
    this.set({
      changed,
      unchanged,
      populated,
    });
  }

  recordAttributes() {
    this._original_attributes = this.significantAttributes();
  }

  resetChanges() {
    const associations = _.result(this, 'savedAssociations') || [];
    associations.forEach((ass) => this[ass].resetChanges());
    this.recordAttributes();
    this.checkChanges();
  }

  significantAttributes() {
    return _.pick(this.attributes, this.savedAttributes);
  }

  hasChangedAttributes() {
    return !_.isEmpty(this.significantChangedAttributes());
  }

  significantChangedAttributes(keys) {
    const atts = this.significantAttributes();
    const selectedKeys = keys || _.keys(atts);
    const changedKeys = _.filter(selectedKeys, (k) => atts[k] !== this._original_attributes[k]);
    return _.pick(atts, changedKeys);
  }

  hasChangedAssociations() {
    return !_.isEmpty(this.significantChangedAssociations());
  }

  significantChangedAssociations() {
    return _.filter(this.savedAssociations, (k) => this[k].hasAnyChanges());
  }

  // TODO unpack jasonapi properly, then serialise associations.
  reloadAssociations() {
    _.each(this.savedAssociations, (k) => this[k].debouncedReload());
  }


  // Validation
  // just a placeholder at the momemnt

  validate() {
    this.set('valid', true);
  }


  // Housekeeping

  touch() {
    this.set('updated_at', new Date(), { stickitChange: true });
  }

  sig() {
    return `${this.singularName} • ${this.cid}`;
  }

  // Overridden in subclass
  isPopulated() {
    return true;
  }

  log(...args) {
    cmslog(`[${this.sig()}]`, ...args);
  }
}


CmsModel.prototype.savedAttributes = [];
CmsModel.prototype.publishedAttributes = [];
CmsModel.prototype.savedAssociations = [];
CmsModel.prototype.uploadProgress = false;
CmsModel.prototype.autoload = false;
CmsModel.prototype.defaults = { populated: false };

export default CmsModel;
