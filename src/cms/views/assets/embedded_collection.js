// Embedded is a base class for embedded assets and asset collections;
// it shows controls and defines some signals but content decisions are left to the subclass.


import CmsCollectionView from 'Views/base/collection_view';

class EmbeddedCollectionView extends CmsCollectionView {
  constructor(...args) {
    super(...args);
    this.addEmbed = this.addEmbed.bind(this);
    this.removeEmbed = this.removeEmbed.bind(this);
    this.focus = this.focus.bind(this);
  }

  addEmbed(e) {
    if (e) e.preventDefault();
    this.collection.add({});
  }

  removeEmbed(model) {
    this.collection.remove(model);
    this.render();
  }

  replaceEmbed(view, model) {
    const index = this.collection.indexOf(view.model);
    const previousModel = view.model;
    model.checkChanges();
    this.collection.add(model, { at: index });
    this.collection.remove(previousModel);
    this.contentChange();
  }

  focus() {
    // noop here
  }

  // overridden in masthead to set attribute directly
  contentChange() {
    this.trigger('updated');
  }
}


EmbeddedCollectionView.prototype.tagName = 'div';
EmbeddedCollectionView.prototype.ui = {
  add: 'a.add',
};
EmbeddedCollectionView.prototype.events = {
  'click @ui.add': 'addEmbed',
};
EmbeddedCollectionView.prototype.childViewEvents = {
  updated: 'contentChange',
  removed: 'removeEmbed',
  'set:model': 'replaceEmbed',
};


export default EmbeddedCollectionView;
