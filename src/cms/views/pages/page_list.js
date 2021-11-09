import AssetListView from 'Views/assets/asset_list';
import ListedPageView from './listed_page';

class PageListView extends AssetListView {}


PageListView.prototype.childView = ListedPageView;

export default PageListView;
