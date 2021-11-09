import config from 'Config/dev.json';
import chemistry from './chemistry';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('[data-cms-page]');
  chemistry(el, config);
});
