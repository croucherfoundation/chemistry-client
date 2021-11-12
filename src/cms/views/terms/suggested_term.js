import CmsView from 'Views/base/view';
import Template from 'Templates/terms/suggested_term.html';

class SuggestedTermView extends CmsView { }


SuggestedTermView.prototype.tagName = 'li';
SuggestedTermView.prototype.className = 'suggestion';
SuggestedTermView.prototype.template = Template;
SuggestedTermView.prototype.triggers = {
  'click a.pick': 'select',
};
SuggestedTermView.prototype.bindings = {
  'span.term': 'term',
  ':el': {
    classes: {
      selected: 'selected',
      unavailable: 'unavailable',
    },
  },
};


export default SuggestedTermView;
