import { Model } from 'backbone';
import EmbeddedCollectionView from 'Views/assets/embedded_collection';
import Template from 'Templates/images/embedded_images.html';
import ImagesCollection from 'Collections/images';
import slideshow from 'Utility/slideshow';
import EmbeddedImageView from './embedded_image';


class EmbeddedImagesView extends EmbeddedCollectionView {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.setDimensions = this.setDimensions.bind(this);
    this.addEmbed = this.addEmbed.bind(this);
    this.checkCollection = this.checkCollection.bind(this);
  }

  initialize() {
    this.collection = new ImagesCollection();
    this.collection.on('add remove reset destroy change:caption change:populated', this.checkCollection.bind(this));
    this.collection.on('change:caption', this.contentChange.bind(this));
    this.content = this.getOption('content');
    this.state = new Model({
      position: 0,
    });
  }

  onBeforeRender() {
    this.captureImages();
  }

  captureImages() {
    if (this.content) {
      if (this.content.dataset && this.content.dataset.image) this.captureImageFrom(this.content);
      const imageEls = this.content.querySelectorAll('[data-image]');
      imageEls.forEach((el) => this.captureImageFrom(el));
    }
  }

  captureImageFrom(el) {
    if (el.dataset && el.dataset.image) {
      const attributes = {
        id: el.dataset.image,
      };
      const imgEl = el.querySelector('img:not([src=""])');
      if (imgEl && imgEl.src) {
        attributes.file_url = imgEl.src;
        attributes.populated = true;
      }
      const captionEl = el.querySelector('figcaption');
      if (captionEl) attributes.caption = captionEl.innerHTML;
      this.collection.add(attributes);
    }
  }

  onRender() {
    this.stickit(this.state, {
      'a.next': {
        observe: ['position', 'total'],
        visible: 'unlessLast',
      },
      'a.prev': {
        observe: 'position',
        visible: 'unlessFirst',
      },
      'a.add': {
        classes: {
          up: {
            observe: ['position', 'total', 'populated'],
            onGet: 'ifLastAndPopulated',
          },
        },
      },
    });
    this.triggerMethod('after:render', this);
    if (!window.eiv) window.eiv = this;
  }

  onAfterRender() {
    this.checkCollection();
    this.setDimensions();
    this.collection.on('add remove reset', this.setDimensions);
    this._slider = slideshow(this.ui.slider, {
      onMove: this.sliderMoved.bind(this),
    });
    this.el.classList.add('cms-shimmy');
  }

  setDimensions() {
    const c = this.collection.size();
    this.state.set('total', c);
    const hw = 100 * c;
    this.ui.holder.css('width', `${hw}%`);
    // if (this._slider) this._slider.getSlides();
  }

  addEmbed(e) {
    if (e) e.preventDefault();
    this.collection.add({});
    if (this._slider) this._slider.moveToEndWhenUpdated();
  }

  // slider position observers

  ifLast([position, total]) {
    return position === total - 1;
  }

  ifLastAndPopulated([position, total, populated]) {
    return populated && position === total - 1;
  }

  unlessLast([position, total]) {
    return position !== total - 1;
  }

  ifFirst(position) {
    return position === 0;
  }

  unlessFirst(position) {
    return position !== 0;
  }

  moveNext(e) {
    if (e) e.preventDefault();
    if (this._slider) this._slider.moveNext();
  }

  movePrev(e) {
    if (e) e.preventDefault();
    if (this._slider) this._slider.movePrev();
  }

  sliderMoved(index) {
    this.state.set('position', index);
  }

  resetSlider() {
    if (this._slider) this._slider.reset();
  }

  checkCollection() {
    if (!this.collection.length) {
      this.collection.add({});
      this.state.set({ position: 0 });
    }
    const unPopulatedImage = this.collection.find({ populated: false });
    this.state.set({
      populated: !unPopulatedImage,
    });
  }

  cleanContent() {
    const slideCount = this.collection.select((im) => im.isPopulated()).length;
    if (slideCount) {
      const cleanEl = this.cleanCopy();
      cleanEl.querySelectorAll('a.slider-control').forEach((el) => {
        el.removeAttribute('style');
      });
      cleanEl.querySelectorAll('figure.image:not([data-image])').forEach((el) => {
        el.remove();
      });
      const slideHolder = cleanEl.querySelector('.cms-slide-holder');
      if (slideHolder) {
        slideHolder.style.transform = '';
        slideHolder.style.width = `${slideCount * 100}%`;
      }
      return cleanEl.outerHTML;
    }
    return '';
  }
}


EmbeddedImagesView.prototype.template = Template;
EmbeddedImagesView.prototype.tagName = 'div';
EmbeddedImagesView.prototype.className = 'images cms-slides';
EmbeddedImagesView.prototype.childView = EmbeddedImageView;
EmbeddedImagesView.prototype.childViewContainer = '.collection';
EmbeddedImagesView.prototype.ui = {
  add: 'a.add',
  prev: 'a.prev',
  next: 'a.next',
  slider: '.cms-slider', // handles ms-touch events in IE10
  holder: '.cms-slide-holder', // catches touchstart etc in other browsers
  slides: 'figure.image',
};
EmbeddedImagesView.prototype.events = {
  'click a.add': 'addEmbed',
  'click a.prev': 'movePrev',
  'click a.next': 'moveNext',
};

export default EmbeddedImagesView;
