import Page from 'Models/page';
import CmsCollection from './collection';

class PagesCollection extends CmsCollection {
  rootPage() {
    return this.findWhere({ home: true }) || this.findWhere({ parent_id: null });
  }

  // Page tree
  // This is only for display efficiency. There is no need to maintain parent/child relations.
  // For each page we want to prepare:
  // * depth in tree
  // * parenting status
  // * overall position in tree-sorted list
  //
  buildTree() {
    const children = {};

    // prepare map of whole tree as parent -> [pages] associations
    this.each((model) => {
      const key = model.get('parent_id') || 'none';
      if (!children[key]) children[key] = [];
      children[key].push(model);
    });

    // recurse down branch-builder from first root to put pages in order
    const roots = children.none || [];
    let position = 0;
    roots.forEach((root) => {
      position = this.buildBranch(root, position, 0, children);
    });
    this.sort();
  }

  buildBranch(stem, currentPos, currentDepth, children) {
    let position = currentPos || 0;
    const depth = currentDepth || 0;
    stem.set({ position, depth });
    if (children[stem.id]) {
      const myChildren = _.sortBy(children[stem.id], (p) => p.get('title'));
      myChildren.forEach((child) => {
        position = this.buildBranch(child, position + 1, depth + 1, children);
      });
    }
    // return incremented pos value for next iteration.
    return position + 1;
  }
}

PagesCollection.class_key = 'pages';
PagesCollection.prototype.model = Page;
PagesCollection.prototype.singularName = 'page';
PagesCollection.prototype.pluralName = 'pages';
PagesCollection.prototype.comparator = 'position';

export default PagesCollection;
