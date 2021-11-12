/*
 * The FormatHelper is a clean and minimal toolbar
 * that applies format to selected text in a tidy way.
 * It avoids execCommand and uses modern selections and ranges.
 */

import CmsView from 'Views/base/view';
import PagesCollection from 'Collections/pages';
import SuggestedPagesView from 'Views/pages/suggested_pages';
import Template from 'Templates/helpers/anchor_helper';
import { Model } from 'backbone';

class AnchorHelperView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.place = this.place.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  initialize() {
    this.collection = new PagesCollection([]);
    this.model = new Model();
    document.body.appendChild(this.el);
  }

  help({ node, range }) {
    this.log('help', node, range);
    this.releaseNode();
    this.bindNode(node);
    this._range = range;
    this.render();
    this.place();
    this.show();
    this.model.on('change', this.updateViews.bind(this));
    this.collection.on('add remove reset', _.debounce(this.setSuggestionVisibility.bind(this), 200));
    this.setSuggestionVisibility();
  }

  bindNode(node) {
    if (node && node.nodeType !== 3) {
      this.helped_el = node;
      this.model.set({
        href: node.href,
        title: node.title,
        cssclass: node.className,
        pops: node.target === '_blank',
      });
      node.classList.add('composing');
    }
  }

  releaseNode() {
    if (this.helped_el) {
      this.helped_el.classList.remove('composing');
      this.helped_el = null;
    }
  }

  onRender() {
    this.stickit();
    this._suggestions_list = new SuggestedPagesView({
      collection: this.collection,
    });
    this.showChildView('suggestions', this._suggestions_list);
    this._suggestions_list.on('select', this.applySuggestion.bind(this));
    this.makeSuggestions();
    this.ui.href.focus();
  }

  updateViews() {
    if (this.helped_el) {
      const href = this.model.get('href');
      if (href) this.helped_el.href = href;
      else this.helped_el.removeAttribute('href');
      const title = this.model.get('title');
      if (title) this.helped_el.title = title;
      else this.helped_el.removeAttribute('title');
      const cssclass = this.model.get('cssclass');
      if (cssclass) this.helped_el.className = cssclass;
      else this.helped_el.className = '';
      const pops = this.model.get('pops');
      if (pops) this.helped_el.target = '_blank';
      else this.helped_el.removeAttribute('target');
      this.makeSuggestions(href);
    }
  }

  makeSuggestions(href) {
    if (href) {
      this.collection.setQuery(href);
    } else {
      this.collection.reset();
    }
    this.setSuggestionVisibility();
  }

  setSuggestionVisibility() {
    let suggestions = this.collection.models;
    if (this.model.get('path')) {
      suggestions = suggestions.filter((p) => p.get('path') !== this.model.get('path'));
    }
    this.log('setSuggestionVisibility', suggestions.length);
    if (suggestions.length) {
      this.ui.suggestions_holder.show();
    } else {
      this.ui.suggestions_holder.hide();
    }
  }

  applySuggestion(page) {
    const path = page.get('path');
    const title = page.get('title');
    if (path) {
      const href = `/${path}`;
      this.model.set({
        href,
        path,
        title,
      });
    }
    this.log('applySuggestion', page, '=>', _.clone(this.model.attributes));
    this.close();
  }

  // Helpers

  placeOn(el) {
    this.log('placeOn', el);
    if (el) {
      this.place(el.getBoundingClientRect);
    }
  }

  place() {
    let rect;
    if (this.helped_el) {
      rect = this.helped_el.getBoundingClientRect();
    } else if (this._range) {
      rect = this._range.getBoundingClientRect();
    }
    if (rect) {
      const t = rect.bottom + window.scrollY + 6;
      const l = rect.left + window.scrollX + rect.width / 2;
      this.el.style.top = `${t}px`;
      this.el.style.left = `${l}px`;
    }
    this.offsetIntoView();
    this.el.scrollIntoViewIfNeeded();
  }

  // TODO recalculate offset on view changes
  offsetIntoView() {
    const rect = this.el.getBoundingClientRect();
    const overshoot = rect.left + rect.width + 10 - window.innerWidth;
    const body = this.el.querySelector('.cms-bg');
    this.log('floater overshoot', overshoot);
    if (overshoot > 0) {
      body.style.transform = `translate(${-overshoot}px, 0)`;
    } else {
      body.style.transform = 'translate(0, 0)';
    }
  }

  show() {
    this.el.classList.add('showing');
  }

  hide() {
    this.releaseNode();
    this.el.classList.remove('showing');
  }

  close(e) {
    if (e) e.preventDefault();
    this.hide();
    this.trigger('close');
  }

  removeNode(e) {
    if (e) e.preventDefault();
    this.hide();
    this.trigger('remove');
  }

  toggleDetails(e) {
    if (e) e.preventDefault();
    if (this.ui.details_holder.hasClass('open')) {
      this.ui.toggle.removeClass('open');
      this.ui.details_holder.removeClass('open');
    } else {
      this.ui.toggle.addClass('open');
      this.ui.details_holder.addClass('open');
    }
  }
}


AnchorHelperView.prototype.tagName = 'div';
AnchorHelperView.prototype.className = 'cms-floater cms-linker';
AnchorHelperView.prototype.template = Template;
AnchorHelperView.prototype.ui = {
  body: '.cms-bg',
  suggestions_holder: 'div.suggestions',
  details_holder: 'div.details',
  href: 'input[name="href"]',
  cssclass: 'input[name="class"]',
  title: 'input[name="title"]',
  close: 'a.close',
  toggle: 'a.detail',
  remove: 'a.remove',
};
AnchorHelperView.prototype.events = {
  'click @ui.set': 'setLink',
  'click @ui.toggle': 'toggleDetails',
  'click @ui.close': 'close',
  'click @ui.remove': 'removeNode',
};
AnchorHelperView.prototype.regions = {
  suggestions: 'div.suggested_page_list',
};
AnchorHelperView.prototype.bindings = {
  'input[name="href"]': 'href',
  'input[name="title"]': 'title',
  'input[name="pops"]': 'pops',
};


export default AnchorHelperView;
