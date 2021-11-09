import CmsView from 'Views/base/view';

class ModelOptionView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.getApp = this.getApp.bind(this);
    this.getOptionValue = this.getOptionValue.bind(this);
    this.getOptionText = this.getOptionText.bind(this);
  }

  initialize() {
    this._holder = this.getOption('holder');
    this._attribute = this.getOption('attribute');
  }

  onRender() {
    const label = this.getOptionText();
    const value = this.getOptionValue();
    if (this._holder.get(this._attribute) === value) {
      this.$el.attr('selected', 'selected');
    } else if (!this._holder.get(this._attribute) && !value) {
      this.$el.attr('selected', 'selected');
    } else {
      this.el.removeAttribute('selected');
    }
    this.el.value = value;
    this.el.innerText = label || '';
  }

  getApp() {
    return this._holder.getApp();
  }

  getOptionValue() {
    const id = this.model.get('id');
    if (id) return parseInt(id, 10);
    return '';
  }

  getOptionText() {
    return this.model.get('title') || this.model.get('name');
  }
}

ModelOptionView.prototype.tagName = 'option';


export default ModelOptionView;
