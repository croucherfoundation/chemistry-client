import CmsModel from './model';

class ImageResizer extends CmsModel { }

ImageResizer.prototype.singularName = 'imageResizer';
ImageResizer.prototype.pluralName = 'imageResizers';
ImageResizer.prototype.savedAttributes = [];
ImageResizer.prototype.defaults = {
  asset_type: 'imageResizer',
  alignment: 'center',
  size: '',
};

export default ImageResizer;
