import CmsModel from './model';

class CustomTest extends CmsModel {
  isPopulated() {
    return !!this.get('oolala').trim();
  }
}

CustomTest.prototype.singularName = 'customTest';
CustomTest.prototype.pluralName = 'customTests';
CustomTest.prototype.savedAttributes = [];
CustomTest.prototype.defaults = {
  asset_type: 'customTest',
  oolala: '',
};

export default CustomTest;
