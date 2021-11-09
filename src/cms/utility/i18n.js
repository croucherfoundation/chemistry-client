// import { sendUiSignal } from 'Utility/signals';
import En from 'Locales/en.json';
import De from 'Locales/de.json';

const locales = { en: En, de: De };
let currentUiLocale = 'en';

// Provide entire locale under `t` to view templates
//
function templateContext() {
  return {
    t: locales[currentUiLocale],
  };
}

// Ad-hoc internationalisation service.
// translate() takes a dotted key, returns a single string from the currently active locale.
// eg. translate('placeholders.app.name')
//
function translate(key) {
  const locale = locales[currentUiLocale];
  const keyParts = Array.isArray(key) ? key : key.split('.');
  return keyParts.reduce((prev, curr) => prev && prev[curr], locale);
}

// localise() takes a key, returns raw locale data for that key.
// eg. localise('datepicker')

function localise(key) {
  const locale = locales[currentUiLocale] || {};
  return locale[key];
}

function getUILocale() {
  return currentUiLocale;
}

function setUILocale(loc) {
  if (loc && locales[loc] && loc !== currentUiLocale) {
    localStorage.setItem('ui_locale', loc);
    document.documentElement.lang = loc;
    // sendUiSignal('locale_change', loc);
    currentUiLocale = loc;
  }
  return currentUiLocale;
}

function initLocales() {
  const params = new URLSearchParams(window.location.search);
  const initialLocale = params.get('loc') || localStorage.getItem('ui_locale') || window.navigator.userLanguage || window.navigator.language || 'de';
  return setUILocale(initialLocale);
}

function uiLocales() {
  return locales;
}

export {
  translate,
  localise,
  templateContext,
  initLocales,
  getUILocale,
  setUILocale,
  uiLocales,
};
