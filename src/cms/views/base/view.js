import { View } from 'backbone.marionette';
import { templateContext } from 'Utility/i18n';
import { cleanCopy, stripControls, textOnly } from 'Utility/cleaning';
import { cmslog } from 'Utility/logging';

// Base classes with useful bits and pieces.
//
class CmsView extends View {
  onRender() {
    if (this.model) this.stickit();
    this.triggerMethod('after:render', this);
  }

  _renderHtml(template, data) {
    if (!template) return '';
    if (_.isFunction(template)) return template(data);
    return template;
  }

  // default change is just to trigger an 'updated' event.
  // usually that will cause a call to our `cleanContent`.
  contentChange() {
    this.trigger('updated');
  }

  cleanCopy() {
    return cleanCopy(this.el);
  }

  cleanCopyIfPopulated() {
    if (this.isPopulated()) return cleanCopy(this.el);
    return null;
  }

  isPopulated() {
    return this.model && this.model.get('populated');
  }

  cleanContent() {
    return stripControls(this.el);
  }

  textOnly(value) {
    return textOnly(value);
  }

  // onGet helpers
  //
  untrue(value) {
    return !value;
  }

  ifAbsent(value) {
    return !value;
  }

  ifPresent(value) {
    return !!value;
  }

  thisOrThat([thing, otherThing]) {
    return thing || otherThing;
  }

  thisAndThat([thing, otherThing]) {
    return thing && !!otherThing;
  }

  thisButNotThat([thing, otherThing]) {
    return thing && !otherThing;
  }

  thatIfThis([thing, otherThing]) {
    return thing && otherThing;
  }

  allOfThese(things = []) {
    return !things.find((t) => !t);
  }

  anyOfThese(things = []) {
    return !!things.find((t) => t);
  }

  noneOfThese(things = []) {
    return !things.find((t) => t);
  }

  thisButNotThose([thing, ...otherThings]) {
    return thing && !otherThings.find((t) => t);
  }

  inBytes(value) {
    if (value) {
      if (value > 1048576) {
        const mb = Math.floor(value / 10485.76) / 100;
        return `${mb}MB`;
      }
      const kb = Math.floor(value / 1024);
      return `${kb}KB`;
    }
    return '';
  }

  inPixels(value) {
    return `${value || 0}px`;
  }

  inTime(value) {
    if (value) {
      const seconds = parseInt(value, 10);
      if (seconds >= 3600) {
        const minutes = Math.floor(seconds / 60);
        return [Math.floor(minutes / 60), minutes % 60, seconds % 60].join(':');
      }
      return [Math.floor(seconds / 60), seconds % 60].join(':');
    }
    return '0:00';
  }

  asPercentage(value) {
    return `${value || 0}%`;
  }

  percentageStyleWidth(value) {
    const rounded = Math.round(10000 * value) / 100.0;
    const roundedPercentage = this.asPercentage(rounded);
    return `width: ${roundedPercentage}`;
  }

  providerClass(provider) {
    if (provider === 'YouTube') return 'yt';
    return '';
  }

  justDate(date) {
    if (date) date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    return null;
  }

  justDateNoYear(date) {
    if (date) return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return null;
  }

  numericalDate(date) {
    if (date) return date.toLocaleDateString();
    return null;
  }

  publicationDate([date, publicationDate]) {
    const preferredDate = date || publicationDate;
    if (preferredDate) return this.justDate(preferredDate);
    return null;
  }

  socialSymbolName(platform) {
    return `#${platform}_symbol`;
  }


  // Visibility functions
  //
  visibleWithFade($el, value) {
    if (value && !$el.is(':visible')) {
      $el.fadeIn();
    } else if ($el.is(':visible')) {
      $el.fadeOut();
    }
  }

  visibleAsBlock($el, value) {
    if (value) {
      $el.css('display', 'block');
    } else {
      $el.css('display', 'none');
    }
  }


  // Utilities

  containEvent(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  log(...args) {
    cmslog(`[${this.constructor.name}]`, ...args);
  }
}


CmsView.prototype.templateContext = templateContext;
export default CmsView;
