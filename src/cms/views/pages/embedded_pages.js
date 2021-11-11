/*
  Page embedding is used for ToC and See Also lists.
  The list is usually rule-based (eg. all my children, or all matching my tags)
  but can also be by built by selection from the tree.
  Page embeds are always live: current page information is fetched according to the rule.
  Unlike embedded images, which are managed singly, the rule & list are managed directly here.

  The wrapper el will only define a rule: page lists are always fetched
  so that we track published url and title changes.
*/

import { Model } from 'backbone';
import EmbeddedCollectionView from 'Views/assets/embedded_collection';
import Template from 'Templates/pages/embedded_pages.html';
import PagesCollection from 'Collections/pages';
import EmbeddedPageView from './embedded_page';
import PagesChooserView from './pages_chooser';
import NoPageView from './no_page';


class EmbeddedPagesView extends EmbeddedCollectionView {
  constructor(...args) {
    super(...args);
    this.page = this.getOption('page');
    this.initialize = this.initialize.bind(this);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.showPageList = this.showPageList.bind(this);
  }

  initialize() {
    this.collection = new PagesCollection();
    // collection is just a display side-effect here: don't listen to it.
    // this.collection.on('add remove reset', this.contentChange.bind(this));
    this.state = new Model({
      content: 'list',
      heading: '',
      pages: [],
    });
  }

  // Read content and page id selection from data attributes
  onBeforeRender() {
    const wrappedEl = this.getOption('content');
    if (wrappedEl) {
      const headingEl = wrappedEl.querySelector('.toc_title');
      if (headingEl) this.state.set('heading', headingEl.innerText);
      const content = wrappedEl.dataset.content;
      // TODO: children:id for children of another page
      if (content === 'children') {
        this.state.set('content', 'children');
      } else if (content === 'similar') {
        this.state.set('content', 'similar');
      } else if (content === 'list') {
        this.state.set('content', 'list');
        const pages = wrappedEl.dataset.pages;
        if (pages) this.state.set('pages', pages.split(','));
      }
    }
    this.state.on('change:content change:pages', this.updateCollection.bind(this));
    this.state.on('change:heading', this.contentChange.bind(this));
  }

  onRender() {
    this.stickit(this.state, {
      '.toc_title': {
        observe: 'heading',
      },
      'a.pick': {
        observe: 'content',
        visible: 'ifList',
      },
      'a.add': {
        observe: 'content',
        visible: 'ifChildren',
      },
    });
    this.controlView = new PagesChooserView({ model: this.model });
    // but marionette gives us no regions in a collectionview
    this.controlView.$el.appendTo(this.ui.controls);
    this.controlView.render();
    this.controlView.on('mode', this.setMode.bind(this));
    this.controlView.on('select', this.addEmbed.bind(this));
    this.controlView.on('remove', this.removeEmbed.bind(this));
    if (!this.state.has('content')) this.controlView.open();
    this.setContent();
  }

  // Capture state changes
  updateCollection() {
    this.setContent();
    this.contentChange();
  }

  // Write content and page id selection to data attributes
  setContent() {
    const content = this.state.get('content');
    this.el.dataset.content = content;
    if (content === 'list') {
      const pages = this.state.get('pages') || [];
      delete this.el.dataset.page;
      this.el.dataset.pages = pages.join(',');
    } else {
      delete this.el.dataset.pages;
      this.el.dataset.page = this.page.id;
    }
    this.showPageList();
  }

  ifList(content) {
    return content === 'list';
  }

  ifChildren(content) {
    return content === 'children';
  }

  // The pages embed is a preview based on a rule.
  // the only UI actions are to choose the rule,
  // then possibly to choose a list of pages.
  // however this is also the obvious place for an 'add page' button.
  // NB no change events from here: it's just a preview
  //
  showPageList() {
    const content = this.state.get('content');
    if (content === 'children') {
      this.collection.resetFilter({ parent_id: this.page.id });
    } else if (content === 'similar') {
      this.collection.resetFilter({ similar: this.page.id });
    } else if (content === 'list') {
      const pages = this.state.get('pages') || [];
      if (pages.length) {
        this.collection.resetFilter({ ids: pages.join(',') });
      } else {
        this.collection.reset();
      }
    }
  }

  showControls() {
    if (this.controlView) this.controlView.open();
  }

  hideControls() {
    if (this.controlView) this.controlView.close();
  }

  setMode(mode) {
    if (this.content !== mode) {
      this.state.set('content', mode);
      this.showPageList();
    }
  }

  showPicker(e) {
    if (e) e.preventDefault();
    this.controlView.open();
    this.controlView.choosePage();
  }

  createChildPage(e) {
    if (e) e.preventDefault();
    this.collection.add({
      parent_id: this.page.id,
      page_collection_id: this.page.get('page_collection_id'),
      style: 'illustrated',
    });
  }

  addEmbed(page) {
    const pageIds = this.state.get('pages');
    const i = pageIds.indexOf(page.id);
    if (i === -1) pageIds.push(page.id);
    this.state.trigger('change:pages', this.state, pageIds);
    this.showPageList();
  }

  removeEmbed(page) {
    const pageIds = this.state.get('pages');
    const i = pageIds.indexOf(page.id);
    if (i > -1) pageIds.splice(i, 1);
    this.state.trigger('change:pages', this.state, pageIds);
    this.showPageList();
  }

  focus() {
    if (!this.isPopulated()) this.controlView.open();
  }

  isPopulated() {
    const content = this.state.get('content');
    const pages = this.state.get('pages');
    return content && (content !== 'list' || pages.length);
  }

  selectModel(model) {
    this.$el.trigger('navigate', model);
  }

  cleanContent() {
    const pageCount = this.collection.select((p) => p.isPopulated()).length;
    if (pageCount) {
      const cleanEl = this.cleanCopy();
      return cleanEl.outerHTML;
    }
    return '';
  }

  // TODO with the drag and drop sorting.
}


EmbeddedPagesView.prototype.controlView = PagesChooserView;
EmbeddedPagesView.prototype.template = Template;
EmbeddedPagesView.prototype.childView = EmbeddedPageView;
EmbeddedPagesView.prototype.emptyView = NoPageView;
EmbeddedPagesView.prototype.childViewContainer = '.collection';
EmbeddedPagesView.prototype.childViewEvents = {
  select: 'selectModel',
  deselect: 'removeEmbed',
};
EmbeddedPagesView.prototype.tagName = 'div';
EmbeddedPagesView.prototype.className = 'pages';
EmbeddedPagesView.prototype.content = null;
EmbeddedPagesView.prototype.events = {
  'click a.add': 'createChildPage',
  'click a.pick': 'showPicker',
};
EmbeddedPagesView.prototype.ui = {
  controls: '.cms-embed-controls',
  heading: 'h2',
};

export default EmbeddedPagesView;
