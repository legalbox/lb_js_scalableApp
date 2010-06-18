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
 * Legal Box SAS (c) 2010, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2010-06-18
 */
/*requires lb.base.dom.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom.Listener = lb.base.dom.Listener ||
  function(element, type, callback, useCapture) {
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
  useCapture = useCapture || false;

  // Declare aliases
      /*requires closure/goog.events.js */
  var events = goog.events,

  // Private fields
      key = events.listen(element, type, callback, useCapture);

  function getElement(){
    // Function: getElement(): DOM Element
    // Get the target DOM element on which the listener is attached.
    //
    // Returns:
    //   DOM Element, the same element provided in constructor.

    return element;
  }

  function getType(){
    // Function: getType(): string
    // Get the type of event for which this event is registered.
    //
    // Returns:
    //   string, the name of the event (without 'on') provided in constructor.

    return type;
  }

  function getCallback(){
    // Function: getCallback(): function
    // Get the callback function associated with the listener.
    //
    // Returns:
    //   function, the callback configured in constructor.

    return callback;
  }

  function isUsingCapture(){
    // Function: isUsingCapture(): boolean
    // Get whether the listener is set for the capture phase.
    //
    // Returns:
    //   boolean, the useCapture flag configured in constructor,
    //   or false if none was provided.

    return useCapture;
  }

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
  this.getElement = getElement;
  this.getType = getType;
  this.getCallback = getCallback;
  this.isUsingCapture = isUsingCapture;
  this.detach = detach;
};
