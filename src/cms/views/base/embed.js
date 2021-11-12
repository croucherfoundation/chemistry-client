import CmsView from 'Views/base/view';
import DetachView from 'Views/helpers/detach';
import Template from 'Templates/base/embed';

class EmbedView extends CmsView {
  constructor(...args) {
    super(...args);
    this.render = this.render.bind(this);
    this.initialize = this.initialize.bind(this);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.focus = this.focus.bind(this);
  }

  initialize() {
    this.page = this.getOption('page');
    this.migrateNode = this.getOption('migrate');
    this.el.embedHelper = this;
    this.el.classList.add(this.getOption('label'));
  }

  onBeforeRender() {
    if (this.migrateNode) {
      this.wrappedEl = this.migrateNode;
    } else {
      const embeddedEl = this.el.querySelector('.embedded');
      if (embeddedEl) this.wrappedEl = embeddedEl.firstChild;
      else this.wrappedEl = this.el.firstChild;
    }
  }

  onAfterRender() {
    if (!this.contentView) {
      const ContentViewClass = this.getOption('contentView');
      this.contentView = new ContentViewClass({
        content: this.wrappedEl,
        page: this.page,
      });
      this.showChildView('content', this.contentView);
      this.contentView.on('updated', this.contentChange.bind(this));
    }
    if (!this.detacher) {
      this.detacher = new DetachView();
      this.detacher.on('delete', this.remove.bind(this));
      this.showChildView('controls', this.detacher);
    }
  }

  focus() {
    if (this.contentView) this.contentView.focus();
  }

  remove() {
    return this.$el.slideUp('fast', () => this.$el.remove());
  }

  contentChange() {
    this.trigger('updated');
  }

  listenForChanges() {
    this._listening = true;
  }

  cleanContent() {
    if (this.contentView) {
      const embedHtml = this.contentView.cleanContent();
      if (embedHtml) {
        const wrapper = document.createElement(this.tagName);
        wrapper.classList.add(this.className);
        wrapper.classList.add(this.getOption('label'));
        wrapper.innerHTML = embedHtml;
        this.log('🦋 embed cleanContent', wrapper.outerHTML);
        return wrapper.outerHTML;
      }
    }
    return '';
  }
}


EmbedView.prototype.template = Template;
EmbedView.prototype.tagName = 'div';
EmbedView.prototype.className = 'embed';
EmbedView.prototype.regions = {
  content: '.embedded',
  controls: '.cms-controls',
};


export default EmbedView;
