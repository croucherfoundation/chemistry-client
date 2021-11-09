import Quote from 'Models/quote';
import CmsCollection from './collection';

class QuotesCollection extends CmsCollection {}

QuotesCollection.prototype.model = Quote;
QuotesCollection.prototype.singularName = 'quote';
QuotesCollection.prototype.pluralName = 'quotes';

export default QuotesCollection;
