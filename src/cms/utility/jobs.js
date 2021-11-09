// The job queue is a way for the main page to track other UI activity
// It's a bit cheap and cheerful at the moment and is built on a very
// heterogenous backbone collection. It will proabbly evolve to hold
// distinct job objects but for now I like the simplicity of listening
// to the already-bound models.

import { Collection } from 'backbone';

const workList = new Collection();

function workInProgress() {
  return workList;
}

function startWork(model) {
  workList.add(model);
}

function stopWork(model) {
  workList.remove(model);
}

function trackWorkInProgress(model) {
  window.p = model;
  workList.on('add remove reset change:progress', () => {
    const busy = workList.length > 0;
    model.set('busy', busy);
    if (busy) {
      const overallProgress = workList.reduce((s, m) => {
        const p = m.get('progress') || 0;
        return s + p;
      }, 0);
      model.set('progress', overallProgress / workList.length);
    } else {
      model.unset('progress');
    }
  });
}

export {
  workInProgress,
  startWork,
  stopWork,
  trackWorkInProgress,
};
