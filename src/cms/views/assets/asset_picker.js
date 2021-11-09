import CmsView from 'Views/base/view';
import AssetListView from './asset_list';

class AssetPickerView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.unfilterCollection = this.unfilterCollection.bind(this);
    this.selectModel = this.selectModel.bind(this);
  }

  initialize() {
    this.model = this.collection.getState();
  }

  onRender() {
    this.stickit();
    const ListViewClass = this.getOption('listView');
    if (ListViewClass) {
      const listView = new ListViewClass({ collection: this.collection });
      this.showChildView('list', listView);
      listView.on('select', this.selectModel.bind(this));
    }
  }

  unfilterCollection(e) {
    if (e) e.preventDefault();
    this.model.set('q', '');
  }

  selectModel(model) {
    this.trigger('replaced', model);
  }
}


AssetPickerView.prototype.tagName = 'div';
AssetPickerView.prototype.className = 'cms-picker';
AssetPickerView.prototype.listView = AssetListView;
AssetPickerView.prototype.regions = {
  list: '.pick',
};
AssetPickerView.prototype.ui = {
  q: 'input.q',
  filter: 'a.filter',
  reset: 'a.reset',
  close: 'a.close',
};
AssetPickerView.prototype.events = {
  'click @ui.filter': 'filterCollection',
  'click @ui.reset': 'unfilterCollection',
  'click @ui.close': 'close',
};
AssetPickerView.prototype.bindings = {
  'input.q': 'q',
  'a.filter': {
    observe: 'q',
    visible: 'untrue',
  },
  'a.reset': {
    observe: 'q',
    visible: true,
  },
};


export default AssetPickerView;
