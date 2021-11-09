import AssetListView from 'Views/assets/asset_list';
import ListedVideoView from './listed_video';
import NoVideoView from './no_video';

class VideoListView extends AssetListView {}


VideoListView.prototype.childView = ListedVideoView;
VideoListView.prototype.emptyView = NoVideoView;

export default VideoListView;
