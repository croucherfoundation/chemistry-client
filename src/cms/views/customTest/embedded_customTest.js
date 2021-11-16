import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Template from 'Templates/customTest/embedded_customTest.html';
import Quote from 'Models/quote';

class EmbeddedCustomTestView extends EmbeddedAssetView {
  constructor(...args) {
    super(...args);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.focus = this.focus.bind(this);
  }

  onBeforeRender() {
    const attributes = {};
    const el = this.getOption('content');
    if (el) {
      const utterance = el.querySelector('blockquote');
      if (utterance) attributes.utterance = utterance.innerText;
      const caption = el.querySelector('figcaption');
      if (caption) attributes.caption = caption.innerText;
    }
    this.model = new Quote(attributes);
    this.model.on('change', this.contentChange.bind(this));
  }

  focus() {
    this.ui.quote.focus();
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

EmbeddedQuoteView.prototype.template = Template;
EmbeddedQuoteView.prototype.className = 'quote';

EmbeddedQuoteView.prototype.ui = {
  quote: 'blockquote',
  caption: 'figcaption',
};

EmbeddedQuoteView.prototype.bindings = {
  ':el': {
    attributes: [{
      name: 'class',
      observe: 'utterance',
      onGet: 'classFromLength',
    },
    ],
  },
  blockquote: {
    observe: 'utterance',
  },
  figcaption: {
    observe: 'caption',
  },
};


export default EmbeddedQuoteView;
