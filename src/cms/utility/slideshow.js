/*
 * The slideshow is a scroll/touch helper to present a lightweight swipable image slideshow.
 * It responds to swipe and scroll geustures but not browser drag.
 * The basic principle:
 * 1. transform with gesture
 * 2. work out intent
 * 3. snap to appropriate slide
 * Much of this is taken from Kevin Foley
 * at https://css-tricks.com/the-javascript-behind-touch-friendly-sliders/
 */

import { cmslog } from 'Utility/logging';

class Slideshow {
  constructor($el, callbacks) {
    this.container = $el;
    this.el = $el.get(0);
    this.callbacks = callbacks || {};
    this.holder = $el.find('.cms-slide-holder');
    this.slides = $el.find('.cms-slide');
    this.touchstartx = undefined;
    this.touchmovex = undefined;
    this.movex = undefined;
    this.index = 0;
    this.max = 0;
    this.maxDrag = 0;
    this.longTouch = undefined;
    this.mode = 'horizontal';
    this._goToEndOnUpdate = false;

    this.init = this.init.bind(this);
    this.getSlides = this.getSlides.bind(this);
    this.movePrev = this.movePrev.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.panTo = this.panTo.bind(this);
    this.setAspect = this.setAspect.bind(this);

    const resizeObserver = new ResizeObserver(this.setAspect);
    resizeObserver.observe(this.container.get(0));

    const slidesObserver = new MutationObserver(this.getSlides);
    slidesObserver.observe(this.holder.get(0), { childList: true });
  }

  init() {
    this.holder.on('touchstart', this.touchStart.bind(this));
    this.holder.on('touchmove', this.touchMove.bind(this));
    this.holder.on('touchend', this.touchEnd.bind(this));
    this.setAspect();
    this.getSlides();
  }

  getSlides() {
    this.slides = this.container.find('.cms-slide');
    this.max = this.slides.length - 1;
    if (this.slideWidth) {
      this.maxDrag = this.max * this.slideWidth;
    }
    if (this._goToEndOnUpdate) {
      this.panTo(this.max);
      this._goToEndOnUpdate = false;
    }
  }

  setAspect() {
    const rect = this.el.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    if (aspect < 0.4) {
      if (this.mode !== 'vertical') cmslog('🎪 slideshow goes vertical');
      this.mode = 'vertical';
      this.el.parentElement.classList.add('vertical');
    } else if (this.mode === 'vertical') {
      this.mode = 'horizontal';
      this.el.parentElement.classList.remove('vertical');
    }
    this.slideWidth = rect.width;
    this.maxDrag = this.max * this.slideWidth;
  }

  movePrev() {
    this.panTo(this.index - 1);
  }

  moveNext() {
    this.panTo(this.index + 1);
  }

  moveToEndWhenUpdated() {
    this._goToEndOnUpdate = true;
  }

  panTo(index) {
    if (index >= 0 && index <= this.max) {
      this.holder.addClass('animate').css('transform', `translate3d(-${index * this.slideWidth}px,0,0)`);
      this.index = index;
      if (this.callbacks.onMove) this.callbacks.onMove(this.index);
    }
  }

  revert() {
    this.panTo(this.index);
  }

  reset() {
    this.panTo(0);
  }

  // Touch event handlers
  //
  touchStart(event) {
    this.longTouch = false;
    const flickCheck = () => { this.longTouch = true; };
    setTimeout(flickCheck.bind(this), 250);
    this.touchstartx = event.originalEvent.touches[0].pageX;
    $('.bump').removeClass('bump right left');
    $('.animate').removeClass('animate'); // don't transition while dragging
  }

  touchMove(event) {
    this.touchmovex = event.originalEvent.touches[0].pageX;
    this.movex = this.index * this.slideWidth + (this.touchstartx - this.touchmovex);
    if (this.movex < 0) {
      this.movex = -(2 * Math.sqrt(Math.abs(this.movex)));
    } else if (this.movex > this.maxDrag) {
      this.movex = this.maxDrag + (2 * Math.sqrt(Math.abs(this.movex - this.maxDrag)));
    }
    this.holder.css('transform', `translate3d(${-this.movex}px,0,0)`);
  }

  touchEnd() {
    // Get size of swipe
    const absMove = Math.abs(this.index * this.slideWidth - this.movex);

    // Check for sufficient movement:
    // dragged more than halfway,      or a quick flick
    const significantMove = (absMove > (this.slideWidth / 3) || this.longTouch === false);

    // Establish direction, if any
    let direction;
    if (this.movex > (this.index * this.slideWidth)) direction = 'right';
    else if (this.movex < (this.index * this.slideWidth)) direction = 'left';
    else direction = 'unmoved';

    // move to specified slide if there is one, or rebound to current slide
    if (significantMove && direction === 'right' && this.index < this.max) {
      this.moveNext();
    } else if (significantMove && direction === 'left' && this.index > 0) {
      this.movePrev();
    } else {
      this.revert();
    }
  }
}

// repeatable init function is the only export;
// returns the slideshow object.
//
function slideshow(el, callbacks) {
  if (el.slideshow) {
    el.slideshow.refresh();
  } else {
    // eslint-disable-next-line no-param-reassign
    el.slideshow = new Slideshow(el, callbacks);
    el.slideshow.init();
  }
  return el.slideshow;
}


export default slideshow;
