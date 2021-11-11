import ListedAssetView from 'Views/assets/listed_asset';
import Template from 'Templates/documents/listed_document.html';
import { translate } from 'Utility/i18n';
import { truncate } from 'Utility/strings';

class ListedDocumentView extends ListedAssetView {
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

  fileExtension(fileName = '') {
    return fileName.split('.').pop();
  }

  truncatedTitle([title, fileName]) {
    const name = title || fileName || translate('missing.document.title');
    return truncate(name, 32);
  }

  readableFileSize() {
    // TODO
  }
}


ListedDocumentView.prototype.template = Template;
ListedDocumentView.prototype.tagName = 'li';
ListedDocumentView.prototype.className = 'document';
ListedDocumentView.prototype.events = {
  'click a.delete': 'deleteModel',
  'click a.document': 'selectMe',
};
ListedDocumentView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'data-document',
        observe: 'id',
      },
    ],
  },
  'a.preview': {
    attributes: [
      {
        name: 'href',
        observe: 'file_url',
      },
    ],
  },
  'a.document': {
    attributes: [
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
  'span.label': {
    observe: ['title', 'file_name'],
    onGet: 'truncatedTitle',
  },
  'span.size': {
    observe: 'file_size',
    onGet: 'readableFileSize',
  },
};


export default ListedDocumentView;
