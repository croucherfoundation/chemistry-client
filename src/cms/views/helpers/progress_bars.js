import { CollectionView } from 'backbone.marionette';
import ListedProgressBarView from './listed_progress_bar';

class ProgressBarsView extends CollectionView {}


ProgressBarsView.prototype.childView = ListedProgressBarView;
ProgressBarsView.prototype.tagName = 'ul';
ProgressBarsView.prototype.className = 'progresses';

export default ProgressBarsView;

