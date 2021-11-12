import AssetPickerView from 'Views/assets/asset_picker';
import template from 'Templates/videos/video_picker.html';
import VideoListView from './video_list';

class VideoPickerView extends AssetPickerView {}

VideoPickerView.prototype.listView = VideoListView;
VideoPickerView.prototype.template = template;

export default VideoPickerView;
