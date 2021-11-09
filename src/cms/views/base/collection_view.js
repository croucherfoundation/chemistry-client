import { CollectionView } from 'backbone.marionette';
import { templateContext } from 'Utility/i18n';
import { cleanCopy } from 'Utility/cleaning';
import { cmslog } from 'Utility/logging';

class CmsCollectionView extends CollectionView {
  onRender() {
    if (this.model) this.stickit();
    this.triggerMethod('after:render', this);
  }

  cleanContent() {
    return this.cleanCopy().outerHTML;
  }

  cleanCopy() {
    return cleanCopy(this.el);
  }


  // cleanCopy() {
  //   const wrapper = document.createElement(this.tagName);
  //   if (this.className) {
  //     this.className.split(/\s+/).forEach((cls) => wrapper.classList.add(cls));
  //   }
  //   this.children.toArray().forEach((view) => {
  //     const node = view.cleanCopyIfPopulated();
  //     if (node) wrapper.append(node);
  //   });
  //   return wrapper;
  // }

  log(...args) {
    cmslog(`[${this.constructor.name}]`, ...args);
  }
}


CmsCollectionView.prototype.templateContext = templateContext;
CmsCollectionView.prototype.tagName = 'ul';
export default CmsCollectionView;
