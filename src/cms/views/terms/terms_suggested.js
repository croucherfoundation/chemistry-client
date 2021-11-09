import CmsCollectionView from 'Views/base/collection_view';
import SuggestedTermView from './suggested_term';
import NoSuggestedTermView from './no_suggested_term';

class TermsSuggestedView extends CmsCollectionView {
  constructor(...args) {
    super(...args);
    this.pickTerm = this.pickTerm.bind(this);
    this.initialize = this.initialize.bind(this);
    this.childViewOptions = this.childViewOptions.bind(this);
  }

  initialize(options = {}) {
    if (options.excluded) {
      this._exclusions = options.excluded;
      this._exclusions.on('add remove reset', this.setAvailability.bind(this));
      this.collection.on('add remove reset', this.setAvailability.bind(this));
      this.setAvailability();
    }
  }

  pickTerm(child) {
    const model = child.model;
    if (model) this.trigger('select', model);
  }

  setAvailability() {
    this.collection.each((model) => {
      const exclusion = this._exclusions.findWhere({ term: model.get('term') });
      model.set('unavailable', !!exclusion);
    });
  }

  childViewOptions(model) {
    const unavailable = model && !!this._exclusions.findWhere({ term: model.get('term') });
    return {
      model,
      unavailable,
    };
  }
}


TermsSuggestedView.prototype.childView = SuggestedTermView;
TermsSuggestedView.prototype.emptyView = NoSuggestedTermView;
TermsSuggestedView.prototype.childViewEvents = {
  select: 'pickTerm',
};

export default TermsSuggestedView;
