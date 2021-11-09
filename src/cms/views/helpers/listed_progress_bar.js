import Template from 'Templates/helpers/listed_progress_bar';
import ProgressBarView from './progress_bar';

class ListedProgressBarView extends ProgressBarView {}

ListedProgressBarView.prototype.template = Template;
ListedProgressBarView.prototype.tagName = 'li';
ListedProgressBarView.prototype.className = 'progress';

export default ListedProgressBarView;
