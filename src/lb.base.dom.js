/*
 * Namespace: lb.base.dom
 * DOM (Document Object Model) Adapter Module for Base Library
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-06
 */
/*requires lb.base.js */
/*requires closure/goog.dom.js */
/*requires closure/goog.dom.classes.js */
/*requires closure/goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom = lb.base.dom || (function() {
  // Builder of
  // Closure for lb.base.dom module

  // Declare aliases
  var dom = goog.dom,
      classes = goog.dom.classes,
      events = goog.events;

  function $(id){
    // Function: $(id): Element
    // An alias for document.getElementById(id).
    //
    // Parameter:
    //   id - string, the identifier of an HTML element
    //
    // Returns:
    //   Element, the DOM element with given id, if present in the document,
    //   null otherwise
    //
    // Note:
    // "Behavior is not defined if more than one element has this ID"
    //
    // DOM Level 2 Core
    // <http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-getElBId>

    //
    return dom.$(id);
  }

  function element(name,attributes){
    // Function: element(name[,attributes[,childNodes]]): Element
    // Create a new element with given name, attributes and child nodes.
    //
    // Parameters:
    //   name - string, the name of the element, e.g. 'div'
    //   attributes - object, the set of attributes, 
    //                e.g. {id:'myDiv', 'class':'big box'}
    //   childNodes - array or list, the list of child nodes.
    //                The child nodes may be provided as an array,
    //                or as a list of arguments (after name and attributes).
    //
    // Returns:
    //   Element, the newly created DOM element

    //
    return dom.$dom.apply(dom,arguments);
  }

  function getClasses(element){
    // Function: getClasses(element): object
    // Get a hash of classes found on given DOM element.
    //
    // Parameters:
    //   element - Element, a DOM element node
    //             (with or without a class atribute)
    //
    // Returns:
    //   object, a hash object with properties named after the classes found,
    //   e.g. {'big':true, 'box':true} for <div class='big box'></div>.
    //   When no class attribute is present, or when it is empty, an empty
    //   object is returned.

    // Warning: argument element hides element() function.
    var hash, array, i;

    hash = {};
    array = classes.get(element);
    for (i=0; i<array.length; i++){
      hash[ array[i] ] = true;
    }
    return hash;
  }

  function addClass(element,name){
    // Function: addClass(element, name)
    // Append a CSS class to the className of a DOM element.
    //
    // Parameters:
    //   element - Element, a DOM element (with or without a class attribute)
    //   name - string, the name of a new CSS class to append to existing ones
    //
    // Note:
    //   Nothing happens in case a class with the same name is already present.

    // Warning: argument element hides element() function.
    classes.add(element,name);
  }

  function removeClass(element,name){
    // Function: removeClass(element, name)
    // Remove a CSS class from the className of a DOM element.
    //
    // Parameters:
    //   element - Element, a DOM element (with or without a class attribute)
    //   name - string, the name of a CSS class to remove from existing ones
    //
    // Note:
    //   Nothing happens in case no class with this name is present.

    // Warning: argument element hides element() function.
    classes.remove(element,name);
  }

  function addListener(element, type, listener, useCapture){
    // Function: addListener(element, type, listener[, useCapture])
    // Register a new listener for a type of event on a DOM element.
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
    //   http://www.w3.org/TR/DOM-Level-2-Events/events.html
    //                     #Events-EventTarget-addEventListener

    // Warning: argument element hides element() function.
    events.listen(element, type, listener, useCapture);
  }

  function removeListener(element, type, listener, useCapture){
    // Function: removeListener(element, type, listener[, useCapture])
    // Unregister a listener for a type of event on a DOM element.
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
    //   http://www.w3.org/TR/DOM-Level-2-Events/events.html
    //                     #Events-EventTarget-addEventListener

    // Warning: argument element hides element() function.
    events.unlisten(element, type, listener, useCapture);
  }

  return { // public API
    $:$,
    element: element,
    getClasses: getClasses,
    addClass: addClass,
    removeClass: removeClass,
    addListener: addListener,
    removeListener: removeListener
  };
}());
