import AssetListView from 'Views/assets/asset_list';
import ListedDocumentView from './listed_document';
import NoDocumentView from './no_document';

class DocumentListView extends AssetListView {}


DocumentListView.prototype.childView = ListedDocumentView;
DocumentListView.prototype.emptyView = NoDocumentView;

export default DocumentListView;
