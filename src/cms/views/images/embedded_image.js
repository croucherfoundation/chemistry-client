import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Template from 'Templates/images/embedded_image.html';
import ImageChooserView from './image_chooser';

class EmbeddedImageView extends EmbeddedAssetView {
  setWidth(w) {
    const width = w || 100 / this.model.collection.size();
    this.el.style.width = `${width}%`;
  }

  styleOpacity(p) {
    if (p) return `opacity: ${p}`;
    return 'opacity: 0';
  }

  onSetModel() {
    // noop here: EmbeddedImagesView is about to replace this view with another.
  }
}

EmbeddedImageView.prototype.controlView = ImageChooserView;
EmbeddedImageView.prototype.template = Template;
EmbeddedImageView.prototype.tagName = 'figure';
EmbeddedImageView.prototype.className = 'image cms-slide';
EmbeddedImageView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'data-image',
        observe: 'id',
      },
    ],
  },
  'img.image': {
    attributes: [
      {
        name: 'src',
        observe: 'file_url',
      },
    ],
  },
  figcaption: {
    observe: 'caption',
  },
  'img.preview': {
    classes: {
      uploaded: 'file_url',
    },
    attributes: [
      {
        name: 'src',
        observe: 'preload_url',
      },
      {
        name: 'style',
        observe: 'progress',
        onGet: 'styleOpacity',
      },
    ],
  },
};


export default EmbeddedImageView;
