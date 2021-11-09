import CmsModel from './model';

class Note extends CmsModel {}


Note.prototype.singularName = 'note';
Note.prototype.pluralName = 'notes';
Note.prototype.savedAttributes = [];
Note.prototype.defaults = {
  asset_type: 'note',
  text: '',
};

export default Note;
