import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/confirmation';

class ConfirmationView extends CmsView {
  onRender() {
    this.ui.message.html(this.getOption('message'));
    this.ui.notes.html(this.getOption('notes'));
  }
}

ConfirmationView.prototype.template = Template;
ConfirmationView.prototype.tagName = 'div';
ConfirmationView.prototype.className = 'mask';
ConfirmationView.prototype.ui = {
  message: 'p.message',
  notes: 'p.notes',
};
ConfirmationView.prototype.triggers = {
  'click a.accept': 'accept',
  'click a.reject': 'reject',
  'click a.close': 'reject',
  'click a.cancel': 'reject',
};

export default ConfirmationView;
