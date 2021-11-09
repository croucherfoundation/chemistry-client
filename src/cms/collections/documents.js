import Document from 'Models/document';
import CmsCollection from './collection';

class DocumentsCollection extends CmsCollection {}

DocumentsCollection.class_key = 'documents';
DocumentsCollection.prototype.model = Document;
DocumentsCollection.prototype.singularName = 'document';
DocumentsCollection.prototype.pluralName = 'documents';

export default DocumentsCollection;
