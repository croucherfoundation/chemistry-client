import AssetResizerView from 'Views/assets/asset_resizer';
import Template from 'Templates/images/image_resizer.html';
import ImageResizer from 'Models/image_resizer';

class ImageResizerView extends AssetResizerView { }

ImageResizerView.prototype.modelClass = ImageResizer;
ImageResizerView.prototype.template = Template;

export default ImageResizerView;
