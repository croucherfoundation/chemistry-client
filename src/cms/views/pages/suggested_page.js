import Template from 'Templates/pages/suggested_page';
import ListedPageView from './listed_page';

class SuggestedPageView extends ListedPageView {}
SuggestedPageView.prototype.template = Template;

export default SuggestedPageView;
