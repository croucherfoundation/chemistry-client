import CmsModel from './model';

class Quote extends CmsModel {
  isPopulated() {
    return !!this.get('utterance').trim();
  }
}

Quote.prototype.singularName = 'quote';
Quote.prototype.pluralName = 'quotes';
Quote.prototype.savedAttributes = [];
Quote.prototype.defaults = {
  asset_type: 'quote',
  utterance: '',
  caption: '',
};

export default Quote;
