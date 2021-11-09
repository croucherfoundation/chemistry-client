import CmsModel from './model';

class PageCollection extends CmsModel {}

PageCollection.prototype.singularName = 'page_collection';
PageCollection.prototype.pluralName = 'page_collections';
PageCollection.prototype.savedAttributes = [];


export default PageCollection;
