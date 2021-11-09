/* eslint no-console: ["off"] */

import { getConfig } from 'Config/config';

let loggingActive = getConfig('logging');

function logging() {
  return loggingActive;
}

function cmslog(...args) {
  if (loggingActive && console && console.log) console.log(...args);
}

function cmswarn(...args) {
  if (loggingActive && console && console.warn) console.warn(...args);
}

function cmserror(...args) {
  if (loggingActive && console && console.error) console.error(...args);
}

function startLogging() {
  loggingActive = true;
}

function stopLogging() {
  loggingActive = false;
}

export {
  logging,
  cmslog,
  cmswarn,
  cmserror,
  startLogging,
  stopLogging,
};
