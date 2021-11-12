import ListedAssetView from 'Views/assets/listed_asset';
import Template from 'Templates/images/listed_image.html';

class ListedVideoView extends ListedAssetView {
  styleBackgroundImage(url) {
    if (url) {
      return `background-image: url('${url}')`;
    }
    return '';
  }
}

ListedVideoView.prototype.template = Template;
ListedVideoView.prototype.tagName = 'li';
ListedVideoView.prototype.className = 'video asset';
ListedVideoView.prototype.triggers = { 'click a.pickme': 'pick' };
ListedVideoView.prototype.bindings = {
  'a.thumbnail': {
    attributes: [
      {
        name: 'style',
        observe: 'thumb_url',
        onGet: 'styleBackgroundImage',
      },
      {
        name: 'title',
        observe: 'title',
      },
    ],
  },
};

export default ListedVideoView;
