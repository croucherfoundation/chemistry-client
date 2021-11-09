import CmsCollectionView from 'Views/base/collection_view';
import AttachedTermView from './attached_term';

class TermsAttachedView extends CmsCollectionView {}


TermsAttachedView.prototype.childView = AttachedTermView;

export default TermsAttachedView;
