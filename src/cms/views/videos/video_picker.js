import AssetPickerView from 'Views/assets/asset_picker';
import Template from 'Templates/videos/video_picker';
import VideoListView from './video_list';

class VideoPickerView extends AssetPickerView {}

VideoPickerView.prototype.listView = VideoListView;
VideoPickerView.prototype.template = Template;

export default VideoPickerView;
