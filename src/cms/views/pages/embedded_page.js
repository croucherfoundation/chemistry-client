import { truncate } from 'Utility/strings';
import Template from 'Templates/pages/embedded_page.html';
import ListedPageView from './listed_page';

class EmbeddedPageView extends ListedPageView {
  onBeforeRender() {
    this.el.dataset.cms = true;
  }

  truncatedTitle(value) {
    return truncate(value, 256);
  }

  discardPage(e) {
    if (e) e.preventDefault();
    this.trigger('deselect', this.model);
  }
}


EmbeddedPageView.prototype.template = Template;

export default EmbeddedPageView;
