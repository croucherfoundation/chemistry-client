import CmsView from 'Views/base/view';

class AssetImporterView extends CmsView {
  constructor(...args) {
    super(...args);
    this.importModel = this.importModel.bind(this);
    this.disableForm = this.disableForm.bind(this);
  }

  onBeforeRender() {
    const ModelClass = this.modelClass;
    if (ModelClass) this.model = new ModelClass();
  }

  importModel() {
    if (this.model.get('importable')) {
      this.disableForm();
      this.model.save().done(() => this.trigger('created', this.model));
    }
  }

  disableForm() {
    this.ui.url.attr('disabled', true);
    this.ui.button.addClass('waiting');
  }
}
// https://tlms-public.s3.amazonaws.com/dataroom/chemistry/images/files/507/full/nhhh.jpg?1570137552

AssetImporterView.prototype.tagName = 'div';
AssetImporterView.prototype.className = 'cms-importer';
AssetImporterView.prototype.ui = {
  url: 'input[name="remote_url"]',
  button: 'a.submit',
  waiter: 'p.waiter',
};
AssetImporterView.prototype.events = {
  'click @ui.button': 'importModel',
};
AssetImporterView.prototype.bindings = {
  'input[name="remote_url"]': {
    observe: 'remote_url',
  },
  '.url_check': {
    observe: 'importmessage',
    updateMethod: 'html',
  },
  'a.submit': {
    classes: {
      available: 'importable',
    },
  },
};

export default AssetImporterView;
