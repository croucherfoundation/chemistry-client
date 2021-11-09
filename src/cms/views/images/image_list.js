import AssetListView from 'Views/assets/asset_list';
import ListedImageView from './listed_image';
import NoImageView from './no_image';

class ImageListView extends AssetListView {}


ImageListView.prototype.childView = ListedImageView;
ImageListView.prototype.emptyView = NoImageView;

export default ImageListView;
