import PageCollection from 'Models/page_collection';
import CmsCollection from './collection';

class PageCollectionsCollection extends CmsCollection {}

PageCollectionsCollection.class_key = 'page_collections';
PageCollectionsCollection.prototype.model = PageCollection;
PageCollectionsCollection.prototype.singularName = 'page_collection';
PageCollectionsCollection.prototype.pluralName = 'page_collections';

export default PageCollectionsCollection;
