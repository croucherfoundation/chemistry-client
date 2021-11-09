import CmsCollectionView from 'Views/base/collection_view';

class AssetListView extends CmsCollectionView {
  viewFilter(view) {
    return view.model && !view.model.isNew();
  }

  selectChild(view) {
    this.trigger('select', view);
  }
}

AssetListView.prototype.tagName = 'ul';
AssetListView.prototype.className = 'cms-assets';
AssetListView.prototype.childViewEvents = { select: 'selectChild' };


export default AssetListView;
