import AssetChooserView from 'Views/assets/asset_chooser';
import Template from 'Templates/videos/video_chooser.html';
import { libraryVideos } from 'Utility/library';
import VideoImporterView from './video_importer';
import VideoPickerView from './video_picker';

class VideoChooserView extends AssetChooserView {
  getCollection() {
    return libraryVideos();
  }
}


VideoChooserView.prototype.importView = VideoImporterView;
VideoChooserView.prototype.reuseView = VideoPickerView;
VideoChooserView.prototype.template = Template;

export default VideoChooserView;
