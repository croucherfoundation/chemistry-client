import CmsView from 'Views/base/view';
import Template from 'Templates/helpers/progress_bar.html';

class ProgressBarView extends CmsView {
  onAfterRender() {
    const uploadType = this.model.singularName;
    this.ui.symbol.attr('href', `/spritemap.svg#sprite-${uploadType}_button`);
    this.ui.icon.addClass(uploadType);
  }

  styleWidth(progress) {
    return `width: ${progress * 100}%`;
  }

  cancelUpload(e) {
    if (e) e.preventDefault();
    this.model.cancelSave();
  }

  progressComplete(progress) {
    return progress && progress >= 0.999;
  }

  progressIncomplete(progress) {
    return progress && progress < 0.999;
  }
}

ProgressBarView.prototype.template = Template;
ProgressBarView.prototype.tagName = 'div';
ProgressBarView.prototype.ui = {
  icon: 'svg.file',
  symbol: 'svg.file use',
};
ProgressBarView.prototype.events = {
  'click a.cancel': 'cancelUpload',
};
ProgressBarView.prototype.bindings = {
  'span.job_status': 'status',
  'span.percentage': 'progress',
  'span.file_name': 'file_name',
  'span.bar': {
    attributes: [
      {
        name: 'style',
        observe: 'progress',
        onGet: 'styleWidth',
      },
    ],
  },
  '.uploading': {
    observe: 'progress',
    visible: 'progressIncomplete',
  },
  '.uploaded': {
    observe: 'progress',
    visible: 'progressComplete',
  },
};

export default ProgressBarView;
