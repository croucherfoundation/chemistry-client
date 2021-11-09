import AssetListView from 'Views/assets/asset_list';
import TreePageView from './tree_page';

class PageTreePickerView extends AssetListView {}


PageTreePickerView.prototype.childView = TreePageView;

export default PageTreePickerView;
