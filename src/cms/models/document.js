import CmsModel from './model';

class Document extends CmsModel {
  constructor(...args) {
    super(...args);
    this.isPopulated = this.isPopulated.bind(this);
  }

  isPopulated() {
    return this.has('file_url') || this.has('file_data');
  }
}


Document.prototype.singularName = 'document';
Document.prototype.pluralName = 'documents';
Document.prototype.savedAttributes = ['title', 'caption', 'file_data', 'file_name', 'remote_url'];
Document.prototype.uploadProgress = true;
Document.prototype.defaults = { asset_type: 'document', populated: false };

export default Document;
