import { CollectionView } from 'backbone.marionette';
import NoticeView from './notice';

class NoticesView extends CollectionView {}


NoticesView.prototype.childView = NoticeView;
NoticesView.prototype.tagName = 'ul';
NoticesView.prototype.className = 'notices';

export default NoticesView;
