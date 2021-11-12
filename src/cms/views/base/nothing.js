import { View } from 'backbone.marionette';
import { templateContext } from 'Utility/i18n';
import Template from 'Templates/base/no_item';

// The NothingView is a general purpose emptyView.
//
class NothingView extends View {

}

NothingView.prototype.template = Template;
NothingView.prototype.templateContext = templateContext;
NothingView.prototype.className = 'item none';

export default NothingView;
