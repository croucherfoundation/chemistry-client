import { libraryPages } from 'Utility/library';
import PagesCollection from 'Collections/pages';
import PageListView from './page_list';

class ChildPagesView extends PageListView {
  initialize() {
    this.model = this.getOption('page');
    const childPages = libraryPages().where({ parent_id: this.model.id });
    this.collection = new PagesCollection(childPages);
  }
}

// add an add button...

export default ChildPagesView;
