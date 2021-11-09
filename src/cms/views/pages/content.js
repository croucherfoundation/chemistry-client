// PageContentView is a wrapper around a list of element managers.
// Blocks elements are simple html contained in a working div
// Asset helpers manage structured embeds
// an 'updated' event from any of those will cause us to query
// the whole set and update page content html.

// TODO consider pre-processing the child nodes so that we don't rely on
// recursion through the mutation observer, which seems dangerous.

import { stripHtml } from 'Utility/cleaning';
import { truncate } from 'Utility/strings';
import CmsView from 'Views/base/view';
import EmbedDefs from 'Config/embeds';
import EmbedView from 'Views/base/embed';
import BlocksView from 'Views/base/blocks';

class PageContentView extends CmsView {
  onRender() {
    const initialContent = this.model.get('content');
    if (initialContent && initialContent.trim()) {
      this.el.innerHTML = initialContent;
    } else {
      this.el.innerHTML = '<div class="blocks"></div>';
    }
    this.list_observer = new MutationObserver(this.elementsChange.bind(this));
    this.list_observer.observe(this.el, { childList: true });

    // defined here so that we have just a single document listener:
    // selection actions are passed on to the right helper object
    document.onselectionchange = _.debounce(this.selectionChange.bind(this), 100);

    // care is needed here as setHelpers relies on recursion through the MutationObserver
    this.setHelpers();
  }

  elementsChange() {
    this.setHelpers();
  }

  contentChange() {
    this.model.set('content', this.cleanContent());
    this.model.set('excerpt', this.extractExcerpt());
  }

  selectionChange() {
    const sel = document.getSelection();
    if (sel.rangeCount) {
      let parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType !== 1) parentEl = parentEl.parentNode;
      if (this.el.contains(parentEl)) {
        Array.from(this.el.children).forEach((el) => {
          if (el.cmsHelper && el.cmsHelper.releaseSelection) el.cmsHelper.releaseSelection();
        });
        const blocksDiv = parentEl.closest('.cms-blocks'); // TODO: be less specific
        if (blocksDiv && blocksDiv.cmsHelper) {
          // TODO: close down any other formatting toolbars that might be visible
          blocksDiv.cmsHelper.handleSelection(sel, parentEl);
        }
      }
    }
  }

  onDestroy() {
    if (this.list_observer) this.list_observer.disconnect();
    Array.from(this.el.children).forEach((el) => {
      if (el.cmsHelper) el.cmsHelper.destroy();
    });
  }

  setHelpers() {
    // the `every` loop will exit if any embedding call returns false
    // which we must do on any action that will amend the children of this.el
    // so eg. we break out of blockshelper rendering if the previous block
    // shold subsume this one then return false to allow re-rendering.
    Array.from(this.el.children).every((el) => {
      const embedDef = EmbedDefs.find((e) => el.matches(e.selector));
      if (embedDef) {
        return this.assetHelper(el, embedDef);
      }

      // the migrate_selector matches old chemistry embed blocks and causes them to be imported
      const migrateDef = EmbedDefs.find((e) => el.matches(e.migrate_selector));
      if (migrateDef) {
        return this.assetImport(el, migrateDef);
      }

      // no asset match => treat as html block.
      return this.blocksHelper(el);
    });
  }

  assetHelper(element, embedDef) {
    const el = element;
    if (!el.cmsHelper) {
      const contentView = embedDef.content_view;
      const label = embedDef.label;
      const page = this.model;
      const cmsHelper = new EmbedView({
        el,
        page,
        label,
        contentView,
      });
      el.cmsHelper = cmsHelper;
      cmsHelper.render();
      cmsHelper.on('updated', this.contentChange.bind(this));
      cmsHelper.focus();
    }
    return true;
  }

  assetImport(element, embedDef) {
    const contentView = embedDef.content_view;
    const page = this.model;
    const label = embedDef.label;
    const cmsHelper = new EmbedView({
      page,
      label,
      contentView,
      migrate: element.cloneNode(true),
    });
    cmsHelper.render();
    this.el.insertBefore(cmsHelper.el, element);
    element.remove();
    return false;
  }

  // Often this routine will run many times while adjacent blocks are
  // wrapped and merged upwards into a single helped stack.
  // The first call will create a helper; the following calls will
  // merge subsequent nodes into it until either an asset or the end
  // of the parent element is reached.
  //
  blocksHelper(element) {
    const el = element;

    // If previous node has a blocksHelper, merge and exit
    if (el.previousElementSibling && el.previousElementSibling.cmsBlocks) {
      el.previousElementSibling.cmsHelper.subsume(el);
      return false; // interrupts
    }

    // If we are not div.cms-blocks, wrap el in div.cms-blocks and exit
    if (!(el.tagName === 'DIV' && el.classList.contains('cms-blocks'))) {
      const wrapper = document.createElement('DIV');
      wrapper.classList.add('cms-blocks');
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      return false;
    }

    // We are in the right place and adjacent blocks have been coalesced;
    // does this remaining el have a helper yet?
    if (!el.cmsHelper) {
      const page = this.model;
      const blocksHelper = new BlocksView({ el, page });
      blocksHelper.render();
      blocksHelper.on('updated', this.contentChange.bind(this));
      el.cmsHelper = blocksHelper;
      el.cmsBlocks = true;
    }
    return true;
  }

  cleanContent() {
    const contentBlocks = [];
    Array.from(this.el.children).forEach((el) => {
      if (el.cmsHelper) {
        const html = el.cmsHelper.cleanContent();
        contentBlocks.push(html);
      }
    });
    return contentBlocks.join('\n');
  }

  extractExcerpt() {
    const text = stripHtml(this.el);
    return truncate(text, 512);
  }
}


PageContentView.prototype.tagName = 'div';
PageContentView.prototype.className = 'content';

export default PageContentView;

