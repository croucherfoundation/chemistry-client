/*
 * THe UI wrapper is a little redundant when we only have a single page view to present,
 * but it is kept here in case of greater UI complexity later.
 */

import CmsView from 'Views/base/view';
import Page from 'Models/page';
import PageView from 'Views/pages/page';
import NoticesView from 'Views/notices/notices';
import ConfirmationView from 'Views/helpers/confirmation';
import Template from 'Templates/ui.html';
import { translate } from 'Utility/i18n';
import { getConfig } from 'Config/config';
import { trackWorkInProgress } from 'Utility/jobs';
import { getNotices } from 'Utility/notification';

class UIView extends CmsView {
  onBeforeRender() {
    const pageId = this.el.dataset.cmsPage;
    this.model = new Page({ id: pageId });
    console.log('⚛️ rendering UI in', this.el);
  }

  onRender() {
    this.$el.addClass('waiting');
    this.showChildView('notices', new NoticesView({ collection: getNotices() }));
    this.showPageEditor();
    this.$el.on('navigate', this.navigateIfSafe.bind(this));
    this.$el.on('exit', this.departWithConfirmation.bind(this));
  }

  showPageEditor() {
    trackWorkInProgress(this.model);
    this.getRegion('page').reset();
    this.model.loadAnd(() => {
      this.stickit();
      this.showChildView('page', new PageView({ model: this.model }));
      this.$el.removeClass('waiting');
    });
  }

  setModel(model) {
    if (model !== this.model) {
      this.model = model;
      this.showPageEditor();
    }
  }

  layoutClass(style) {
    return `layout_${style}`;
  }

  // TODO this ought to be routed for back-button support
  // but it's just a convenience for subpage-editing so we leave it for now.
  navigateIfSafe(e, page) {
    this.log('⛑ navigateIfSafe', e, page);
    if (e) e.preventDefault();
    if (this.model) {
      this.requestNavigationTo(page).done(() => {
        this.setModel(page);
      });
    } else {
      this.setModel(page);
    }
  }

  departWithConfirmation(e) {
    this.log('⛑ departWithConfirmation');
    if (e) e.preventDefault();
    this.requestNavigationAway().done(() => {
      window.location.href = getConfig('exit_url');
    });
  }

  requestNavigationTo(page) {
    const question = translate('confirmations.page_jump');
    const otherPageTitle = page.get('title');
    const message = `${question} '${otherPageTitle}'?`;
    const notes = this.pageStatusNotes();
    return this.requestConfirmation(message, notes);
  }

  requestNavigationAway() {
    const message = translate('confirmations.leave_editor');
    const notes = this.pageStatusNotes();
    return this.requestConfirmation(message, notes);
  }

  pageStatusNotes() {
    let notes = '';
    if (this.model.get('changed')) {
      notes += translate('confirmations.page_unsaved');
      if (this.model.get('busy')) {
        notes += translate('confirmations.and_work_in_progress');
      }
    } else if (this.model.get('busy')) {
      notes += translate('confirmations.work_in_progress');
    }
    return notes;
  }

  requestConfirmation(message, notes = '') {
    const confirmation = $.Deferred();
    const dialog = new ConfirmationView({ message, notes });
    this.showChildView('warning', dialog);
    dialog.on('accept', () => {
      this.clearWarning();
      confirmation.resolve();
    });
    dialog.on('reject', () => {
      this.clearWarning();
      confirmation.reject();
    });
    return confirmation.promise();
  }

  clearWarning() {
    this.getRegion('warning').reset();
  }
}

UIView.prototype.template = Template;
UIView.prototype.regions = {
  notices: '#notices',
  warning: '#warning',
  page: '#cms_page',
};
UIView.prototype.bindings = {
  '#cms_page': {
    attributes: [
      {
        name: 'class',
        observe: 'style',
        onGet: 'layoutClass',
      },
    ],
  },
};

export default UIView;
