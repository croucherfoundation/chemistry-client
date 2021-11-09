/*
 * minimal tag-changing helper.
 * Sits next to a block element ready to change it into another block element.
 *
 * `target` is the current block element (p, ul, etc) that would be replaced with another.
 */

import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/block_modifier';

class BlockModifierView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.toggleButtons = this.toggleButtons.bind(this);
    this.replaceTagWith = this.replaceTagWith.bind(this);
  }

  initialize({ helped }) {
    this.helped_el = helped;
  }

  setTarget(el) {
    this.target = el;
    this.showCurrentTagName();
    this.hideButtons();
  }

  showCurrentTagName() {
    this.el.querySelectorAll('a[data-tagname]').forEach((el) => el.classList.remove('selected'));
    if (this.target && this.target.tagName) {
      const currentTagName = this.target.tagName.toLowerCase();
      const selectedLink = this.el.querySelector(`a[data-tagname='${currentTagName}']`);
      if (selectedLink) selectedLink.classList.add('selected');
      const promptUse = this.el.querySelector('a.show use');
      if (promptUse) promptUse.setAttribute('href', `/spritemap.svg#sprite-${currentTagName}`);
    }
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

  changeTag(e) {
    if (e) e.preventDefault();
    const el = e.currentTarget;
    if (el) {
      const tagName = el.dataset.tagname;
      this.replaceTagWith(tagName);
    }
  }

  // TODO: replace caret after transformation.
  replaceTagWith(tagName) {
    let inputEls;
    let outputWrapper;
    let outputTagName;

    if (tagName && this.target) {
      const inputWrapper = this.target;
      const prevTagName = inputWrapper.tagName.toLowerCase();

      const innerTags = {
        pre: 'code',
        ol: 'li',
        ul: 'li',
      };

      // if would normally be wrapped
      // try to extract html from wrapping child element first
      const prevInnerTagName = innerTags[prevTagName];
      if (prevInnerTagName) {
        const prevEls = inputWrapper.querySelectorAll(prevInnerTagName);
        inputEls = Array.from(prevEls);
      }
      // If wrapping was not expected or not found, carry on with outer element
      if (!(inputEls && inputEls.length)) inputEls = [inputWrapper];

      if (innerTags[tagName]) {
        outputTagName = innerTags[tagName];
        outputWrapper = document.createElement(tagName);
      } else if (inputEls.length > 1) {
        outputTagName = tagName;
        outputWrapper = document.createDocumentFragment();
      } else {
        outputWrapper = document.createElement(tagName);
      }

      if (innerTags[tagName] || inputEls.length > 1) {
        inputEls.forEach((inputEl) => {
          const outputEl = document.createElement(outputTagName);
          outputEl.innerHTML = inputEl.innerHTML;
          outputWrapper.append(outputEl);
        });
      } else {
        outputWrapper.innerHTML = inputEls[0].innerHTML;
      }

      // here we rely on the similar interfaces of Node and DocumentFragment
      this.log('Placing', outputWrapper, 'over', inputWrapper);
      inputWrapper.replaceWith(outputWrapper);
      this.trigger('modify', outputWrapper);
      this.log('Leaves us with', outputWrapper);
      this.setTarget(outputWrapper);
    }
  }
}


BlockModifierView.prototype.template = Template;
BlockModifierView.prototype.tagName = 'div';
BlockModifierView.prototype.className = 'cms-helper-tool cms-modifier';
BlockModifierView.prototype.events = {
  'click a.hide': 'toggleButtons',
  'click a.show': 'toggleButtons',
  'click a[data-tagname]': 'changeTag',
};


export default BlockModifierView;
