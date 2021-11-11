import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/add.html';

class AddView extends CmsView {}


AddView.prototype.template = Template;
AddView.prototype.tagName = 'a';
AddView.prototype.className = 'cms-button add';
AddView.prototype.triggers = {
  click: 'add',
};

export default AddView;
