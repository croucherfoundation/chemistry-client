import PageListView from './page_list';
import SuggestedPageView from './suggested_page';

class SuggestedPagesView extends PageListView {}
SuggestedPagesView.prototype.childView = SuggestedPageView;

export default SuggestedPagesView;
