import NoAssetView from 'Views/assets/no_asset';
import Template from 'Templates/pages/no_page.html';

class NoPageView extends NoAssetView { }

NoPageView.prototype.tagName = 'li';
NoPageView.prototype.className = 'page none';
NoPageView.prototype.template = Template;

export default NoPageView;
