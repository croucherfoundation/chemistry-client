import CmsView from 'Views/base/view';
import PagesCollection from 'Collections/pages';
import PageTreeView from 'Views/pages/page_tree';
import Template from 'Templates/pages/page_main_tree';

class PageMainTreeView extends CmsView {
  onAfterRender() {
    this.collection = new PagesCollection([], {
      p: 1,
      pp: 'all',
      filter: {
        page_collection_id: null,
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
}


PageMainTreeView.prototype.template = Template;
PageMainTreeView.prototype.className = 'page_collection_tree';
PageMainTreeView.prototype.events = {
  'click a.toggle': 'toggleTree',
};
PageMainTreeView.prototype.ui = {
  toggled: 'div.toggled',
  toggle: 'a.toggle',
};
PageMainTreeView.prototype.regions = {
  tree: 'div.tree',
};
PageMainTreeView.prototype.bindings = {
  '.title': 'short_title',
};


export default PageMainTreeView;
