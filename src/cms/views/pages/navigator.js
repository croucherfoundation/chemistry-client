import CmsCollectionView from 'Views/base/collection_view';
import Template from 'Templates/pages/navigator';
import PageCollectionTreeView from 'Views/page_collections/page_collection_tree';
import { libraryPageCollections } from 'Utility/library';

class NavigatorView extends CmsCollectionView {
  initialize() {
    this.collection = libraryPageCollections();
  }

  jumpToPage(model) {
    // caught at the application level.
    // nice bit of underengineering if you ask me :)
    this.$el.trigger('navigate', model);
  }

  leaveEditor() {
    this.$el.trigger('exit');
  }
}


NavigatorView.prototype.template = Template;
NavigatorView.prototype.childView = PageCollectionTreeView;
NavigatorView.prototype.tagName = 'div';
NavigatorView.prototype.childViewContainer = 'div.page_collections';
NavigatorView.prototype.events = {
  'click a.exit': 'leaveEditor',
};
NavigatorView.prototype.childViewEvents = {
  selected: 'jumpToPage',
};

export default NavigatorView;
