import NothingView from 'Views/base/nothing';
import Template from 'Templates/terms/no_suggested_term.html';

class NoSuggestedTermView extends NothingView {}

NoSuggestedTermView.prototype.template = Template;
NoSuggestedTermView.prototype.tagName = 'li';
NoSuggestedTermView.prototype.className = 'note none';

export default NoSuggestedTermView;
