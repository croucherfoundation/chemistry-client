import CmsCollectionView from 'Views/base/collection_view';
import TreePageView from './tree_page';

class PageTreeView extends CmsCollectionView {
  constructor(...args) {
    super(...args);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
  }

  onBeforeRender() {
    this.collection.buildTree();
  }

  onAfterRender() {
    // const collapseList = localStorage.getItem('collapsed_pages') || '';
    // const collapses = collapseList.split(',');
    // collapses.forEach((pageId) => {
    //   const page = this.collection.get(parseInt(pageId, 10));
    //   if (page) page.collapse();
    // });
  }
}


PageTreeView.prototype.childView = TreePageView;
PageTreeView.prototype.tagName = 'ul';
PageTreeView.prototype.className = 'page_tree';
PageTreeView.prototype.childViewTriggers = {
  selected: 'selected',
};

export default PageTreeView;
