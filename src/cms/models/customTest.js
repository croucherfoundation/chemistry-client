import CmsModel from './model';

class CustomTest extends CmsModel {
  isPopulated() {
    return !!this.get('customTestContent').trim();
  }
}

CustomTest.prototype.singularName = 'customTest';
CustomTest.prototype.pluralName = 'customTests';
CustomTest.prototype.savedAttributes = [];
CustomTest.prototype.defaults = {
  asset_type: 'customTest',
  customTestContent: '',
};

export default CustomTest;
