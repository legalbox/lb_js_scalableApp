/*
 * Namespace: lb.base.dom.factory
 * DOM (Document Object Model) Factory, Adapter Module for Base Library
 *
 * This module provides the base implementation of a factory to create DOM
 * elements, listeners and events. It is intended to be replaced with a custom
 * factory creating widgets on top of regular DOM elements for the support of
 * Rich Internet Applications.
 *
 * How to design a custom factory:
 * A custom factory is an object with all the methods defined in this module,
 * which can be used as a default implementation in the custom factory methods.
 * The custom factory can be configured on the application core:
 * | lb.core.application.setOptions({ lbFactory: your.customFactory })
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-19
 */
/*requires lb.base.dom.js */
/*requires lb.base.dom.Listener.js */
/*requires lb.base.array.js */
/*requires closure/goog.dom.js */
/*requires closure/goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom.factory = lb.base.dom.factory || (function() {
  // Builder of
  // Closure for lb.base.dom.factory module

  // Declare aliases
  var createDom = goog.dom.createDom,
      removeElement = goog.dom.removeNode,
      fireListeners = goog.events.fireListeners,
      Event = goog.events.Event,
      Listener = lb.base.dom.Listener,
      toArray = lb.base.array.toArray;

  function createElement(name,attributes){
    // Function: createElement(name[,attributes[,childNodes]]): DOM Element
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
    //   DOM Element, the newly created element

    // clone arguments before modifying - avoid changing function arguments
    // http://tech.groups.yahoo.com/group/jslint_com/message/11
    var args = toArray(arguments);

    // convert name to uppercase to ensure cross-browser consistency
    // (IE keeps original case for unknown nodeName/tagName)
    if (args[0] && args[0].toUpperCase){
      args[0] = args[0].toUpperCase();
    }

    return createDom.apply(this,args);
  }

  function destroyElement(element){
    // Function: destroyElement(element)
    // Terminate usage of a DOM element by removing it from its parent.
    //
    // Parameter:
    //   element - DOM element, an element (with or without parent)
    //
    // Note:
    // Nothing happens in case the element has no parent.

    removeElement(element);
  }

  function createListener(element, type, callback, useCapture){
    // Function: createListener(element, type, callback[, useCapture])
    // Create a new listener for a type of event on a DOM element.
    //
    // Parameters:
    //   element - DOM Element, an element
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   callback - function, a function to call when the event is dispatched.
    //   useCapture - boolean, whether the callback is set for capture phase.
    //                Optional: defaults to false. See [1] for details.
    //
    // Returns:
    //   object, a new instance of <lb.base.dom.Listener>
    //
    // Reference:
    //   [1] DOM Level 2 Events: addEventListener
    //   <http://bit.ly/9SQoL4>

    return new Listener(element, type, callback, useCapture);
  }

  function destroyListener(listener){
    // Function: destroyListener(listener)
    // Terminate a listener by removing it from the target DOM element.
    //
    // Parameter:
    //   listener - object, the listener returned by createListener,
    //              instance of <lb.base.dom.Listener>

    listener.detach();
  }

  function createEvent(element, type, properties, useCapture){
    // Function: createEvent(element, type[, properties[, useCapture]])
    // Create a new DOM event and fire it on given target element.
    //
    // Parameters:
    //   element - DOM element, the target element for the event dispatch
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   properties - object, optional properties to set to the new event.
    //   useCapture - boolean, whether the callback is set for capture phase.
    //                Optional: defaults to false. See [1] for details.
    //
    // Returns:
    //   object, the new DOM Event [2] created
    //
    // References:
    //   [1] DOM Level 2 Events: addEventListener
    //   <http://bit.ly/9SQoL4>
    //
    //   [2] DOM Level 2 Events: Event interface
    //   <http://bit.ly/b7KwF5>
    useCapture = useCapture || false;

    // Note: event is actually an instance of goog.events.Event.
    // We may define our own wrapper instead if needed.
    var event = new Event(type);
    for (var name in properties){
      if ( properties.hasOwnProperty(name) ){
        event[name] = properties[name];
      }
    }
    fireListeners(element,type,useCapture,event);
    return event;
  }

  function destroyEvent(event){
    // Function: destroyEvent(event)
    // Terminate a DOM event: prevent default action and stop propagation.
    //
    // Parameter:
    //   event - object, the DOM Event [1]
    //
    // Reference:
    //   [1] DOM Level 2 Events: Event interface
    //   <http://bit.ly/b7KwF5>

    event.stopPropagation();
    event.preventDefault();
  }

  return { // public API
    createElement: createElement,
    destroyElement: destroyElement,
    createListener: createListener,
    destroyListener: destroyListener,
    createEvent: createEvent,
    destroyEvent: destroyEvent
  };
}());
