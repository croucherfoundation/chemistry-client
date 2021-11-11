import CmsView from 'Views/base/view';
import ProgressBarsView from 'Views/helpers/progress_bars';
import Template from 'Templates/pages/saver.html';
import { workInProgress } from 'Utility/jobs';

class PageSaverView extends CmsView {
  constructor(...args) {
    super(...args);
    this.saveAction = this.saveAction.bind(this);
    this.publishAction = this.publishAction.bind(this);
  }

  onAfterRender() {
    this.showChildView('progress', new ProgressBarsView({
      collection: workInProgress(),
    }));
  }

  saveAction(e) {
    if (e) e.preventDefault();
    this.ui.save.addClass('waiting');
    this.model.save().done(() => this.ui.save.removeClass('waiting'));
  }

  publishAction(e) {
    if (e) e.preventDefault();
    this.ui.publish.addClass('waiting');
    this.model.publish().done(() => this.ui.publish.removeClass('waiting'));
  }
}


PageSaverView.prototype.template = Template;

PageSaverView.prototype.regions = {
  progress: '.progress',
};

PageSaverView.prototype.ui = {
  save: 'a.save',
  publish: 'a.publish',
  view: 'a.view',
};

PageSaverView.prototype.events = {
  'click @ui.save': 'saveAction',
  'click @ui.publish': 'publishAction',
};

PageSaverView.prototype.bindings = {
  'a.save': {
    classes: {
      available: {
        observe: ['changed', 'busy'],
        onGet: 'thisButNotThat',
      },
    },
  },
  'a.publish': {
    classes: {
      available: {
        observe: ['outofdate', 'changed', 'busy'],
        onGet: 'thisButNotThose',
      },
    },
  },
  'a.view': {
    classes: {
      available: 'url',
    },
    attributes: [
      {
        name: 'href',
        observe: 'url',
      },
    ],
  },
};


export default PageSaverView;
