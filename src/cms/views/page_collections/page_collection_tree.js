import CmsView from 'Views/base/view';
import PagesCollection from 'Collections/pages';
import PageTreeView from 'Views/pages/page_tree';
import Template from 'Templates/page_collections/page_collection_tree.html';

class PageCollectionTreeView extends CmsView {
  onAfterRender() {
    this.collection = new PagesCollection([], {
      p: 1,
      pp: 'all',
      filter: {
        page_collection_id: this.model.id,
      },
    });
    this.treeView = new PageTreeView({ collection: this.collection });
    this.showChildView('tree', this.treeView);
    this.treeView.on('selected', this.selectedView.bind(this));
    this.hideTree();
  }

  toggleTree() {
    if (this.ui.toggled.is(':visible')) this.hideTree();
    else this.showTree();
  }

  showTree() {
    this.ui.toggle.addClass('waiting');
    this.collection.loadAnd(() => {
      this.ui.toggle.removeClass('waiting');
      this.ui.toggled.slideDown();
      this.ui.toggle.addClass('open');
      this.trigger('opened');
    });
  }

  hideTree() {
    this.ui.toggled.slideUp();
    this.ui.toggle.removeClass('open');
  }

  selectedView(view) {
    this.trigger('selected', view.model);
  }

  createCollectionPage(e) {
    if (e) e.preventDefault();
    window.np = this.collection.add({
      page_collection_id: this.model.id,
      style: 'texty',
    }, {
      at: 0,
    });
  }
}


PageCollectionTreeView.prototype.template = Template;
PageCollectionTreeView.prototype.className = 'page_collection_tree';
PageCollectionTreeView.prototype.events = {
  'click a.toggle': 'toggleTree',
  'click a.add': 'createCollectionPage',
};
PageCollectionTreeView.prototype.ui = {
  toggled: 'div.toggled',
  toggle: 'a.toggle',
};
PageCollectionTreeView.prototype.regions = {
  tree: 'div.tree',
};
PageCollectionTreeView.prototype.bindings = {
  '.title': 'short_title',
};


export default PageCollectionTreeView;
