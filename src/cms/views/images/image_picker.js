import AssetPickerView from 'Views/assets/asset_picker';
import Template from 'Templates/images/image_picker';
import ImageListView from './image_list';

class ImagePickerView extends AssetPickerView {}


ImagePickerView.prototype.listView = ImageListView;
ImagePickerView.prototype.template = Template;

export default ImagePickerView;
