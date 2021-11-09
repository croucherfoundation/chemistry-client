import AssetImporterView from 'Views/assets/asset_importer';
import Template from 'Templates/videos/video_importer';
import Video from 'Models/video';

class VideoImporterView extends AssetImporterView { }


VideoImporterView.prototype.modelClass = Video;
VideoImporterView.prototype.template = Template;

export default VideoImporterView;


