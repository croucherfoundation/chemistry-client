// Term is really just a wrapper around a string,
// which is held as the 'term' attribute.

import CmsModel from './model';

class Term extends CmsModel {}

Term.prototype.singularName = 'term';
Term.prototype.pluralName = 'terms';
Term.prototype.savedAttributes = [];


export default Term;
