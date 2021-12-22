import AssetImporterView from 'Views/assets/asset_importer';
import Template from 'Templates/images/image_importer.html';
import Image from 'Models/image';

class ImageImporterView extends AssetImporterView {}

ImageImporterView.prototype.modelClass = Image;
ImageImporterView.prototype.template = Template;

export default ImageImporterView;
