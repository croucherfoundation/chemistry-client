import PageListView from './page_list';

class SelectedPagesView extends PageListView {
  initialize() {
    this.model = this.getOption('page');
  }
}


export default SelectedPagesView;
