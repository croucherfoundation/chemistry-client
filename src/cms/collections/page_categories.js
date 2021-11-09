import PageCategory from 'Models/page_category';
import CmsCollection from './collection';

class PageCategoriesCollection extends CmsCollection {}

PageCategoriesCollection.class_key = 'page_categories';
PageCategoriesCollection.prototype.model = PageCategory;
PageCategoriesCollection.prototype.singularName = 'page_category';
PageCategoriesCollection.prototype.pluralName = 'page_categories';

export default PageCategoriesCollection;
