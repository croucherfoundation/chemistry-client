import { translate } from 'Utility/i18n';
import CmsModel from './model';

const urlRegex = /^https?:\/\/([\w\-_]+\.)+\w*/i;
const formatRegex = /(jpeg|jpg|gif|png)$/i;

class Image extends CmsModel {
  constructor(...args) {
    super(...args);
    this.build = this.build.bind(this);
    this.resetUploads = this.resetUploads.bind(this);
    this.getThumbs = this.getThumbs.bind(this);
    this.getAspect = this.getAspect.bind(this);
    this.setProgressThumb = this.setProgress.bind(this);
    this.isPopulated = this.isPopulated.bind(this);
    this.resizeImage = this.resizeImage.bind(this);
  }

  build() {
    this.on('change:width change:height', this.getAspect);
    this.getAspect();
    this.on('change:file_data', this.getThumbs);
    this.getThumbs();
    this.on('change:progress', this.setProgressThumb);
    this.checkImportable();
    this.on('change:remote_url', this.checkImportable);
  }

  // todo: this should live in model under a change:remote_url listener
  checkImportable() {
    const url = this.get('remote_url');
    if (!url) {
      this.set({
        importable: false,
        importmessage: translate('validation.url_required'),
      });
      return false;
    }
    if (urlRegex.test(url)) {
      if (formatRegex.test(url)) {
        const message = translate('validation.image_url_ok');
        this.set({
          importable: true,
          importmessage: `<a href="${url}" class="check" target="_blank">${message}</a>`,
        });
        return true;
      }
      this.set({
        importable: false,
        importmessage: translate('validation.url_not_img'),
      });
      return false;
    }
    this.set({
      importable: false,
      importmessage: translate('validation.url_required'),
    });
    return false;
  }

  resetUploads() {
    this.unset('file_data');
  }

  getThumbs() {
    const data = this.get('file_data');
    if (data) {
      this._preload_img = document.createElement('img');
      this._preload_img.onload = () => {
        // lo-fi preview is shown while uploading to remind user that we are not ready
        this.set({
          width: this._preload_img.width,
          height: this._preload_img.height,
          preload_url: this.resizeImage(32),
          thumb_url: this.resizeImage(128),
        });
      };
      this._preload_img.src = this.get('file_data');
    }
  }

  setProgressThumb() {
    if (this.get('progress') && this.get('width')) {
      const previewSize = (this.get('progress') ** 2) * 256;
      this.set({ preload_url: this.resizeImage(previewSize) });
    } else {
      this.unset('preload_url');
    }
  }

  getAspect() {
    const w = this.get('width');
    const h = this.get('height');
    if (w && h) {
      this.set({
        portrait: h > w,
        aspect_ratio: w / h,
      });
    }
  }

  isPopulated() {
    return this.has('file_url') || this.has('file_data');
  }

  resizeImage(size) {
    let h;
    let w = size || 48;
    const canvas = document.createElement('canvas');
    const img = this._preload_img;
    if (img) {
      const ctx = canvas.getContext('2d');
      if (img.height > img.width) {
        h = w * (img.height / img.width);
      } else {
        h = w;
        w = h * (img.width / img.height);
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
    }
    return canvas.toDataURL('image/png');
  }
}

Image.prototype.singularName = 'image';
Image.prototype.pluralName = 'images';
Image.prototype.savedAttributes = ['title', 'file_data', 'file_name', 'remote_url', 'width', 'height'];
Image.prototype.uploadProgress = true;
Image.prototype.defaults = { asset_type: 'image', importable: false, populated: false };

export default Image;
