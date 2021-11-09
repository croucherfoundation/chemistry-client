import { translate } from 'Utility/i18n';
import CmsModel from './model';

const urlRegex = /^https?:\/\/\w+\.\w*/i;
const providerRegex = /(youtube|vimeo|dailymotion|wistia)/i;
const idRegex = /^[a-zA-Z0-9_-]{11}$/;

class Video extends CmsModel {
  constructor(...args) {
    super(...args);
    this.isPopulated = this.isPopulated.bind(this);
  }

  build() {
    this.checkImportable();
    this.on('change:remote_url', this.checkImportable);
  }

  isPopulated() {
    return this.has('file_url') || this.has('remote_url') || this.has('embed');
  }

  checkImportable() {
    const url = this.get('remote_url');
    if (!url) {
      this.set({
        importable: false,
        importmessage: translate('validation.url_or_yt_required'),
      });
      return false;
    }
    if (urlRegex.test(url) && providerRegex.test(url)) {
      const message = translate('validation.video_url_ok');
      this.set({
        importable: true,
        importmessage: `<a href="${url}" class="check" target="_blank">${message}</a>`,
      });
      return true;
    }
    if (url.length === 11 && idRegex.test(url)) {
      const message = translate('validation.yt_ok');
      const fullUrl = `https://youtu.be/${url}`;
      this.set({
        importable: true,
        importmessage: `${message} <a href="${fullUrl}" class="check" target="_blank">${fullUrl}</a>`,
      });
      return true;
    }
    this.set({
      importable: false,
      importmessage: translate('validation.url_or_yt_required'),
    });
    return false;
  }
}


Video.prototype.singularName = 'video';
Video.prototype.pluralName = 'videos';
Video.prototype.savedAttributes = ['title', 'caption', 'file_data', 'file_name', 'file_type', 'remote_url'];
Video.prototype.uploadProgress = true;
Video.prototype.defaults = { asset_type: 'video', importable: false, populated: false };

export default Video;
