import AssetChooserView from 'Views/assets/asset_chooser';
import Template from 'Templates/images/image_chooser.html';
import { libraryImages } from 'Utility/library';
import ImageImporterView from './image_importer';
import ImagePickerView from './image_picker';
import ImageResizerView from './image_resizer';

class ImageChooserView extends AssetChooserView {
  getCollection() {
    return libraryImages();
  }
}

ImageChooserView.prototype.importView = ImageImporterView;
ImageChooserView.prototype.reuseView = ImagePickerView;
ImageChooserView.prototype.resizerView = ImageResizerView;
ImageChooserView.prototype.template = Template;

export default ImageChooserView;
