/*
 * Namespace: lb.base.dom.Listener
 * DOM (Document Object Model) Listener Adapter Module for Base Library
 *
 * Creating a Listener attaches a callback to a DOM element for a given event.
 * The Listener can then detach() the configured callback, avoiding memory
 * leaks in IE.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-18
 */
/*requires lb.base.dom.js */
/*requires closure/goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom.Listener = function(element, type, callback, useCapture) {
  // Function: new Listener(element, type, callback[, useCapture])
  // Create a new listener for a type of event on a DOM element.
  //
  // Parameters:
  //   element - DOM Element, an element
  //   type - string, the name of an event (without 'on') e.g. 'click'
  //   callback - function, a function to call when the event is dispatched.
  //   useCapture - boolean, whether the callback is set for capture phase.
  //                Optional: defaults to false.
  //                See [1] for details.
  //
  // Returns:
  //   object, the new instance of Listener
  //
  // Reference:
  //   [1] DOM Level 2 Events: addEventListener
  //   <http://bit.ly/9SQoL4>

  // Declare aliases
  var events = goog.events,

  // Private fields
      key = events.listen(element, type, callback, useCapture);

  function detach(){
    // Function: detach()
    // Detach this listener from the DOM.
    //
    // Parameters:
    //   element - Element, a DOM element
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   listener - function, a function to call when the event is dispatched.
    //              May also be an object with a method handleEvent(event).
    //   useCapture - boolean, whether the callback is set for capture phase.
    //                Optional: defaults to false.
    //                See [1] for details.
    //
    // Reference:
    //   [1] DOM Level 2 Events: addEventListener
    //   <http://bit.ly/9SQoL4>

    events.unlistenByKey(key);
  }

  // public API
  this.detach = detach;
};
