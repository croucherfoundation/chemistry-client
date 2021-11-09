import CmsView from 'Views/base/view';

class ListedAssetView extends CmsView {
  constructor(...args) {
    super(...args);
    this.deleteModel = this.deleteModel.bind(this);
    this.selectMe = this.selectMe.bind(this);
    this.backgroundUrl = this.backgroundUrl.bind(this);
  }

  deleteModel(e) {
    if (e != null) {
      e.preventDefault();
    }
    this.model.remove();
  }

  selectMe(e) {
    if (e) e.preventDefault();
    this.trigger('select', this.model);
  }

  backgroundUrl(url) {
    if (url) {
      return `background-image: url('${url}')`;
    }
    return '';
  }
}


ListedAssetView.prototype.tagName = 'li';
ListedAssetView.prototype.className = 'asset';
ListedAssetView.prototype.ui = { img: 'img' };
ListedAssetView.prototype.events = {
  'click a.delete': 'deleteModel',
  'click a.pickme': 'selectMe',
};
ListedAssetView.prototype.bindings = {
  'a.preview': {
    attributes: [{
      name: 'style',
      observe: 'thumb_url',
      onGet: 'backgroundUrl',
    },
    {
      name: 'class',
      observe: 'provider',
      onGet: 'providerClass',
    },
    {
      name: 'title',
      observe: 'title',
    },
    ],
  },
  '.file_size': {
    observe: 'file_size',
    onGet: 'inBytes',
  },
  '.width': {
    observe: 'width',
    onGet: 'inPixels',
  },
  '.height': {
    observe: 'height',
    onGet: 'inPixels',
  },
  '.duration': {
    observe: 'duration',
    onGet: 'inTime',
  },
};


export default ListedAssetView;
