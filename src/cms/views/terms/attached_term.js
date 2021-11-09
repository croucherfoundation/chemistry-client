import CmsView from 'Views/base/view';
import Template from 'Templates/terms/attached_term';

class AttachedTermView extends CmsView {
  constructor(...args) {
    super(...args);
    this.detach = this.detach.bind(this);
  }

  detach(e) {
    if (e) e.preventDefault();
    this.model.discard();
  }
}


AttachedTermView.prototype.template = Template;
AttachedTermView.prototype.tagName = 'li';
AttachedTermView.prototype.className = 'term';
AttachedTermView.prototype.events = {
  'click a.detach': 'detach',
};
AttachedTermView.prototype.bindings = {
  'span.term': 'term',
};


export default AttachedTermView;
