import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Document from 'Models/document';
import Template from 'Templates/documents/embedded_document.html';
import DocumentChooserView from './document_chooser';

class EmbeddedDocumentView extends EmbeddedAssetView {
  onBeforeRender() {
    const attributes = { id: this.el.dataset.document };
    const linkEl = this.el.querySelector('a.document');
    if (linkEl) attributes.file_url = linkEl.href;
    const labelEl = this.el.querySelector('span.label');
    if (labelEl) attributes.title = labelEl.innerText;
    this.model = new Document(attributes);
  }

  fileExtension(fileName = '') {
    return fileName.split('.').pop();
  }

  documentId(id) {
    return `document_${id}`;
  }

  titleOrPrompt([title, fileName]) {
    return title || fileName;
  }

  fileSymbol(fileName) {
    if (fileName) {
      let ext = this.fileExtension(fileName);
      if (ext === 'xlsx') ext = 'xls';
      if (ext === 'docx') ext = 'doc';
      if (!['pdf', 'doc', 'ppt', 'xls'].includes(ext)) ext = 'file';
      return `/spritemap.svg#sprite-${ext}`;
    }
    return '/spritemap.svg#sprite-file';
  }

  allowEdit(e) {
    if (e) e.preventDefault();
  }
}


EmbeddedDocumentView.prototype.controlView = DocumentChooserView;
EmbeddedDocumentView.prototype.template = Template;
EmbeddedDocumentView.prototype.className = 'document';
EmbeddedDocumentView.prototype.events = {
  'click span.label': 'allowEdit',
};
EmbeddedDocumentView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'data-document',
        observe: 'id',
      },
    ],
  },
  'a.document': {
    attributes: [
      {
        name: 'href',
        observe: 'file_url',
      },
      {
        name: 'class',
        observe: 'file_name',
        onGet: 'fileExtension',
      },
    ],
  },
  'use.file_type': {
    attributes: [
      {
        name: 'href',
        observe: 'file_name',
        onGet: 'fileSymbol',
      },
    ],
  },
  'span.filename': {
    observe: ['title', 'file_name'],
    onGet: 'titleOrPrompt',
  },
};

export default EmbeddedDocumentView;
