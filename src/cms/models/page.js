import { slugify } from 'Utility/strings';
import { confirm } from 'Utility/notification';
import { translate } from 'Utility/i18n';
import TermsCollection from 'Collections/terms';
import sandboxPage from 'Sandbox/page.json';
import CmsModel from './model';

class Page extends CmsModel {
  constructor(...args) {
    super(...args);
    this.build = this.build.bind(this);
    this.publish = this.publish.bind(this);
    this.publishSucceeded = this.publishSucceeded.bind(this);
    this.publishFailed = this.publishFailed.bind(this);
    this.isPublished = this.isPublished.bind(this);
    this.setPublicationStatus = this.setPublicationStatus.bind(this);
    this.setSlug = this.setSlug.bind(this);
  }

  build() {
    this.terms = new TermsCollection();
    this.on('change:terms', this.getTerms);
    this.terms.on('add remove reset', this.setTerms.bind(this));
    this.on('change:title', this.setSlug.bind(this));
    this.on('change:updated_at change:published_at', this.setPublicationStatus.bind(this));
    this.on('change:collapsed', this.storeDisplayState.bind(this));
    this.setPublicationStatus();
  }

  load() {
    if (this.id === 'sandbox') {
      this.log('LOADING SANDBOX PAGE');
      const attributes = this.parse(sandboxPage);
      this.set(attributes);
      this.loaded(attributes);
    } else if (!this._loading && !this.isLoaded()) {
      this._loading = true;
      this._loader = this.fetch({ error: this.notLoaded }).done(this.loaded);
    }
    return this._loaded.promise();
  }

  setSlug() {
    const newTitle = this.get('title');
    const previousTitle = this.previous('title');
    const presentSlug = this.get('slug');
    if (!presentSlug) {
      this.set('slug', slugify(newTitle));
    } else if (previousTitle && presentSlug === slugify(previousTitle)) {
      this.set('slug', slugify(newTitle));
    }
  }

  // terms list attribute -> terms collection
  getTerms(model, values, options) {
    if (!options.localReset) {
      model.terms.resetFromList(values);
    }
  }

  // terms collection -> terms list attribute
  setTerms() {
    const terms = this.terms.termList();
    this.set('terms', terms, { localReset: true });
  }

  // Tree climbing

  children() {
    return this.collection.where({ parent_id: this.id });
  }

  // Branch collapse
  toggleCollapse() {
    if (this.get('collapsed')) this.uncollapse();
    else this.collapse();
  }

  collapse() {
    this.concealChildren();
    this.set('collapsed', true);
  }

  uncollapse() {
    this.revealChildren();
    this.set('collapsed', false);
  }

  concealChildren() {
    this.children().forEach((p) => p.conceal());
  }

  revealChildren() {
    this.children().forEach((p) => p.reveal());
  }

  // called on change:collapsed to persist tree state in this browser.
  // stored values are read directly by the page tree view
  // so that tree state can be restored in a single fetch.
  //
  storeDisplayState() {
    const pageId = this.id.toString();
    const collapseList = localStorage.getItem('collapsed_pages') || '';
    const collapses = collapseList.split(',');
    const collapsed = this.get('collapsed');
    const i = collapses.indexOf(pageId);
    if (collapsed && i === -1) {
      collapses.push(pageId);
    } else if (!collapsed && i > -1) {
      collapses.splice(i, 1);
    }
    localStorage.setItem('collapsed_pages', collapses.join(','));
  }


  // Publishing

  publish() {
    const baseUrl = this.url();
    const publisher = $.ajax({
      url: `${baseUrl}/publish`,
      method: 'PUT',
    });
    publisher.done(this.publishSucceeded).fail(this.publishFailed);
    return publisher;
  }

  // render() {
  //   if (this._renderer == null) {
  //     this._renderer = new RenderedPage({model: this});
  //   }
  //   this._renderer.render();
  // }

  publishSucceeded(response) {
    const attributes = this.parse(response);
    this.set(attributes);
    confirm(translate('affirmations.page_published'));
  }

  publishFailed(request) {
    this.complain(`Error ${request.status}: ${request.responseText}`);
  }

  isPublished() {
    return !this.get('unpublished');
  }

  setPublicationStatus() {
    if (!this.get('published_at')) {
      this.set('unpublished', true);
      this.set('outofdate', true);
    } else {
      this.set('unpublished', false);
      this.set('outofdate', this.get('updated_at') > this.get('published_at'));
    }
  }
}


Page.prototype.singularName = 'page';
Page.prototype.pluralName = 'pages';
Page.prototype.savedAttributes = ['slug', 'title', 'masthead', 'content', 'byline', 'summary', 'style', 'private', 'terms', 'parent_id', 'page_collection_id', 'page_category_id', 'image_id'];
Page.prototype.defaults = {
  busy: false,
  style: 'heroic', // TODO collection default style
  depth: 0,
  populated: false,
  parental: false, // I have children
  collapsed: false, // my children are hidden in tree
  concealed: false, // I am hidden in tree
};


export default Page;
