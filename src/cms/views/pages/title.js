import CmsView from 'Views/base/view';
import Template from 'Templates/pages/title';

class PageTitleView extends CmsView {}


PageTitleView.prototype.template = Template;
PageTitleView.prototype.ui = {
  title: 'h1',
};
PageTitleView.prototype.bindings = {
  'span.name': {
    observe: 'title',
  },
};

export default PageTitleView;
