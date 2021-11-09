import { Model } from 'backbone';

class Locale extends Model {}

Locale.prototype.singularName = 'locale';
Locale.prototype.pluralName = 'locales';

export default Locale;
