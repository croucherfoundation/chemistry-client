import Image from 'Models/image';
import CmsCollection from './collection';

class ImagesCollection extends CmsCollection {}

ImagesCollection.class_key = 'images';
ImagesCollection.prototype.model = Image;
ImagesCollection.prototype.singularName = 'image';
ImagesCollection.prototype.pluralName = 'images';

export default ImagesCollection;
