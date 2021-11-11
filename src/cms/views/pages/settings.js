import CmsView from 'Views/base/view';
import Template from 'Templates/pages/settings.html';
import CollectionSelectView from 'Views/helpers/collection_select';
import PageCollectionsCollection from 'Collections/page_collections';
import PageCategoriesCollection from 'Collections/page_categories';
import PagesCollection from 'Collections/pages';
import PageTermsView from 'Views/pages/terms';

class PageSettingsView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  onAfterRender() {
    this.showChildView('collection', new CollectionSelectView({
      model: this.model,
      attribute: 'page_collection_id',
      collection: new PageCollectionsCollection(),
    }));
    this.showChildView('category', new CollectionSelectView({
      model: this.model,
      attribute: 'page_category_id',
      collection: new PageCategoriesCollection(),
      allowBlank: true,
    }));
    this.showChildView('parent', new CollectionSelectView({
      model: this.model,
      attribute: 'parent_id',
      collection: new PagesCollection(),
      allowBlank: true,
    }));
    this.showChildView('terms', new PageTermsView({
      model: this.model,
    }));
  }

  toggleDetails(e) {
    if (e) e.preventDefault();
    if (this.ui.toggle.hasClass('open')) {
      this.ui.details.slideUp('fast');
      this.ui.toggle.removeClass('open');
    } else {
      this.ui.toggle.addClass('open');
      this.ui.details.slideDown('fast');
    }
  }
}


PageSettingsView.prototype.template = Template;
PageSettingsView.prototype.regions = {
  style: 'div.page_style',
  collection: '.page_collection',
  category: '.page_category',
  parent: '.page_parent',
  terms: '.page_terms',
};
PageSettingsView.prototype.ui = {
  toggle: 'a.toggle',
  details: '.details',
};
PageSettingsView.prototype.events = {
  'click @ui.toggle': 'toggleDetails',
};
PageSettingsView.prototype.bindings = {
  'input[name="slug"]': 'slug',
  'input[name="private"]': 'private',
  'input[name="style"]': 'style',
  'input[name="byline"]': 'byline',
  'textarea[name="summary"]': 'summary',
};

export default PageSettingsView;
