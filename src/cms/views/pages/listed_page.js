import { confirm } from 'Utility/notification';
import { truncate } from 'Utility/strings';
import { translate } from 'Utility/i18n';
import { textOnly } from 'Utility/cleaning';
import ListedAssetView from 'Views/assets/listed_asset';
import Template from 'Templates/pages/listed_page';

class ListedPageView extends ListedAssetView {
  onAfterRender() {
    if (this.model.isNew()) {
      this.ui.editor.show();
      if (this.ui.edit_title && this.ui.edit_title.length) {
        _.defer(() => {
          this.log('focussing on', this.ui.edit_title);
          this.ui.edit_title.focus();
        });
      }
    }
  }

  indentStyle(depth = 0) {
    return `width: ${depth * 32}px`;
  }

  truncatedTitle(value) {
    return truncate(textOnly(value), 42);
  }

  styleSymbol(style) {
    const pageStyle = style || 'heroic'; // TODO collection default style
    return `/spritemap.svg#sprite-page-${pageStyle}`;
  }

  savePage(e) {
    if (e) e.preventDefault();
    this.model.save().done(() => {
      confirm(translate('affirmations.page_saved'));
      this.$el.removeClass('confirmed').addClass('confirmed');
    });
  }

  selectPage(e) {
    if (e) e.preventDefault();
    this.trigger('select', this.model);
  }

  discardPage() {
    this.model.discard();
  }

  interceptControlKey(e) {
    if (e.code === 'Enter') {
      this.savePage();
      return false;
    }
    if (e.code === 'Escape') {
      this.discardPage();
      return false;
    }
    return true;
  }

  textOnly(value) {
    return textOnly(value);
  }
}


ListedPageView.prototype.template = Template;
ListedPageView.prototype.tagName = 'li';
ListedPageView.prototype.className = 'page';
ListedPageView.prototype.events = {
  'click a.page': 'selectPage',
  'click a.save': 'savePage',
  'click a.remove': 'discardPage',
  'keydown .edit_title': 'interceptControlKey',
};
ListedPageView.prototype.ui = {
  editor: 'span.unsaved',
  edit_title: 'span.edit_title',
};
ListedPageView.prototype.bindings = {
  ':el': {
    classes: {
      unpublished: {
        observe: 'published_at',
        onGet: 'untrue',
      },
      unsaved: {
        observe: 'created_at',
        onGet: 'untrue',
      },
    },
    attributes: [
      {
        name: 'data-page',
        observe: 'id',
      },
    ],
  },
  'a.toggle': {
    observe: 'parental',
    visible: true,
  },
  'use.content': {
    attributes: [
      {
        name: 'href',
        observe: 'style',
        onGet: 'styleSymbol',
      },
    ],
  },
  '.saved': {
    observe: 'created_at',
    visible: true,
  },
  '.unsaved': {
    observe: 'created_at',
    visible: 'untrue',
  },
  'a.save': {
    observe: 'changed',
    visible: true,
  },
  '.edit_title': {
    observe: 'title',
    onSet: 'textOnly',
    onGet: 'textOnly',
  },
  '.title': {
    observe: 'title',
    onGet: 'truncatedTitle',
  },
  '.collection': {
    observe: 'collectionName',
    onGet: 'truncatedTitle',
  },
  '.date': {
    observe: 'published_at',
    onGet: 'justDate',
  },
  '.indent': {
    attributes: [
      {
        name: 'style',
        observe: 'depth',
        onGet: 'indentStyle',
      },
    ],
  },
};

export default ListedPageView;
