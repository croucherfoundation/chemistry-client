import EmbeddedAssetView from 'Views/assets/embedded_asset';
import Template from 'Templates/videos/embedded_video';
import Video from 'Models/video';
import VideoChooserView from './video_chooser';

class EmbeddedVideoView extends EmbeddedAssetView {
  constructor(...args) {
    super(...args);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.videoId = this.videoId.bind(this);
  }

  onBeforeRender() {
    const attributes = {};
    // let video_el = this.getOption('content');
    // if (video_el) {
    //   attributes.id = el.dataset.video;
    // }
    this.model = new Video(attributes);
  }

  videoId(id) {
    return `video_${id}`;
  }
}


EmbeddedVideoView.prototype.controlView = VideoChooserView;
EmbeddedVideoView.prototype.template = Template;
EmbeddedVideoView.prototype.className = 'video';
EmbeddedVideoView.prototype.bindings = {
  ':el': {
    attributes: [
      {
        name: 'data-video',
        observe: 'id',
      },
    ],
  },
  '.player': {
    observe: 'embed_code',
    updateMethod: 'html',
    classes: {
      unnecessary: 'mp4_url',
    },
  },
  video: {
    observe: ['file_url', 'embed_code'],
    visible: 'thisButNotThat',
    attributes: [
      {
        name: 'id',
        observe: 'id',
        onGet: 'videoId',
      }, {
        name: 'poster',
        observe: 'hero_url',
      },
    ],
  },
  img: {
    attributes: [
      {
        name: 'src',
        observe: 'hero_url',
      },
    ],
  },
  source: {
    attributes: [
      {
        name: 'src',
        observe: 'mp4_url',
      },
    ],
  },
};


export default EmbeddedVideoView;
