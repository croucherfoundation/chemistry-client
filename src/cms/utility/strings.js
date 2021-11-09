const nativeTrim = String.prototype.trim;

// Helpers normalise input

function makeString(object) {
  if (!object) return '';
  return `${object}`;
}

function escapeRegExp(str) {
  // eslint-disable-next-line no-useless-escape
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function defaultToWhiteSpace(characters) {
  if (characters === null) return '\\s';
  if (characters.source) return characters.source;
  const escaper = escapeRegExp(characters);
  return `[${escaper}]`;
}

function trim(str, chars) {
  const string = makeString(str);
  if (!chars && nativeTrim) return nativeTrim.call(string);
  const characters = defaultToWhiteSpace(chars);
  return string.replace(new RegExp(`^${characters}+|${characters}+$`, 'g'), '');
}

// string processing functions

// replace all non-alphabetics with dashes
function dasherize(str) {
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}

// take camelcase input, return underscored lowercase.
function underscored(str) {
  return trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

// squash to a url-compatible slug with sensible treatment of accented characters
/* eslint-disable no-multi-spaces, no-useless-escape */
function slugify(str) {
  return str.toString().toLowerCase()
    .replace('&nbsp;', ' ')         // remove contenteditable space-holders
    .replace(/[åàáãäâ]/, 'a')       //
    .replace(/[èéëê]/, 'e')         //
    .replace(/[ìíïî]/, 'i')         //
    .replace(/[òóöô]/, 'o')         // flatten accented characters
    .replace(/[ùúüû]/, 'u')         //
    .replace(/ñ/, 'n')              //
    .replace(/ç/, 'c')              //
    .replace(/ß/, 'ss')             //
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/-+/g, '-')            // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
    .trim();                        // Remove leading and trailing spaces
}
/* eslint-enable no-multi-spaces, no-useless-escape */

// truncate a string to the specified length
function truncate(str, l, truncateStr) {
  const string = makeString(str);
  const ellipsis = truncateStr || '...';
  const len = l || 80;
  return string.length > len ? string.slice(0, len) + ellipsis : string;
}

// generate a binding truncator of custom length.
function truncator(length) {
  return (str, truncateStr) => truncate(str, length, truncateStr);
}


export {
  dasherize,
  slugify,
  truncate,
  truncator,
  trim,
  underscored,
};
