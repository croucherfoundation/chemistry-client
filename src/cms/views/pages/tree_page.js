import Template from 'Templates/pages/tree_page.html';
import ListedPageView from './listed_page';

class TreePageView extends ListedPageView {
  toggleCollapse(e) {
    if (e) e.preventDefault();
    this.model.toggleCollapse();
  }
}


TreePageView.prototype.template = Template;
TreePageView.prototype.events = {
  'click a.toggle': 'toggleCollapse',
  'click a.page': 'selectPage',
  'click a.save': 'savePage',
};
TreePageView.prototype.triggers = {
  'click a.page': 'selected',
};


export default TreePageView;
