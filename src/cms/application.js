// eslint-disable-next-line
import Backbone from 'backbone';
// eslint-disable-next-line
import Stickit from 'backbone.stickit'

import { loadConfig } from 'Config/config';
import { Application } from 'backbone.marionette';
import { reportError } from 'Utility/notification';
import { prepareLibrary } from 'Utility/library';
import UIView from 'Views/ui';

class CMSApplication extends Application {
  initialize(el, options) {
    if (options) loadConfig(options);
    window.onerror = reportError;
    this.page_el = el;
    prepareLibrary();
    return this;
  }

  onStart() {
    this.ui = new UIView({ el: this.page_el });
    this.ui.render();
  }
}

export default CMSApplication;
