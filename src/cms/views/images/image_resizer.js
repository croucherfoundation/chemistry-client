import AssetResizerView from 'Views/assets/asset_resizer';
import Template from 'Templates/images/image_resizer.html';
// import ImageResizer from 'Models/image_resizer';

class ImageResizerView extends AssetResizerView {
  // onBeforeRender() {
  //   const attributes = {};
  //   const el = this.getOption('content');
  //   if (el) {
  //     const customTestContentEl = el.querySelector('div');
  //     if (customTestContentEl) attributes.customTestContent = customTestContentEl.innerText;
  //   }
  //   this.model = new ImageResizer(attributes);
  //   this.model.on('change', this.contentChange.bind(this));
  // }
}

ImageResizerView.prototype.template = Template;

export default ImageResizerView;
