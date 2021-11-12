import MenuView from 'Views/base/menu';
import Template from 'Templates/assets/asset_placement';

class AssetPlacementView extends MenuView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.setModel = this.setModel.bind(this);
    this.setPlacement = this.setPlacement.bind(this);
  }

  onAfterRender() {
    if (this.model) {
      this.$el.show();
    } else {
      this.$el.hide();
    }
  }

  setModel(model) {
    this.model = model;
    this.render();
  }

  setPlacement(e) {
    e.preventDefault();
    const el = e.currentTarget;
    if (el) {
      const placement = el.dataset.placement;
      if (placement) {
        this.trigger('place', placement);
        this.close();
      }
    }
  }
}


AssetPlacementView.prototype.tagName = 'div';
AssetPlacementView.prototype.className = 'layout';
AssetPlacementView.prototype.template = Template;
AssetPlacementView.prototype.events = {
  'click @ui.head': 'toggleMenu',
  'click @ui.closer': 'close',
  'click a.placement': 'setPlacement',
};


export default AssetPlacementView;
