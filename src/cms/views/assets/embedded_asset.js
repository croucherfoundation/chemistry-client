// EmbeddedAssetView is a base class for embedded assets and asset collections;
// it shows controls and defines some signals but content decisions and display
// are left to the subclass.


import CmsView from 'Views/base/view';

class EmbeddedAssetView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.focus = this.focus.bind(this);
    this.setModel = this.setModel.bind(this);
    this.onSetModel = this.onSetModel.bind(this);
    this.isPopulated = this.isPopulated.bind(this);
  }

  onAfterRender() {
    const ControlViewClass = this.getOption('controlView');
    if (ControlViewClass) {
      this.controlView = new ControlViewClass({ model: this.model });
      this.showChildView('controls', this.controlView);
      this.controlView.on('replaced', (model) => this.setModel(model));
      this.controlView.on('removed', () => this.removeModel());
      if (!this.isPopulated()) this.controlView.open();
    }
  }

  focus() {
    // noop here
  }

  setModel(model) {
    if (this.model !== model) {
      this.triggerMethod('set:model', this, model);
    }
  }

  onSetModel(view, model) {
    this.model = model;
    if (this.controlView) this.controlView.reset();
    this.stickit();
  }

  removeModel() {
    this.trigger('removed', this.model);
  }

  isSaved() {
    return this.model && !this.model.isNew();
  }

  cleanContent() {
    if (this.isPopulated()) {
      const cleanEl = this.cleanCopy();
      return cleanEl.outerHTML;
    }
    return '';
  }
}


EmbeddedAssetView.prototype.tagName = 'figure';
EmbeddedAssetView.prototype.regions = {
  controls: '.cms-embed-controls',
};


export default EmbeddedAssetView;
