import AssetPickerView from 'Views/assets/asset_picker';
import Template from 'Templates/documents/document_picker';
import DocumentListView from './document_list';

class DocumentPickerView extends AssetPickerView {}


DocumentPickerView.prototype.listView = DocumentListView;
DocumentPickerView.prototype.template = Template;

export default DocumentPickerView;
