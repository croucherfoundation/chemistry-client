import MenuView from 'Views/base/menu';
import Template from 'Templates/menus/control_menu';
import PageSaverView from 'Views/pages/saver';

class PageControlMenuView extends MenuView {}


PageControlMenuView.prototype.className = 'cms-menu page-control';
PageControlMenuView.prototype.template = Template;
PageControlMenuView.prototype.contentView = PageSaverView;
PageControlMenuView.prototype.bindings = {
  ':el': {
    classes: {
      busy: 'busy',
      saveable: {
        observe: ['changed', 'busy'],
        onGet: 'thisButNotThat',
      },
      publishable: {
        observe: ['outofdate', 'changed'],
        onGet: 'thisButNotThat',
      },
    },
  },
};

export default PageControlMenuView;
