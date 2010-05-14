/*
 * Namespace: lb.core.Sandbox
 * Sandbox for Modules of Legal Box Web Application
 *
 * A new instance of Sandbox gets attributed to each User Interface Module
 * and Data Model Module. It acts as a proxy to the methods of the Application
 * Core.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-14
 */
/*requires lb.base.ajax.js */
/*requires lb.base.dom.js */
/*requires lb.base.string.js */
/*requires lb.base.log.js */
/*requires lb.core.js */
/*requires lb.core.application.js */
/*requires lb.core.events.publisher.js */
/*requires lb.core.events.Subscriber.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, document, window */
// preserve the module, if already loaded
lb.core.Sandbox = lb.core.Sandbox || function (id){
  // Function: new Sandbox(id): Sandbox
  // Constructor of a new Sandbox.
  //
  // Parameters:
  //   id - string, the identifier of the module, which is also the id of the 
  //        root HTML element for this module. If the element does not exist in
  //        the document, it will get created on the first call to getBox().
  //
  // Returns:
  //   object, the new instance of lb.core.Sandbox

  // Define aliases
  var ajax = lb.base.ajax,
      dom = lb.base.dom,
      gTrim = lb.base.string.trim,
      log = lb.base.log.print,
      getElementFactory = lb.core.application.getElementFactory,
      publisher = lb.core.events.publisher,
      Subscriber = lb.core.events.Subscriber,

  // Private fields

  // DOM element, the root of the box, carrying the module identifier.
  // Used only withing getBox(), to avoid multiple lookups of the same element.
  // Initialized on first call to getBox().
      box,

  // array, the set of Subscribers created for this module. Kept locally for
  // use in unsubscribe.
      subscribers = [];

  function getId(localId){
    // Function: getId([localId]): string
    // Get the identifier of the module, when optional parameter is omitted.
    // With optional parameter, get the full identifier corresponding to the
    // given local identifier.
    //
    // Parameter:
    //  localId - string, optional local identifier
    //
    // Returns:
    //   string, the identifier of the module, as provided in constructor,
    //   or the full identifier corresponding to given local identifier.
    //
    // Note:
    //   The full identifier is made of the module identifier, followed by the
    //   separator '.', followed by the local identifier.

    if (localId) {
      return id+'.'+localId;
    } else {
      return id;
    }
  }

  function getBox(){
    // Function: getBox(): DOM element
    // Get the root HTML element for this module.
    //
    // Returns:
    //   DOM element, the HTML element corresponding to the module id
    //
    // Note:
    //   In case no HTML element is found in the document with the module id,
    //   a new div element is created with this id and inserted last in the
    //   document body, and this new element is returned.

    if (box) {
      return box;
    }
    box = dom.$(id);
    if (!box){
      log('Warning: no element "'+id+
          '" found in box. Will be created at end of body.');
      box = dom.element('div',{'id': id});
      document.body.appendChild(box);
    }
    return box;
  }

  function isInBox(element){
    // Function: isInBox(element): boolean
    // Check whether the given element is in the box.
    //
    // Parameter:
    //   element - DOM element, an element
    //
    // Returns:
    //   true if the element is a descendant of or the root of the box itself
    //   false otherwise

    // Warning: element attribute hides element() function.

    var ancestor = element;
    while (ancestor) {
      // box must be found in ancestors or self
      if ( ancestor === getBox() ) {
        return true;
      }
      ancestor = ancestor.parentNode;
    }
    return false;
  }

  function subscribe(filter,callback){
    // Function: subscribe(filter,callback)
    // Create a new event subscription, triggering the callback only for events
    // matching the provided filter.
    //
    // A new instance of Event Subscriber (lb.core.events.Subscriber) is
    // created and added to the Event publisher (lb.core.events.publisher).
    //
    // Parameters:
    //   filter - object, the event filter.
    //           This object is similar to event objects. Any included property
    //           will be used as a filter to restrict events part of the 
    //           subscription. For example:
    //           * {} is a subscription to all events (no filter)
    //           * {name: 'foo'} is a subscription to all events named 'foo'
    //           * {name: 'foo', id:42} filters on name==='foo' and id===42
    //   callback - function, the associated callback function

    //
    var subscriber = new Subscriber(filter,callback);
    subscribers.push(subscriber);
    publisher.addSubscriber(subscriber);
  }

  function unsubscribe(filter){
    // Function: unsubscribe(filter)
    // Remove all subscriptions for given filter.
    //
    // Parameter:
    //   filter - object, an event filter.
    //
    // Note:
    //   It is not necessary to provide the identical filter project provided
    //   in subscribe(); all filters with the same set of properties/values
    //   will get the corresponding subscriptions removed.
    var i, subscriber;

    for (i=0; i<subscribers.length; i++){
      subscriber = subscribers[i];
      // check for equality as mutual inclusion
      if ( subscriber.includes( filter, subscriber.getFilter() ) &&
           subscriber.includes( subscriber.getFilter(), filter ) ) {
        publisher.removeSubscriber(subscriber);
        subscribers.splice(i,1);
        i--; // index for next item decreased
      }
    }
  }

  function publish(event){
    // Function: publish(event)
    // Publish a new event for broadcasting to all interested subscribers.
    //
    // Parameter:
    //   event - object, the event to publish. It shall be a valid JSON [1] 
    //           object: no methods, no circular references.
    //
    // Reference:
    // [1] Introducing JSON (JavaScript Object Notation)
    // http://www.json.org/

    //
    publisher.publish(event);
  }

  function send(url, data, receive){
    // Function: send(url, data, receive)
    // Send and receive data from the remote host.
    //
    // Parameters:
    //   url - string, a url on remote host (must respect same origin policy)
    //   data - object, the data to send to the server. It must be valid JSON.
    //   receive - function, the callback with data received in response from/
    //             the server. The data provided in argument will be a valid
    //             JSON object or array.

    //
    ajax.send(url, data, receive);
  }

  function setTimeout(callback, delay){
    // Function: setTimeout(callback, delay)
    // Plan the delayed execution of a callback function.
    //
    // Parameters:
    //   callback - function, the function to run after a delay
    //   delay - integer, the delay in milliseconds

    //
    window.setTimeout(function(){
      try {
        callback();
      } catch(e){
        log('ERROR: failure in setTimeout for callback '+callback+'.');
      }
    },delay);
  }

  function trim(string){
    // Function: trim(string): string
    // Remove leading and trailing whitespace from a string.
    //
    // Parameter:
    //   string - string, the string to trim
    //
    // Returns:
    //   string, a copy of the string with no whitespace at start and end

    //
    return gTrim(string);
  }

  function $(localId){
    // Function: $(localId): DOM element
    // Get the element of the box with given local identifier.
    //
    // Parameter:
    //   localId - string, the local identifier of the element, without prefix.
    //             See getId() for details.
    //
    // Returns:
    //   * DOM element, the element from the box with corresponding localId
    //   * null if no element is found in the box with the localId
    //
    // Notes:
    //   This method calls getBox() internally to check that a found element
    //   is a descendant of the box element. This may create the box element
    //   if not already present in the document.
    //
    //   Since the provided localId is converted to a full identifier using
    //   getId(), a call to $() without argument will return the root element
    //   of the box, in the same way as getBox().

    //
    var element = dom.$( getId(localId) );
    if ( isInBox(element) ){
      return element;
    }
    log('Warning: element "'+getId(localId)+'" not part of box "'+id+'"');
    return null;
  }

  function element(name,attributes){
    // Function: element(name[,attributes[,childNodes]]): DOM element
    // Create a new DOM element using the configured element factory.
    // For example, using the default element factory,
    // |  element('a',{href:'#here',title:'Here'},'Click here')
    // will create a new DOM element
    // |  <a href='#here' title='Here'>Click here</a>
    //
    // A custom element factory can be configured using
    // <lb.core.application.setElementFactory(factory)>.
    //
    // Parameters:
    //   name - string, the name of the element
    //   attributes - object, optional arguments as a set of named properties
    //   childNodes - array or list of arguments, the optional child nodes.
    //                Text nodes may be represented simply as strings.
    //
    // Returns:
    //   DOM element, the newly created DOM element

    return getElementFactory().create.apply(this,arguments);
  }

  function getClasses(element){
    // Function: getClasses(element): object
    // Get the CSS classes of given DOM element.
    //
    // Parameter:
    //   element - DOM element, an element of the box
    //
    // Returns:
    //   object, a hash of CSS classes, with a boolean property set to true
    //   for each of the CSS class names found on element.
    //
    // Note:
    //   an empty object is returned when the element is out of the box.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot get CSS classes of element "'+element+
          '" outside of box "'+id+'"');
      return {};
    }

    return dom.getClasses(element);
  }

  function addClass(element,name){
    // Function: addClass(element,name)
    // Append a CSS class to a DOM element part of the box.
    //
    // Parameters:
    //   element - DOM element, an element of the box
    //   name - string, a CSS class name
    //
    // Note:
    //   Nothing happens if element is out of the box.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot add CSS class to element "'+element+
          '" outside of box "'+id+'"');
      return;
    }

    dom.addClass(element,name);
  }

  function removeClass(element,name){
    // Function: removeClass(element,name)
    // Remove a CSS class from a DOM element part of the box.
    //
    // Parameters:
    //   element - DOM element, an element of the box
    //   name - string, a CSS class name
    //
    // Note:
    //   Nothing happens if element is out of the box.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot remove CSS class from element "'+element+
          '" outside of box "'+id+'"');
      return;
    }

    dom.removeClass(element,name);
  }

  function addListener(element,type,listener){
    // Function: addListener(element, type, listener)
    // Register a new listener for a type of event on a DOM element of the box.
    //
    // Parameters:
    //   element - Element, a DOM element
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   listener - function, a function to call when the event is dispatched.
    //
    // Notes:
    //   The listener is set on bubbling phase.
    //   Nothing happens when element is out of the box.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot add listener to element "'+element+
          '" outside of box "'+id+'"');
      return;
    }

    dom.addListener(element,type,listener);
  }

  function removeListener(element,type,listener,useCapture){
    // Function: removeListener(element, type, listener[, useCapture])
    // Unregister a listener for a type of event on a DOM element of the box.
    //
    // Parameters:
    //   element - Element, a DOM element
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   listener - function, a function to call when the event is dispatched.
    //   useCapture - boolean, whether the callback is set for capture phase.
    //                Optional: defaults to false.
    //
    // Note:
    //   Nothing happens when element is out of the box.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot remove listener from element "'+element+
          '" outside of box "'+id+'"');
      return;
    }

    dom.removeListener(element,type,listener,useCapture);
  }

  return { // Public methods
    getId: getId,
    getBox: getBox,
    isInBox: isInBox,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish,
    send: send,
    setTimeout: setTimeout,
    trim: trim,
    $: $,
    element: element,
    getClasses: getClasses,
    addClass: addClass,
    removeClass: removeClass,
    addListener: addListener,
    removeListener: removeListener
  };
};
