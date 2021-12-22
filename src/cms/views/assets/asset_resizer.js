import CmsView from 'Views/base/view';

class AssetResizerView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.updateEmbedImages = this.updateEmbedImages.bind(this);
    this.updateModel = this.updateModel.bind(this);
  }


  onBeforeRender() {
    // console.groupCollapsed('onBeforeRender > model');
    const attributes = {};
    const ModelClass = this.modelClass;

    if (ModelClass) this.model = new ModelClass(attributes);
    this.model.on('change', this.contentChange.bind(this));

    // console.groupEnd();
  }

  onAfterRender() {
    const align = this.el.getAttribute('data-align');

    if (align) {
      switch (align) {
        case 'left': this.alignLeft(); break;
        case 'center': this.alignCenter(); break;
        case 'right': this.alignRight(); break;
        default: this.alignCenter(); break;
      }
    }
  }

  // onBeforeRender() {
  //   const attributes = {};
  //   const el = this.getOption('content');
  //   if (el) {
  //     const customTestContentEl = el.querySelector('div');
  //     if (customTestContentEl) attributes.customTestContent = customTestContentEl.innerText;
  //     console.log('embedded_customTest > attributes', attributes);
  //   }
  //   this.model = new CustomTest(attributes);
  //   this.model.on('change', this.contentChange.bind(this));
  // }

  alignLeft() {
    this.updateModel('left');
    this.updateEmbedImages('left');
  }

  alignCenter() {
    this.updateModel('center');
    this.updateEmbedImages('center');
  }

  alignRight() {
    this.updateModel('right');
    this.updateEmbedImages('right');
  }

  updateModel(newAlign) {
    this.el.setAttribute('data-align', newAlign);
    // this.model.save().done(() => this.trigger('created', this.model));
    // this.model.save().done(() => this.trigger('replaced', this.model));

    // this.trigger('select', this.model);
  }

  updateEmbedImages(newAlign) {
    document.querySelector('.embed.images').classList.remove('left', 'center', 'right');
    document.querySelector('.embed.images').classList.add(newAlign);
  }

  resizeImage(e) {
    const newWidth = e.target.value;
    console.log('resizeImage', newWidth);

    document.querySelector('.embed.images').style = `--width: ${newWidth}px`;
  }
}

AssetResizerView.prototype.tagName = 'section';
AssetResizerView.prototype.className = 'resizeInputs';
AssetResizerView.prototype.ui = {
  width: 'input[name="width"]',
  left: 'span.left',
  center: 'span.center',
  right: 'span.right',
};
AssetResizerView.prototype.events = {
  'focusout @ui.width': 'resizeImage',
  'click @ui.left': 'alignLeft',
  'click @ui.center': 'alignCenter',
  'click @ui.right': 'alignRight',
};
AssetResizerView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'data-align',
        observe: 'alignment',
      },
    ],
  },
};

export default AssetResizerView;
