import NothingView from 'Views/base/nothing';

class NoModelOptionView extends NothingView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
  }

  initialize() {
    this._attribute_name = this.getOption('attributeName');
  }

  onRender() {
    if (this._attribute_name) {
      this.$el.val('').text(`No ${this._attribute_name}`);
    }
  }
}

NoModelOptionView.prototype.tagName = 'option';


export default NoModelOptionView;
