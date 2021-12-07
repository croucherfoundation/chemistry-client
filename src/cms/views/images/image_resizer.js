import AssetResizerView from 'Views/assets/asset_resizer';
import Template from 'Templates/images/image_resizer.html';

class ImageResizerView extends AssetResizerView {
  onAfterRender() {
    console.log('Something');
  }
}

ImageResizerView.prototype.template = Template;

export default ImageResizerView;
