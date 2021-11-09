import { getConfig } from 'Config/config';
import { translate } from 'Utility/i18n';
import { Collection } from 'backbone';

let reportErrors = getConfig('report_errors');
let trapErrors = getConfig('trap_errors');

const notices = new Collection();

function getNotices() {
  return notices;
}

/*
  user notification
 */

function notify(message, duration = 4000, href = null, type = 'info') {
  notices.add({
    message,
    href,
    duration,
    type,
  });
}

function confirm(message, href) {
  notify(message, 4000, href, 'success');
}

function complain(message, href) {
  // eslint-disable-next-line
  console.log("complain", message, href);
  notify(message, 100000, href, 'error');
}

function warn(message, href) {
  notify(message, 10000, href, 'warning');
}


/*
  Exception-trapping
 */

function reportError(message, source, lineno, colno, error) {
  let complaint;

  if (error === 'not_allowed') {
    complaint = `<p><strong>${translate('problems.not_allowed')}</strong>.${translate('notes.view_denied')}`;
  } else if (error === 'not_found') {
    complaint = `<p><strong>${translate('problems.not_found')}</strong>.${translate('notes.item_denied')}`;
  }

  // user-behaviour grumbles are presented
  if (complaint) {
    complain(complaint, 100000);
    return true;
  }

  // Unexpected exceptions are presented and / or notified according to environment settings
  complaint = `<strong>${message}</strong> at ${source} line ${lineno} col ${colno}.`;
  if (reportErrors) notify(complaint, 100000, null, 'error');
  // return true to indicate error has been handled;
  // false to allow browser display or other reporting in client app.
  return trapErrors;
}

function startComplaining() {
  reportErrors = true;
  trapErrors = false;
}

function stopComplaining() {
  reportErrors = false;
  trapErrors = true;
}


export {
  getNotices,
  confirm,
  warn,
  complain,
  reportError,
  startComplaining,
  stopComplaining,
};
