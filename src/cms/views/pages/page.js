import CmsView from 'Views/base/view';
import PageMastheadView from 'Views/pages/masthead';
import PageControlMenuView from 'Views/menus/control_menu';
import PageConfigMenuView from 'Views/menus/config_menu';
import SiteMenuView from 'Views/menus/site_menu';
import Template from 'Templates/pages/page';
import PageTitleView from './title';
import PageContentView from './content';

class PageView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.closeMenusOtherThan = this.closeMenusOtherThan.bind(this);
  }

  onAfterRender() {
    this.showChildView('title', new PageTitleView({ model: this.model }));
    this.showChildView('content', new PageContentView({ model: this.model }));
    this.showChildView('masthead', new PageMastheadView({ model: this.model }));

    this.siteView = new SiteMenuView({ model: this.model });
    this.showChildView('site', this.siteView);
    this.siteView.on('open', () => this.closeMenusOtherThan(this.siteView));

    this.configView = new PageConfigMenuView({ model: this.model });
    this.showChildView('config', this.configView);
    this.configView.on('open', () => this.closeMenusOtherThan(this.configView));

    this.controlView = new PageControlMenuView({ model: this.model });
    this.showChildView('control', this.controlView);
    this.controlView.on('open', () => this.closeMenusOtherThan(this.controlView));
  }

  closeMenusOtherThan(view) {
    if (view !== this.siteView) this.siteView.close();
    if (view !== this.configView) this.configView.close();
    if (view !== this.controlView) this.controlView.close();
  }
}


PageView.prototype.template = Template;
PageView.prototype.tagName = 'main';
PageView.prototype.regions = {
  masthead: '#cms_illustration',
  title: '#cms_title',
  content: '#cms_content',
  config: '.page_config',
  control: '.page_control',
  site: '.site',
};

export default PageView;
