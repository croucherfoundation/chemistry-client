import PageListView from './page_list';

class SimilarPagesView extends PageListView {
  initialize() {
    this.model = this.getOption('page');
    this.collection = this.model.getSimilarPages();
  }
}


export default SimilarPagesView;
