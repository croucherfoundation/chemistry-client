import AssetPickerView from 'Views/assets/asset_picker';
import Template from 'Templates/pages/page_picker';
import PageListView from './page_list';

class PagePickerView extends AssetPickerView {
  selectModel(model) {
    this.trigger('selected', model);
  }
}


PagePickerView.prototype.listView = PageListView;
PagePickerView.prototype.template = Template;

export default PagePickerView;
