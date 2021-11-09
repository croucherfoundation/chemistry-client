import { Collection } from 'backbone';
import Locale from 'Models/locale';

class LocalesCollection extends Collection {}

LocalesCollection.prototype.model = Locale;
LocalesCollection.prototype.comparator = 'name';
LocalesCollection.prototype.singularName = 'locale';
LocalesCollection.prototype.pluralName = 'locales';

export default LocalesCollection;
