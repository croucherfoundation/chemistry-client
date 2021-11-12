import MenuView from 'Views/base/menu';
import Template from 'Templates/menus/site_menu';
import NavigatorView from 'Views/pages/navigator';

class SiteMenuView extends MenuView {}


SiteMenuView.prototype.className = 'cms-menu site';
SiteMenuView.prototype.template = Template;
SiteMenuView.prototype.contentView = NavigatorView;

export default SiteMenuView;
