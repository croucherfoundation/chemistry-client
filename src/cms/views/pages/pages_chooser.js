import AssetChooserView from 'Views/assets/asset_chooser';
import PagePickerView from 'Views/pages/page_picker';
import Template from 'Templates/pages/pages_chooser.html';
import { libraryPages } from 'Utility/library';

class PagesChooserView extends AssetChooserView {
  constructor(...args) {
    super(...args);
    this.showChildPages = this.showChildPages.bind(this);
    this.showSimilarPages = this.showSimilarPages.bind(this);
    this.showSelectedPages = this.showSelectedPages.bind(this);
    this.selectedModel = this.selectedModel.bind(this);
  }

  getCollection() {
    return libraryPages();
  }

  showChildPages() {
    this.trigger('mode', 'children');
    this.close();
  }

  showSimilarPages() {
    this.trigger('mode', 'similar');
    this.close();
  }

  showSelectedPages() {
    this.trigger('mode', 'list');
    this.choosePage();
  }

  choosePage() {
    this.showActionView(this.reuseView);
  }

  selectedModel(page) {
    this.trigger('select', page);
    this.close();
  }
}


// PagesChooserView.prototype.reuseView = PagesPickerView;
PagesChooserView.prototype.reuseView = PagePickerView;
PagesChooserView.prototype.template = Template;
PagesChooserView.prototype.ui = {
  head: '.cms-chooser-head',
  prompt: '.cms-chooser-prompt',
  body: '.cms-chooser-body',
  close: 'a.close',
  options: '.options',
  children: 'a.children',
  similar: 'a.similar',
  selected: 'a.selected',
  action: '.action',
};
PagesChooserView.prototype.events = {
  'click @ui.head': 'toggle',
  'click @ui.prompt': 'open',
  'click @ui.close': 'close',
  'click @ui.children': 'showChildPages',
  'click @ui.similar': 'showSimilarPages',
  'click @ui.selected': 'showSelectedPages',
  'click a.back': 'showOptions',
};

export default PagesChooserView;
