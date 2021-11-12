import AssetChooserView from 'Views/assets/asset_chooser';
import Template from 'Templates/documents/document_chooser.html';
import { libraryDocuments } from 'Utility/library';
import DocumentPickerView from './document_picker';

class DocumentChooserView extends AssetChooserView {
  getCollection() {
    return libraryDocuments();
  }
}


DocumentChooserView.prototype.reuseView = DocumentPickerView;
DocumentChooserView.prototype.template = Template;

export default DocumentChooserView;
