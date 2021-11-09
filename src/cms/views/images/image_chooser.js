import AssetChooserView from 'Views/assets/asset_chooser';
import Template from 'Templates/images/image_chooser';
import { libraryImages } from 'Utility/library';
import ImageImporterView from './image_importer';
import ImagePickerView from './image_picker';

class ImageChooserView extends AssetChooserView {
  getCollection() {
    return libraryImages();
  }
}


ImageChooserView.prototype.importView = ImageImporterView;
ImageChooserView.prototype.reuseView = ImagePickerView;
ImageChooserView.prototype.template = Template;

export default ImageChooserView;
