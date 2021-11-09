/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { View } from 'backbone.marionette';
import Template from 'Templates/notices/notice';

class NoticeView extends View {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.fadeOut = this.fadeOut.bind(this);
    this.close = this.close.bind(this);
  }

  onRender() {
    this.stickit();
    _.delay(this.fadeOut.bind(this), this.model.get('duration') || 4000);
  }

  fadeOut() {
    this.$el.fadeOut(500, this.close.bind(this));
  }

  close(e) {
    if (e) e.preventDefault();
    this.$el.stop(true, false).hide();
    if (this.model.collection) this.model.collection.remove(this.model);
  }
}


NoticeView.prototype.template = Template;
NoticeView.prototype.tagName = 'li';
NoticeView.prototype.events = { click: 'fadeOut' };
NoticeView.prototype.bindings = {
  '.message': {
    observe: 'message',
    updateMethod: 'html',
  },
  ':el': {
    attributes: [
      {
        name: 'class',
        observe: 'type',
      },
    ],
  },
};

export default NoticeView;
