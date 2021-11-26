import MenuView from 'Views/base/menu';
import ProgressBarView from 'Views/helpers/progress_bar';
import { readFileDrop, readFileInput } from 'Utility/files';
import { complain } from 'Utility/notification';

class AssetChooserView extends MenuView {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.reset = this.reset.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.showImporter = this.showImporter.bind(this);
    this.showReuser = this.showReuser.bind(this);
    this.showActionView = this.showActionView.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.enableOptions = this.enableOptions.bind(this);
    this.selectedModel = this.selectedModel.bind(this);
    this.createdModel = this.createdModel.bind(this);
    this.replacedModel = this.replacedModel.bind(this);
    this.filePicked = this.filePicked.bind(this);
    this.observeDrops = this.observeDrops.bind(this);
    this.ignoreDrops = this.ignoreDrops.bind(this);
    this.expectDrop = this.expectDrop.bind(this);
    this.stopExpectingDrop = this.stopExpectingDrop.bind(this);
    this.fileDropped = this.fileDropped.bind(this);
    this.buildModel = this.buildModel.bind(this);
  }

  initialize() {
    this.collection = this.getCollection();
    this.collection.on('add remove reset', this.enableOptions.bind(this));
    this.collection.load();
  }

  // override in subclass, usually to choose a library collection.
  getCollection() {}

  reset() {
    this.showOptions();
    this.close();
  }

  onAfterRender() {
    this.enableOptions();
    this.observeDrops();
  }

  showImporter(e) {
    if (e) e.preventDefault();
    this.showActionView(this.importView);
  }

  showReuser(e) {
    if (e) e.preventDefault();
    this.showActionView(this.reuseView);
  }

  showActionView(ViewClass) {
    if (ViewClass) {
      const view = new ViewClass({ collection: this.collection });
      this.showChildView('action', view);
      this.ui.options.hide();
      this.ui.action.show();
      // temporarily overlay a selected model that may not
      // be persisted yet.
      view.on('selected', this.selectedModel);
      // a little complicated here because these actions
      // always replace an existing slide. We could decide
      // to show them only for new slides, leaving a simpler
      // add-or-delete workflow but losing some flexibility.
      // Controls might then move into the collection view.
      view.on('created', this.createdModel);
      view.on('replaced', this.replacedModel);
    }
  }

  showOptions(e) {
    if (e) e.preventDefault();
    this.getRegion('action').reset();
    this.getRegion('progress').reset();
    this.ui.options.show();
    this.ui.action.hide();
    this.enableOptions();
  }

  showProgress() {
    this.ui.options.hide();
    this.ui.action.hide();
    this.showChildView('progress', new ProgressBarView({ model: this.model }));
  }

  enableOptions() {
    if (!this.isDestroyed()) {
      if (this.ui.picker) {
        if (this.collection && this.collection.length) {
          this.ui.picker.removeClass('unavailable');
        } else {
          this.ui.picker.addClass('unavailable');
        }
      }
      if (this.ui.remover) {
        if (this.isPopulated()) {
          this.ui.remover.removeClass('unavailable');
        } else {
          this.ui.remover.addClass('unavailable');
        }
      }
      if (this.ui.resizer) {
        if (this.isPopulated()) {
          this.ui.resizer.removeClass('unavailable');
        } else {
          this.ui.resizer.addClass('unavailable');
        }
      }
    }
  }

  // temporary local override while asset uploads
  selectedModel(model) {
    this._original_model = this.model;
    this.model = model;
  }

  createdModel(model) {
    this.model = model;
    this.trigger('replaced', model);
  }

  replacedModel(model) {
    this.model = model;
    this.trigger('replaced', model);
  }

  focus() {
    this.open();
  }

  onOpen() {
  }

  // Dropped file

  observeDrops() {
    this.$el.on('dragenter', this.expectDrop);
  }

  ignoreDrops() {
    this.$el.off('dragenter', this.expectDrop);
  }

  expectDrop() {
    this.$el.addClass('over');
    this.$el.on('dragleave', this.stopExpectingDrop);
    this.$el.on('dragover', this.enhanceDragAndDropStupidLevel);
    this.$el.on('drop', this.fileDropped);
  }

  stopExpectingDrop() {
    this.$el.removeClass('over');
    this.$el.off('dragleave', this.abandonDrop);
    this.$el.off('dragover', this.enhanceDragAndDropStupidLevel);
    this.$el.off('drop', this.fileDropped);
  }

  enhanceDragAndDropStupidLevel(e) {
    if (e) {
      e.preventDefault();
      if (e.originalEvent && e.originalEvent.dataTransfer) {
        e.originalEvent.dataTransfer.dropEffect = 'copy';
      }
    }
  }

  // handle local files

  fileDropped(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      readFileDrop(e.originalEvent, this.buildModel);
    }
    this.stopExpectingDrop();
  }

  filePicked() {
    readFileInput(this.ui.file[0], this.buildModel);
  }

  // Read and upload
  // works with a temporary local model until it is saved.
  buildModel(contents, file) {
    const attributes = this.attributesFromFile(file);
    attributes.file_data = contents;
    const model = this.collection.add(attributes, { at: 0 });
    if (model.isValid()) {
      this.selectedModel(model);
      this.showProgress();
      this.model.save()
        .done(() => {
          this.createdModel(model);
        })
        .fail(() => {
          if (this._original_model) this.model = this._original_model;
          model.discard();
          this.showOptions();
        });
    } else {
      model.discard();
      complain(model.get('invalidity'));
    }
  }

  // not static because overriden in subclass
  attributesFromFile(file) {
    return {
      file_name: file.name,
    };
  }

  removeWithConfirmation(e) {
    if (e) e.preventDefault();
    // TODO: ...with confirmation
    this.trigger('removed');
  }

  reportClick(e) {
    this.log('label click', e.target, e.currentTarget);
  }
}


AssetChooserView.prototype.tagName = 'div';
AssetChooserView.prototype.className = 'cms-chooser';
AssetChooserView.prototype.ui = {
  head: '.cms-chooser-head',
  prompt: '.cms-chooser-prompt',
  body: '.cms-chooser-body',
  close: 'a.close',
  options: '.options',
  importer: 'a.import',
  picker: 'a.reuse',
  remover: 'a.remove',
  resizer: 'a.resize',
  file: 'input.upload',
  action: '.action',
};
AssetChooserView.prototype.events = {
  'click label': 'reportClick',
  'click @ui.head': 'toggle',
  'click @ui.prompt': 'open',
  'click @ui.close': 'close',
  'click @ui.importer': 'showImporter',
  'click @ui.picker': 'showReuser',
  'click @ui.remover': 'removeWithConfirmation',
  'click @ui.resizer': 'removeWithConfirmation', // now pretend like remove
  'click a.back': 'showOptions',
  'change @ui.file': 'filePicked',
};
AssetChooserView.prototype.regions = {
  action: '.action',
  progress: '.progress',
};


export default AssetChooserView;
