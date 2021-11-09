
/*
  This is our basic contenteditable module. it handles a block of html for us,
  providing inline formatting toolbar and block-level element control.
  Most actions here only affect its html content.

  TODO: on paste with assets?
*/

import CmsView from 'Views/base/view';
import { translate } from 'Utility/i18n';
import { blockHelper, formatHelper } from 'Utility/editing';
import { stripControls } from 'Utility/cleaning';
import { sanitize, sanitizeContents } from 'Utility/sanitizer';

class BlocksView extends CmsView {
  constructor(...args) {
    super(...args);
    this.render = this.render.bind(this);
  }

  initialize() {
    super.initialize();
    this.log('🌼 blocksHelper init', this.el.cloneNode(true));
  }

  render() {
    sanitizeContents(this.el);

    this.el.contentEditable = true;
    this.el.classList.add('cms-blocks');
    this.el.dataset.placeholder = translate('placeholders.page.blocks');

    if (this.el.childElementCount === 0) {
      const para = document.createElement('p');
      para.dataset.placeholder = this.el.dataset.placeholder;
      this.el.appendChild(para);
    }

    this.block_helper = blockHelper(this.el);
    this.block_helper.on('insert', this.insertedAsset.bind(this));
    this.block_helper.on('modify', this.modifiedBlock.bind(this));

    this.format_helper = formatHelper(this.el);
    this.format_helper.on('change', this.changedFormat.bind(this));

    // listen to local content changes and add block helpers
    this.content_observer = new MutationObserver(_.debounce(this.contentChange.bind(this)), 500);
    this.content_observer.observe(this.el, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    this.el.addEventListener('paste', this.paste.bind(this));
  }

  // asset inserter callback:
  // handle a newly inserted asset by breaking into three parts:
  // I keep nodes before the asset
  // asset is promoted to top level
  // all my children after the asset are given to a new BlocksView.
  // Here we only need to arrange the elements: the ContentObserver will wrap them.
  //
  insertedAsset(newEl, atEl) {
    this.log('insertedAsset', newEl, atEl);
    const newDiv = document.createElement('div');
    newDiv.classList.add('cms-blocks');
    if (atEl && atEl.nextSibling) {
      while (atEl.nextSibling) {
        newDiv.append(atEl.nextSibling);
      }
    } else {
      newDiv.append(document.createElement('P'));
    }
    atEl.remove();
    // mutation observer will notice the new elements and give them helpers too
    this.el.after(newEl, newDiv);
    this.block_helper.hide();
  }

  modifiedBlock(newEl) {
    this.log('modifiedBlock', newEl);
  }

  changedFormat() {
    this.log('changedFormat');
  }

  focus() {
    this.el.focus();
  }

  handleSelection(sel, parentEl) {
    if (sel.isCollapsed) {
      // 1. replace caret-follower in BlockHelper
      this.block_helper.help(parentEl);
      this.format_helper.close();
    } else {
      // 2. formatting helper
      this.format_helper.help(sel);
    }
  }

  releaseSelection() {
    this.format_helper.hide();
    // someone should tell the format_helper to stand down.
    // or perhaps it should do its own listening.
  }

  // subsume will fire the content_observer, which is not ideal
  // but only happens on migration so we allow it for now.
  subsume(otherEl) {
    const tagMatch = otherEl.tagName.toLowerCase() === this.tagName.toLowerCase();
    const classMatch = otherEl.classList.contains(this.className);
    if (tagMatch && classMatch) {
      // otherEL is a .cms-blocks wrapper so we take child nodes.
      Array.from(otherEl.children).forEach((el) => this.el.append(el));
    } else {
      const cleaned = sanitize(otherEl);
      this.el.append(cleaned);
    }
    if (otherEl.cmsHelper) otherEl.cmsHelper.destroy();
    otherEl.remove();
  }

  paste(e) {
    e.preventDefault();
    const clipboard = e.clipboardData || window.clipboardData;
    if (clipboard) {
      const selection = window.getSelection();
      if (selection.rangeCount) {
        selection.deleteFromDocument();
        const range = selection.getRangeAt(0);
        const pasted = clipboard.getData('text/html') || clipboard.getData('text');
        const fragment = range.createContextualFragment(pasted);
        Array.from(fragment.childNodes).forEach((fragNode) => {
          const cleaned = sanitize(fragNode);
          if (cleaned) {
            range.insertNode(cleaned);
            range.setStartAfter(cleaned);
          }
        });
        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  onBeforeDestroy() {
    if (this._toolbar) this._toolbar.destroy();
    if (this._inserter) this._inserter.destroy();
    if (this.content_observer) this.content_observer.disconnect();
  }

  contentChange() {
    this.trigger('updated');
  }

  // nb. if we trust the div-wrapping process we could return innnerHTML here
  // and omit the div.cms-blocks wrappers from published html.
  // however the merging of blocks is quite inefficient so we avoid that for now.
  cleanContent() {
    return stripControls(this.el);
  }

  // TODO: cmd-enter to show helper, keyboard to navigate...
  placeHelper(e) {
    this.block_helper.help(e.currentTarget);
  }
}

BlocksView.prototype.tagName = 'div';
BlocksView.prototype.className = 'cms-blocks';
BlocksView.prototype.label = 'blocks';
BlocksView.prototype.events = {
  'mouseover p': 'placeHelper',
  'mouseover h2': 'placeHelper',
  'mouseover h3': 'placeHelper',
  'mouseover ol': 'placeHelper',
  'mouseover ul': 'placeHelper',
  'mouseover pre': 'placeHelper',
};
export default BlocksView;
