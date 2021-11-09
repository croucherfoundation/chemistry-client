import Term from 'Models/term';
import { getConfig } from 'Config/config';
import CmsCollection from './collection';

class TermsCollection extends CmsCollection {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.suggest = this.suggest.bind(this);
    this.fetch = this.fetch.bind(this);
    this.url = this.url.bind(this);
    this.debouncedSuggest = _.debounce(this.suggest, this);
    this.moveSelectionNext = this.moveSelectionNext.bind(this);
    this.moveSelectionLast = this.moveSelectionLast.bind(this);
    this.moveSelectionPrev = this.moveSelectionPrev.bind(this);
    this.moveSelectionFirst = this.moveSelectionFirst.bind(this);
    this.moveSelectionTo = this.moveSelectionTo.bind(this);
    this.currentSelection = this.currentSelection.bind(this);
  }

  termList() {
    return _.uniq(this.pluck('term')).join(',');
  }

  resetFromList(list = '') {
    if (list) {
      const termData = _.uniq(list.split(',')).map((term) => ({ term }));
      this.reset(termData, { silent: true });
    } else {
      this.reset([], { silent: true });
    }
  }

  suggest(q) {
    if (q !== this._q) {
      this._q = encodeURIComponent(q);
      this.fetch();
    }
  }

  moveSelectionNext() {
    const selection = this.currentSelection();
    if (selection) {
      const i = this.indexOf(selection);
      this.moveSelectionTo(i + 1);
    } else {
      this.moveSelectionFirst();
    }
  }

  moveSelectionLast() {
    this.moveSelectionTo(this.length - 1);
  }

  moveSelectionPrev() {
    const selection = this.currentSelection();
    if (selection) {
      const i = this.indexOf(selection);
      this.moveSelectionTo(i - 1);
    } else {
      this.moveSelectionLast();
    }
  }

  moveSelectionFirst() {
    this.moveSelectionTo(0);
  }

  moveSelectionTo(i = 0) {
    let selectedIndex;
    if (i < 0) {
      selectedIndex = this.length - 1;
    } else if (i >= this.length) {
      selectedIndex = 0;
    } else {
      selectedIndex = i;
    }
    this.each((term, j) => {
      term.set('selected', j === selectedIndex);
    });
  }

  currentSelection() {
    return this.findWhere({ selected: true });
  }

  // returns a promise
  fetch(...args) {
    const fetcher = $.Deferred();
    if (this._q && this._q.length >= 2) {
      const models = TermsCollection.cachedState(this._q);
      if (models) {
        this.reset(models);
        return fetcher.resolve(models).promise();
      }
      super.fetch(...args).done(() => {
        TermsCollection.suggestionCache[this._q] = this.models;
        fetcher.resolve(this.models);
      });
      return fetcher.promise();
    }
    this.reset();
    return fetcher.resolve([]).promise();
  }

  url() {
    return getConfig('terms_url') + this._q;
  }

  static cachedState(query) {
    return TermsCollection.suggestionCache[query];
  }
}

TermsCollection.suggestionCache = {};
TermsCollection.class_key = 'terms';
TermsCollection.prototype.model = Term;
TermsCollection.prototype.singularName = 'term';
TermsCollection.prototype.pluralName = 'terms';

export default TermsCollection;
