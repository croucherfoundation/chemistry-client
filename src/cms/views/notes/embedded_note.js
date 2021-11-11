// TODO retrieve footnote logic from chemistry

import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Template from 'Templates/notes/embedded_note.html';
import Note from 'Models/note';

class EmbeddedNoteView extends EmbeddedAssetView {
  constructor(...args) {
    super(...args);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.focus = this.focus.bind(this);
  }

  onBeforeRender() {
    const attributes = {};
    const el = this.getOption('content');
    if (el) {
      const p = el.querySelector('p');
      if (p) attributes.text = p.innerText;
    }
    this.model = new Note(attributes);
    this.model.on('change', this.contentChange.bind(this));
  }

  focus() {
    return this.ui.note.focus();
  }

  classFromLength(text = '') {
    const l = text.replace(/&nbsp;/g, ' ').trim().length;
    if (l < 24) {
      return 'veryshort';
    } if (l < 48) {
      return 'short';
    } if (l < 96) {
      return 'shortish';
    }
    return '';
  }
}

EmbeddedNoteView.prototype.template = Template;
EmbeddedNoteView.prototype.className = 'note';

EmbeddedNoteView.prototype.ui = {
  note: 'p',
};

EmbeddedNoteView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'class',
        observe: 'text',
        onGet: 'classFromLength',
      },
    ],
  },
  p: {
    observe: 'text',
  },
};


export default EmbeddedNoteView;
