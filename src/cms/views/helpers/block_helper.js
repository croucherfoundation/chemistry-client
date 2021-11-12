/*
 * The BlockHelper follows the editing caret within a Blocks wrapper.
 * In an empty element it offers to insert an asset.
 *    (by showing an AssetInserter)
 * On an element with text it offers to change the node type.
 *    (by showing a BlockModifier)
 */

import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/block_helper.html';
import AssetInserter from 'Views/assets/asset_inserter';
import BlockModifier from './block_modifier';

class BlockHelperView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.place = this.place.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  initialize({ helped, callbacks }) {
    this.helped_el = helped;
    this.callbacks = callbacks || {};
    document.body.appendChild(this.el);
  }

  onRender() {
    if (this.helped_el) {
      // prepare helper controls
      this.assetInserter = new AssetInserter({ helped: this.helped_el });
      this.showChildView('inserter', this.assetInserter);
      this.assetInserter.on('insert', this.assetInserted.bind(this));

      // target will be set on focus
      this.blockModifier = new BlockModifier({ helped: this.helped_el });
      this.showChildView('modifier', this.blockModifier);
      this.blockModifier.on('modify', this.blockModified.bind(this));
    }
    this.hide();
  }

  blockModified(...args) {
    this.log('blockModified', args);
    this.trigger('modify', ...args);
  }

  assetInserted(...args) {
    this.log('assetInserted', args);
    this.trigger('insert', ...args);
  }

  help(el) {
    this.placeOn(el);
  }

  placeOn(el) {
    const blockSelector = 'p, h2, h3, ol, ul, pre';
    let currentElement = el;

    if (el.nodeType === Node.TEXT_NODE) {
      currentElement = currentElement.parentNode;
    }

    if (currentElement && !currentElement.matches(blockSelector)) {
      currentElement = currentElement.closest(blockSelector);
    }

    if (currentElement) {
      if (currentElement.innerText.trim()) {
        this.prepareToModify(currentElement);
      } else {
        this.prepareToInsertAt(currentElement);
      }
      this.place(currentElement);
      this.show();
    } else {
      this.ui.modifier.hide();
      this.ui.inserter.show();
      this.hide();
    }
  }

  prepareToModify(el) {
    this.blockModifier.setTarget(el);
    this.ui.inserter.hide();
    this.ui.modifier.show();
  }

  prepareToInsertAt(el) {
    this.assetInserter.setTarget(el);
    this.ui.modifier.hide();
    this.ui.inserter.show();
  }

  place(el) {
    const rect = el.getBoundingClientRect();
    this.$el.css({
      top: (rect.top + window.scrollY) - 6,
      left: (rect.left + window.scrollX) - 34,
    });
    this.show();
  }

  show() {
    this.$el.show();
  }

  hide() {
    this.$el.hide();
  }
}


BlockHelperView.prototype.tagName = 'div';
BlockHelperView.prototype.className = 'cms-helper';
BlockHelperView.prototype.template = Template;
BlockHelperView.prototype.regions = {
  modifier: 'div.cms-modifier',
  inserter: 'div.cms-inserter',
};
BlockHelperView.prototype.ui = {
  modifier: 'div.cms-modifier',
  inserter: 'div.cms-inserter',
};


export default BlockHelperView;
