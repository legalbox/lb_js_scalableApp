/*
 * bezen.focus.js - focus a DOM element
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   2010-01-14 "Calvin's Snowball"
 *
 * To Cecile, with Love,
 * you were the first to wait for the conception of this library
 *
 * Tested successfully in
 *   Firefox 2, Firefox 3, Firefox 3.5,
 *   Internet Explorer 6, Internet Explorer 7, Internet Explorer 8,
 *   Chrome 3, Safari 3, Safari 4,
 *   Opera 9.64, Opera 10.10
 */
/*requires bezen.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global bezen, document */
bezen.focus = (function() {
  // Builder of
  // Closure for focus utilities
  
  // whether the focus has been initialized (typically done in window.onload)
  var isReadyToFocus = false;
  
  // a reference to the element to focus, stored until ready to focus
  var elementToFocus = null;

  var focus = function(element) {
    // Scroll to element
    // If the focus is not ready yet, store the element for deferred focus.

    if ( isReadyToFocus ) {
      if ( element.scrollIntoView ) {
        element.scrollIntoView();
      }
    } else {
      elementToFocus = element;
    }
  };
   
  var initFocus = function() {
    // Initialize focus
    // If an element has been previous selected in focus() before the
    // focus was ready, focus this element now.
    
    isReadyToFocus = true;
    if (elementToFocus !== null) {
      focus(elementToFocus);
    }
  };
   
  return { // public API
    
    init: initFocus,
    focus: focus,

    _: { // private section, for unit tests
    }
  };
}());
