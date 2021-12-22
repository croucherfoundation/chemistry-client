import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Template from 'Templates/customTest/embedded_customTest.html';
import CustomTest from 'Models/customTest';

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
      const customTestContentEl = el.querySelector('div');
      if (customTestContentEl) attributes.customTestContent = customTestContentEl.innerText;
      console.log('embedded_customTest > attributes', attributes);
    }
    this.model = new CustomTest(attributes);
    this.model.on('change', this.contentChange.bind(this));
  }

  focus() {
    this.ui.customTest.focus();
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

EmbeddedCustomTestView.prototype.template = Template;
EmbeddedCustomTestView.prototype.className = 'customTest';

EmbeddedCustomTestView.prototype.ui = {
  customTest: '.customTestContent',
};

EmbeddedCustomTestView.prototype.bindings = {
  ':el': {
    attributes: [{
      name: 'class',
      observe: 'customTestContent',
      onGet: 'classFromLength',
    },
    ],
  },
  div: {
    observe: 'customTestContent',
  },
};


export default EmbeddedCustomTestView;
