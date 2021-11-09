// PageMastheadView is a slideshow manager similar to the one that handles embedded images

import EmbeddedImagesView from 'Views/images/embedded_images';

class PageMastheadView extends EmbeddedImagesView {
  onBeforeRender() {
    if (this.model.get('masthead')) {
      const temp = document.createElement('template');
      temp.innerHTML = this.model.get('masthead');
      this.content = temp.content;
      this.captureImages();
    }
    if (!this.model.get('image_id')) {
      const image = this.collection.first();
      if (image) this.model.set('image_id', image.id);
    }
  }

  contentChange() {
    this.model.set('masthead', this.cleanContent());
    const image = this.collection.first();
    if (image) this.model.set('image_id', image.id);
    this.log('🌈 page image_id', this.model.get('image_id'));
  }
}

export default PageMastheadView;
