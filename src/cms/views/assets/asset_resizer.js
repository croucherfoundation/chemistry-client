import CmsView from 'Views/base/view';

class AssetResizerView extends CmsView {
  constructor(...args) {
    super(...args);
    this.embedImagesEl = document.querySelector('.embed.images');
  }

  onBeforeRender() {
    // const attributes = {};
    // const el = this.getOption('content');
    // if (el) {
    //   const alignEl = el.querySelector('.alignments');
    //   if (alignEl) attributes.alignment = alignEl.getAttribute('data-align');
    // }

    // const ModelClass = this.modelClass;
    // if (ModelClass) this.model = new ModelClass();

    // this.model = new ImageResizer(attributes);
    // this.model.on('change', this.contentChange.bind(this));
    // console.log('model in onBeforeRender from asset_resizer', this.model);
  }

  resizeImage(e) {
    const newWidth = e.target.value;
    console.log('resizeImage', newWidth);
    document.querySelector('.embed.images').style = `--width: ${newWidth}px`;
  }

  // alignRight() {
  //   console.log('alignRight');
  //   // this.el.attr('class', 'right');
  //   this.updateEmbedAlignments('right');
  // }

  // updateEmbedAlignments(newAlignment) {
  //   console.log('this.el from asset_Resizer', this.el);
  //   console.log('this.embedImages from asset_Resizer', this.embedImagesEl);
  //   this.embedImagesEl.classList.remove('left', 'center', 'right');
  //   this.embedImagesEl.classList.add(newAlignment);
  // }
}

AssetResizerView.prototype.tagName = 'section';
AssetResizerView.prototype.className = 'resizeInputs';
AssetResizerView.prototype.ui = {
  width: 'input[name="width"]',
};
AssetResizerView.prototype.events = {
  'focusout @ui.width': 'resizeImage',
};
AssetResizerView.prototype.bindings = {
  ':el': {
    attributes: [{
      name: 'class',
      observe: 'alignment',
    }],
  },
  // '.alignments': {
  //   attributes: [{
  //     name: 'data-align',
  //     observe: 'alignment',
  //   }],
  // },
};

export default AssetResizerView;
