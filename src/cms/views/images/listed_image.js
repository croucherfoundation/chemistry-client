import ListedAssetView from 'Views/assets/listed_asset';
import Template from 'Templates/images/listed_image.html';

class ListedImageView extends ListedAssetView {
  styleBackgroundImage(url) {
    if (url) {
      return `background-image: url('${url}')`;
    }
    return '';
  }
}

ListedImageView.prototype.template = Template;
ListedImageView.prototype.tagName = 'li';
ListedImageView.prototype.className = 'img asset';
ListedImageView.prototype.triggers = { 'click a.pickme': 'pick' };
ListedImageView.prototype.bindings = {
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

export default ListedImageView;
