import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/detach.html';

class DetachView extends CmsView {}


DetachView.prototype.template = Template;
DetachView.prototype.tagName = 'a';
DetachView.prototype.className = 'cms-button delete';
DetachView.prototype.triggers = {
  click: 'delete',
};

export default DetachView;
