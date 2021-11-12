import TermsCollection from 'Collections/terms';
import TermsAttachedView from 'Views/terms/terms_attached';
import TermsSuggestedView from 'Views/terms/terms_suggested';
import Template from 'Templates/pages/terms.html';
import CmsView from 'Views/base/view';

class PageTermsView extends CmsView {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.interceptNavigation = this.interceptNavigation.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.addTerm = this.addTerm.bind(this);
    this.resetPrompt = this.resetPrompt.bind(this);
  }

  initialize() {
    this.collection = new TermsCollection();
  }

  onAfterRender() {
    const attachedTerms = new TermsAttachedView({ collection: this.model.terms });
    this.showChildView('terms', attachedTerms);
    const suggestedTerms = new TermsSuggestedView({
      collection: this.collection,
      excluded: this.model.terms,
    });
    this.showChildView('suggestions', suggestedTerms);
    suggestedTerms.on('select', this.addTerm.bind(this));
    this.getSuggestions();
  }

  interceptNavigation(e) {
    if (e.code === 'ArrowDown') {
      this.collection.moveSelectionNext();
      return false;
    }
    if (e.code === 'PageDown') {
      this.collection.moveSelectionLast();
      return false;
    }
    if (e.code === 'ArrowUp') {
      this.collection.moveSelectionPrev();
      return false;
    }
    if (e.code === 'PageUp') {
      this.collection.moveSelectionFirst();
      return false;
    }
    if (e.code === 'Enter') {
      this.addTerm(this.collection.currentSelection());
      return false;
    }
    if (e.code === 'Escape') {
      this.resetPrompt();
      return false;
    }
    return true;
  }

  getSuggestions() {
    const q = this.ui.input.text();
    if (q && q.length) this.ui.reset.show();
    else this.ui.reset.hide();
    this.collection.debouncedSuggest(q);
  }

  addTerm(model) {
    this.model.terms.add({ term: model.get('term') });
    this.ui.input.focus();
  }

  resetPrompt(e) {
    if (e) e.preventDefault();
    this.ui.input.text('');
    this.getSuggestions();
    this.ui.input.focus();
  }
}


PageTermsView.prototype.template = Template;
PageTermsView.prototype.ui = {
  input: 'span.prompt',
  reset: 'a.reset',
};
PageTermsView.prototype.regions = {
  terms: 'div.terms',
  suggestions: 'div.suggestions',
};
PageTermsView.prototype.events = {
  'keydown @ui.input': 'interceptNavigation',
  'keyup @ui.input': 'getSuggestions',
  'click @ui.reset': 'resetPrompt',
};


export default PageTermsView;
