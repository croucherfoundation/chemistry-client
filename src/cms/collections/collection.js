import { Collection, Model } from 'backbone';
import { cmslog } from 'Utility/logging';
import { getConfig } from 'Config/config';

class CmsCollection extends Collection {
  constructor(...args) {
    super(...args);
    this.url = this.url.bind(this);
    this.initialize = this.initialize.bind(this);
    this.getState = this.getState.bind(this);
    this.prepareToLoad = this.prepareToLoad.bind(this);
    this.load = this.load.bind(this);
    this.fetch = this.fetch.bind(this);
    this.reload = this.reload.bind(this);
    this.loadSuccess = this.loadSuccess.bind(this);
    this.loadFail = this.loadFail.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.whenLoaded = this.whenLoaded.bind(this);
    this.loadAnd = this.loadAnd.bind(this);
    this.parse = this.parse.bind(this);
    this.findOrAdd = this.findOrAdd.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  initialize(models, opts) {
    this._state = new Model();
    if (opts) {
      const p = opts.p;
      const pp = opts.pp;
      const filter = opts.filter;
      this._state.set({ p, pp, filter });
    }
    this._state.on('change', _.debounce(this.updateState.bind(this), 250));
    this.prepareToLoad();
  }

  getState() {
    return this._state;
  }

  updateState() {
    // TODO: store responses with serialized cache key, clear cache on any save action
    this.fetch();
  }

  // Pagination and Filtering

  setPage(value) {
    this._state.set('p', value);
  }

  setPerPage(value) {
    this._state.set('pp', value);
  }

  // The filter is a general-purpose system for passing collection params
  // up to the API and ultimately to the elasticsearch query interface.
  setFilter(key, value) {
    this._state.get('filter').set(key, value);
  }

  resetFilter(filter = {}) {
    this._state.set('filter', filter);
  }

  // the `q` parameter is used for free-text search.
  setQuery(value) {
    this.log('setQuery', value);
    this._state.set('q', value);
  }

  urlRoot() {
    let baseUrl;
    if (this._page) {
      baseUrl = [getConfig('api_url'), 'pages', this._page.id, this.pluralName].join('/');
    } else {
      baseUrl = [getConfig('api_url'), this.pluralName].join('/');
    }
    return baseUrl;
  }

  url() {
    const baseUrl = this.urlRoot();
    if (this._state) {
      const usp = new URLSearchParams();
      ['p', 'pp', 'q'].forEach((param) => {
        const value = this._state.get(param);
        if (value) usp.set(param, value);
      });
      const filter = this._state.get('filter');
      if (filter) {
        Object.keys(filter).forEach((key) => {
          if (key && filter[key]) {
            usp.set(encodeURIComponent(key), encodeURIComponent(filter[key]));
          }
        });
      }
      const qs = usp.toString();
      if (qs.length) {
        return `${baseUrl}?${qs}`;
      }
    }
    return baseUrl;
  }

  prepareToLoad() {
    if (this._loaded) this._loaded.reject();
    this._loaded = $.Deferred();
    this._loading = false;
  }

  load() {
    if (!this._loading && !this.isLoaded()) {
      this._loading = true;
      this.fetch({ error: this.loadFail }).done(this.loadSuccess);
    }
    return this._loaded.promise();
  }

  reload() {
    this.prepareToLoad();
    this.load();
  }

  loadSuccess(data) {
    this._loading = false;
    this._loaded.resolve(data);
  }

  loadFail(error) {
    this._loaded.reject(error);
  }

  isLoaded() {
    return this._loaded && this._loaded.state() === 'resolved';
  }

  whenLoaded(dothis) {
    this._loaded.done(dothis);
  }

  loadAnd(dothis) {
    this.whenLoaded(dothis);
    this.load();
  }

  // high-tech jsonapi implementation
  // overrides stub in backbone: cannot be rephrased as static method.
  parse(data) {
    return data.data;
  }

  findOrAdd(attributes) {
    let model = this.findWhere(attributes);
    if (!model) {
      model = this.add(attributes);
      model.fetch();
    }
    return model;
  }

  setAll(k, v) {
    this.each((m) => m.set(k, v));
  }

  log(...args) {
    cmslog(`[${this.pluralName}]`, ...args);
  }

  static key() {
    return this.class_key;
  }
}


export default CmsCollection;
