import MenuView from 'Views/base/menu';
import Template from 'Templates/menus/config_menu.html';
import PageSettingsView from 'Views/pages/settings';

class PageConfigMenuView extends MenuView {}


PageConfigMenuView.prototype.className = 'cms-menu page-config';
PageConfigMenuView.prototype.template = Template;
PageConfigMenuView.prototype.contentView = PageSettingsView;

export default PageConfigMenuView;
