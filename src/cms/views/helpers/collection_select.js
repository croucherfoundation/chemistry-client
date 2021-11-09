import CmsCollectionView from 'Views/base/collection_view';
import ModelOptionView from './model_option';
import NoModelOptionView from './no_model_option';

class CollectionSelectView extends CmsCollectionView {
  constructor(...args) {
    super(...args);
    this.childViewOptions = this.childViewOptions.bind(this);
    this.setSelection = this.setSelection.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
  }

  initialize() {
    this._attribute = this.getOption('attribute');
    this._allow_blank = this.getOption('allowBlank');
  }

  onAfterRender() {
    this.collection.loadAnd(() => {
      if (this._allow_blank) {
        this.collection.add({
          title: '',
        }, { at: 0 });
      }
      if (!this.model.get(this._attribute)) this.setSelection();
    });
  }

  childViewOptions(model) {
    return {
      model,
      holder: this.model,
      attribute: this._attribute,
    };
  }

  setSelection() {
    const selectionId = this.$el.val();
    if (selectionId) {
      this.model.set(this._attribute, parseInt(selectionId, 10));
    } if (this._allow_blank) {
      this.model.set(this._attribute, null);
    } else {
      this.model.set(this._attribute, this.collection.first());
    }
  }
}

CollectionSelectView.prototype.tagName = 'select';
CollectionSelectView.prototype.childView = ModelOptionView;
CollectionSelectView.prototype.emptyView = NoModelOptionView;
CollectionSelectView.prototype.events = {
  change: 'setSelection',
};

export default CollectionSelectView;
