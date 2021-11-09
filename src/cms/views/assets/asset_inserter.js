import CmsView from 'Views/base/view';
import Template from 'Templates/assets/asset_inserter';

class AssetInserterView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.toggleButtons = this.toggleButtons.bind(this);
    this.addImages = this.addImages.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.addPages = this.addPages.bind(this);
    this.addDocument = this.addDocument.bind(this);
    this.addQuote = this.addQuote.bind(this);
    this.addNote = this.addNote.bind(this);
    this.embed = this.embed.bind(this);
  }

  initialize({ helped }) {
    this.helped_el = helped;
    document.body.append(this.el);
  }

  setTarget(el) {
    this.target = el;
    this.hideButtons();
  }

  toggleButtons(e) {
    this.containEvent(e);
    if (this.$el.hasClass('showing')) {
      this.hideButtons();
    } else {
      this.showButtons();
    }
  }

  showButtons() {
    this.trigger('expand');
    this.$el.addClass('showing');
  }

  hideButtons() {
    this.trigger('contract');
    this.$el.removeClass('showing');
  }

  // todo: custom figure elements to get rid of this figure.class convention
  // or maybe just look them up from Helpers to keep it in one place.
  //
  addImages(e) {
    this.containEvent(e);
    this.embed('images');
  }

  addVideo(e) {
    this.containEvent(e);
    this.embed('video');
  }

  addPages(e) {
    this.containEvent(e);
    this.embed('pages');
  }

  addDocument(e) {
    this.containEvent(e);
    this.embed('document');
  }

  addQuote(e) {
    this.containEvent(e);
    this.embed('quote');
  }

  addNote(e) {
    this.containEvent(e);
    this.embed('note');
  }

  embed(klass) {
    const embedDiv = document.createElement('div');
    embedDiv.classList.add('embed');
    embedDiv.classList.add(klass);
    this.trigger('insert', embedDiv, this.target);
    this.hideButtons();
  }

  place(el) {
    const rect = el.getBoundingClientRect();
    this.$el.css({
      top: (rect.top + window.scrollY),
      left: (rect.left + window.scrollX),
    });
  }
}


AssetInserterView.prototype.template = Template;
AssetInserterView.prototype.tagName = 'div';
AssetInserterView.prototype.className = 'cms-helper-tool cms-inserter';
AssetInserterView.prototype.events = {
  'click a.show': 'toggleButtons',
  'click a.image': 'addImages',
  'click a.video': 'addVideo',
  'click a.page': 'addPages',
  'click a.document': 'addDocument',
  'click a.linkbutton': 'addButton',
  'click a.quote': 'addQuote',
  'click a.note': 'addNote',
};


export default AssetInserterView;
