import CmsView from 'Views/base/view';

class MenuView extends CmsView {
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.place = this.place.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
  }

  onAfterRender() {
    const ContentViewClass = this.getOption('contentView');
    if (ContentViewClass) {
      this.showChildView('content', new ContentViewClass({
        model: this.model,
      }));
    }
  }

  toggle(e) {
    if (e) e.preventDefault();
    if (this.showing()) { this.close(); } else { this.open(); }
  }

  showing() {
    return this.$el.hasClass('open');
  }

  open() {
    this.el.classList.add('open');
    window.ub = this.ui.body;
    this.ui.body.slideDown();
    this.triggerMethod('open');
  }

  close() {
    this.$el.removeClass('open');
    this.triggerMethod('close');
  }

  place() {
    const pos = this.ui.head.position();
    const hw = this.ui.head.width();
    const left = (pos.left + hw / 2);
    const top = pos.top + hw / 2;
    this.ui.body.css({
      top,
      left,
    });
  }
}


MenuView.prototype.className = 'div';
MenuView.prototype.className = 'cms-menu';

MenuView.prototype.regions = {
  content: '.cms-menu-content',
};

MenuView.prototype.ui = {
  head: '.cms-menu-head',
  body: '.cms-menu-body',
  close: 'a.close',
};

MenuView.prototype.events = {
  'click @ui.head': 'toggle',
  'click @ui.close': 'close',
};


export default MenuView;
