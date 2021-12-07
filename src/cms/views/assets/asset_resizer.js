import CmsView from 'Views/base/view';

class AssetResizerView extends CmsView {
  constructor(...args) {
    super(...args);
    console.log('asset_resizer constructure');
  }

  alignLeft() {
    document.querySelector('.embed.images').classList.add('left');
    document.querySelector('.embed.images').classList.remove('center', 'right');
  }

  alignCenter() {
    document.querySelector('.embed.images').classList.add('center');
    document.querySelector('.embed.images').classList.remove('left', 'right');
  }

  alignRight() {
    document.querySelector('.embed.images').classList.add('right');
    document.querySelector('.embed.images').classList.remove('left', 'center');
  }

  resizeImage(e) {
    const newWidth = e.target.value;
    console.log('resizeImage', newWidth);

    document.querySelector('.embed.images').style = `--width: ${newWidth}px`;
  }
}

AssetResizerView.prototype.tagName = 'section';
AssetResizerView.prototype.className = 'resizeInputs';
AssetResizerView.prototype.ui = {
  width: 'input[name="width"]',
  left: 'span.left',
  center: 'span.center',
  right: 'span.right',
};
AssetResizerView.prototype.events = {
  'focusout @ui.width': 'resizeImage',
  'click @ui.left': 'alignLeft',
  'click @ui.center': 'alignCenter',
  'click @ui.right': 'alignRight',
};

export default AssetResizerView;
