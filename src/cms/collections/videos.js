import Video from 'Models/video';
import CmsCollection from './collection';

class VideosCollection extends CmsCollection {}

VideosCollection.class_key = 'videos';
VideosCollection.prototype.model = Video;
VideosCollection.prototype.singularName = 'video';
VideosCollection.prototype.pluralName = 'videos';

export default VideosCollection;
