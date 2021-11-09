import CMSApplication from './cms/application';
import './cms/stylesheets/chemistry.sass';

function chemistry(el, options) {
  return new CMSApplication(el, options).start();
}

export default chemistry;
