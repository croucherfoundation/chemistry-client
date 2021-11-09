import environments from './environments.json';

let env;
let config;
const dev = new RegExp(/\.(dev|local)/);

if (dev.test(window.location.href)) {
  env = 'development';
} else {
  env = 'production';
}

function loadConfig(opts = {}) {
  config = _.defaults(opts, environments[env], environments.defaults);
}

function setEnv(newEnv) {
  env = newEnv;
  loadConfig();
}

function getEnv() {
  return env;
}

function appConfig() {
  if (!config) { loadConfig(); }
  return config;
}

function getConfig(key) {
  return appConfig()[key];
}

function setConfig(key, value) {
  appConfig()[key] = value;
}

function apiUrl(path) {
  return [getConfig('api_url'), path || ''].join('/');
}

function isTouchable() {
  // eslint-disable-next-line no-undef
  if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
    return true;
  }
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = (query) => window.matchMedia(query).matches;
  const query = ['(', prefixes.join('touch-enabled),('), '<3z', ')'].join('');
  return mq(query);
}


export {
  getEnv,
  setEnv,
  loadConfig,
  appConfig,
  getConfig,
  setConfig,
  apiUrl,
  isTouchable,
};
