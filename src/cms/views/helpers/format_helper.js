/*
 * The FormatHelper is a clean and minimal toolbar
 * that applies format to selected text in a tidy way.
 * It avoids execCommand and uses modern selections and ranges.
 */

import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/format_helper.html';
import AnchorHelperView from 'Views/helpers/anchor_helper';

class FormatHelperView extends CmsView {
  constructor(...args) {
    super(...args);
    this.onRender = this.onRender.bind(this);
    this.place = this.place.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  initialize({ helped }) {
    this.helped_el = helped;
    document.body.appendChild(this.el);
  }

  help(sel) {
    this._range = sel.getRangeAt(0).cloneRange();
    this.placeOnSelection();
    this.showCurrentFormat();
    this.show();
  }

  placeOnSelection() {
    if (this._range) {
      const bounds = this._range.getBoundingClientRect();
      this.place(bounds);
    }
  }

  showCurrentFormat() {
    const buttons = this.el.querySelectorAll('[data-cms-format]');
    buttons.forEach((button) => {
      const format = button.dataset.cmsFormat;
      const [currentState] = this.formattingState(format);
      if (format && (currentState === 'inside' || currentState === 'contiguous')) {
        button.classList.add('selected');
        button.classList.remove('partly');
      } else if (format && (currentState === 'starting' || currentState === 'ending')) {
        button.classList.add('partly');
        button.classList.remove('selected');
      } else {
        button.classList.remove('selected');
        button.classList.remove('partly');
      }
    });
  }

  formatButtonAction(e) {
    const button = e.currentTarget;
    if (button) {
      const format = button.dataset.cmsFormat;
      if (format === 'anchor') {
        this.anchorHelper();
      } else if (format) {
        this.applyFormat(format);
        this.reselectRange();
      }
    }
  }

  applyFormat(format, r) {
    const range = r || this._range;
    const start = range.startContainer;
    const end = range.endContainer;

    this.log('applyFormat', start, end);

    // all within the same text node: we can surround
    if (start === end) {
      return this.applyFormatToRange(format, range);
    }

    // two text nodes within the same parent element: we can surround
    if (start.nodeType === 3 && end.nodeType === 3) {
      if (start.parentNode === end.parentNode) {
        return this.applyFormatToRange(format, range);
      }
      // one end or the other might be contained in a formatting tag
      // TODO: this is only correct if we are touching a relevant format node
      if (end.parentNode.contains(start) || start.parentNode.contains(end)) {
        return this.applyFormatToRange(format, range);
      }
    }

    // selection spans multiple nodes: detach, format and reassemble
    return this.applyFormatToNodes(format, range);
  }

  // Chrome execCommand behaviour seems to be hased on the format of the end of the selection.
  // touching at start = remove format
  // touching at end = apply format
  // within = remove format, splitting node into two
  // around = apply format to everything

  applyFormatToRange(format, r) {
    const range = r || this._range;
    const [currentState, wrappingNode] = this.formattingState(format, range);
    const tagName = FormatHelperView.tagFor(format);

    this.log('applyFormatToRange', currentState, wrappingNode);

    if (currentState === 'contiguous') {
      // we are the format or we exactly wrap around it: remove
      const releasedNodes = this.unwrapNode(wrappingNode);
      range.setStartBefore(releasedNodes[0]);
      range.setEndAfter(releasedNodes[releasedNodes.length - 1]);
      return;
    }

    if (currentState === 'inside') {
      // we are inside the format: split and unformat using range offsets
      const beforeNode = range.startContainer; // we only come here when inside a node
      const afterNode = beforeNode.splitText(range.endOffset);
      const interNode = beforeNode.splitText(range.startOffset);

      // move the newly unformatted part to after the first format tag
      wrappingNode.after(interNode);

      // if anything left, move it to another formatting node after the unformatted part
      if (afterNode.textContent.trim()) {
        const newFormattingNode = document.createElement(tagName);
        newFormattingNode.append(afterNode);
        interNode.after(newFormattingNode);
      }

      // remove the first formatting tag if it is now empty
      this.log('beforeNode.textContent', beforeNode, beforeNode.textContent);
      if (!wrappingNode.innerText.trim()) {
        wrappingNode.remove();
      }

      return;
    }

    if (currentState === 'starting') {
      // we start inside the format: extract the part to be unformatted.
      const startNode = range.startContainer;
      const extractNode = startNode.splitText(range.startOffset);
      wrappingNode.after(extractNode);
      range.setStartBefore(extractNode);
      return;
    }

    if (currentState === 'ending') {
      // we end inside the format: extend the format node to the start of the selection
      const startNode = range.startContainer;
      const extractNode = startNode.splitText(range.startOffset);
      wrappingNode.prepend(extractNode);
      range.setEndAfter(extractNode);
      return;
    }

    // no relevant formatting in contact with this range
    let wrapperNode;
    try {
      wrapperNode = this.wrapRange(tagName, range);
    } catch (err) {
      this.applyFormatToNodes(format, range);
    }

    // clean up any nested formatting tags
    if (wrapperNode) {
      const redundantTagNames = FormatHelperView.tagsMatching(format);
      wrapperNode.querySelectorAll(redundantTagNames.join(', ')).forEach((oldformattingNode) => {
        this.unwrapNode(oldformattingNode);
      });
      range.selectNodeContents(wrapperNode);
    }
  }

  wrapRange(tagName, range) {
    const formattingNode = document.createElement(tagName);
    range.surroundContents(formattingNode);
    formattingNode.normalize();
    return formattingNode;
  }

  applyFormatToNodes(format, r) {
    const range = r || this._range;
    const start = range.startContainer;
    const end = this._range.endContainer;
    // if (start.nodeType === 3) start = start.parentNode;
    // if (end.nodeType === 3) end = end.parentNode;
    const frag = range.extractContents();
    const nodes = Array.from(frag.childNodes);
    let firstAffectedNode;
    let lastAffectedNode;

    // toggle formatting in each child element
    nodes.forEach((fragNode) => {
      const reformatted = this.applyFormatToNode(fragNode, format);
      this.log('replacinng', fragNode);
      this.log('with', reformatted);
      fragNode.replaceWith(reformatted);
    });

    // Splice formatted elements back over original selection
    const firstNewNode = frag.firstChild;
    let startElement = start;
    if (startElement.nodeType === 3) startElement = startElement.parentNode;
    if (startElement.contains(end)) {
      // working within block: keep node order
      start.after(firstNewNode);
    } else if (firstNewNode.nodeType === 3) {
      startElement.append(firstNewNode);
    } else {
      // unwrap the element that cloneContents added
      Array.from(firstNewNode.childNodes).forEach((node) => {
        if (!firstAffectedNode) firstAffectedNode = node;
        startElement.append(node);
      });
      firstNewNode.remove();
    }

    const lastNewNode = frag.lastChild;
    let endElement = end;
    if (endElement.nodeType === 3) endElement = endElement.parentNode;
    if (endElement.contains(start)) {
      end.before(lastNewNode);
    } else if (lastNewNode.nodeType === 3) {
      endElement.prepend(lastNewNode);
    } else {
      // unwrap the element that cloneContents added
      Array.from(lastNewNode.childNodes).reverse().forEach((node) => {
        if (!lastAffectedNode) lastAffectedNode = node;
        endElement.prepend(node);
      });
      lastNewNode.remove();
    }

    // any remaining fragment consists of whole nodes
    endElement.before(frag);

    if (firstAffectedNode) range.setStartBefore(firstAffectedNode);
    if (lastAffectedNode) range.setEndAfter(lastAffectedNode);
  }


  applyFormatToNode(node, format) {
    this.log('applyFormatToNode', node, format);
    const tagName = FormatHelperView.tagFor(format);
    const tagNames = FormatHelperView.tagsMatching(format);

    // if bare text, wrap it
    if (node.nodeType === 3) {
      return this.wrapText(tagName, node);
    }

    // contains node of this format. unwrap that node into this one
    const formattingNode = node.querySelector(tagNames.join(', '));
    if (formattingNode) {
      this.unwrapNode(formattingNode);
      return node;
    }

    // element is not formatted: wrap its contents
    return this.wrapNode(tagName, node);
  }

  wrapText(tagName, node) {
    const formattingNode = document.createElement(tagName);
    formattingNode.append(node.cloneNode());
    return formattingNode;
  }

  wrapNode(tagName, node) {
    if (node.innerText.trim().length) {
      const formattingNode = document.createElement(tagName);
      formattingNode.innerHTML = node.innerHTML;
      // eslint-disable-next-line no-param-reassign
      node.innerHTML = formattingNode.outerHTML;
    }
    return node;
  }

  // parent node is supplied if it happens to be available
  unwrapNode(node) {
    const movingNodes = Array.from(node.childNodes);
    movingNodes.forEach((movingNode) => {
      node.before(movingNode);
      this.log('unwrapped', movingNode);
    });
    node.remove();
    return movingNodes;
  }

  // Get current state of this format and this selection.
  // response will be an array of [state, node]
  // where state can be one of
  //     inside, touching, enclosing, none
  // And node is the relevant format-applying node, if any.
  //
  formattingState(format, r) {
    const range = r || this._range;
    const tagNames = FormatHelperView.tagsMatching(format);

    let ancestor = range.commonAncestorContainer;
    if (ancestor) {
      if (!ancestor.tagName) ancestor = ancestor.parentNode;
      ancestor = ancestor.closest(tagNames.join(','));
      if (ancestor) {
        if (range.cloneContents().textContent === ancestor.innerText) {
          return ['contiguous', ancestor];
        }
        return ['inside', ancestor];
      }
    }

    let startTag = range.startContainer;
    if (!startTag.tagName) startTag = startTag.parentNode;
    if (tagNames.includes(startTag.tagName.toLowerCase())) {
      return ['starting', startTag];
    }

    let endTag = range.endContainer;
    if (!endTag.tagName) endTag = endTag.parentNode;
    if (tagNames.includes(endTag.tagName.toLowerCase())) {
      return ['ending', endTag];
    }

    const fragment = range.cloneContents();
    const enclosedNode = fragment.querySelector(tagNames.join(','));
    if (enclosedNode) {
      enclosedNode.remove();
      if (fragment.childNodes.length) {
        // difficult to return actual node here, but also not really needed
        return ['outside', null];
      }
      // Special case: range exactly encloses formatting node,
      // usually as a result of applying more than one format.
      // Limitations of range API mean that we have to replace contents
      // with formatting node before we can return it. Range nodes are not gettable-at :|
      range.deleteContents();
      range.insertNode(enclosedNode);
      range.selectNodeContents(enclosedNode);
      return ['contiguous', enclosedNode];
    }

    // Return 'no' if there is no such formatting applied
    return ['none', null];
  }


  // Helpers

  place(rect) {
    const t = rect.top + window.scrollY - 40;
    const l = rect.left + window.scrollX + rect.width / 2;
    this.el.style.top = `${t}px`;
    this.el.style.left = `${l}px`;
    this.offsetIntoView();
  }

  offsetIntoView() {
    const rect = this.el.getBoundingClientRect();
    const overshoot = rect.left + rect.width + 10 - window.innerWidth;
    const body = this.el.querySelector('.cms-bg');
    this.log('floater overshoot', overshoot);
    if (overshoot > 0) {
      body.style.transform = `translate(${-overshoot}px, 0)`;
    } else {
      body.style.transform = 'translate(0, 0)';
    }
  }

  show() {
    this.releaseAnchor();
    this.el.classList.add('showing');
  }

  hide() {
    this.el.classList.remove('showing');
  }

  close() {
    this.releaseAnchor();
    this.hide();
  }

  // on anchor helper close
  checkAnchorAndReselect() {
    if (this._active_anchor) {
      if (!this._active_anchor.href) {
        this.deleteAnchor();
      } else {
        this._range.selectNodeContents(this._active_anchor);
        this._active_anchor = undefined;
        this.reselectRange();
      }
    }
  }

  deleteAnchor() {
    if (this._active_anchor) {
      this.unwrapNode(this._active_anchor);
    }
    this._active_anchor = undefined;
  }

  anchorHelper() {
    let [currentState, anchorNode] = this.formattingState('anchor');
    if (!currentState) currentState = 'none';
    // TODO: if range includes incomplete nodes, eat them
    if (!anchorNode) anchorNode = this.wrapRange('a', this._range);
    this._range.selectNodeContents(anchorNode);
    if (!this._anchor_helper) {
      this._anchor_helper = new AnchorHelperView();
      this._anchor_helper.on('close', this.checkAnchorAndReselect.bind(this));
      this._anchor_helper.on('remove', this.deleteAnchor.bind(this));
    }
    this._anchor_helper.help({
      node: anchorNode,
      range: this._range,
    });
    this._active_anchor = anchorNode;
    this.hide();
  }

  resumeHelping() {
    this.releaseAnchor();
    this.show();
    this.reselectRange();
  }

  releaseAnchor() {
    if (this._active_anchor && this._anchor_helper) this._anchor_helper.close();
  }

  // update page selection to contain our range after modification
  reselectRange(r) {
    const range = r || this._range;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.showCurrentFormat();
  }

  static tagFor(format) {
    switch (format) {
      case 'strong': return 'strong';
      case 'bold': return 'strong';
      case 'em': return 'em';
      case 'italic': return 'em';
      case 's': return 's';
      case 'strikethrough': return 's';
      case 'u': return 'u';
      case 'underline': return 'u';
      case 'a': return 'a';
      case 'anchor': return 'a';
      case 'code': return 'code';
      default: return 'span';
    }
  }

  static tagsMatching(format) {
    switch (format) {
      case 'bold': return ['strong', 'b'];
      case 'italic': return ['em', 'i'];
      case 'strikethrough': return ['s', 'del'];
      case 'underline': return ['u'];
      case 'anchor': return ['a'];
      case 'code': return ['code'];
      default: return [];
    }
  }
}


FormatHelperView.prototype.tagName = 'div';
FormatHelperView.prototype.className = 'cms-floater cms-toolbar';
FormatHelperView.prototype.template = Template;
FormatHelperView.prototype.events = {
  'click a[data-cms-format]': 'formatButtonAction',
};
FormatHelperView.prototype.ui = {
  formatters: '[data-cms-format]',
};


export default FormatHelperView;
