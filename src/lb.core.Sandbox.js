/*
 * Namespace: lb.core.Sandbox
 * Sandbox for Modules of Legal Box Scalable JavaScript Application
 *
 * A new instance of Sandbox gets attributed to each User Interface Module
 * and Data Model Module. It acts both as a proxy and a facade to the
 * application core.
 *
 * The methods related to the module itself, are defined on the Sandbox.
 * Other methods are separated into groups of similar purpose.
 *
 * Module (sandbox):
 *   - <getId([localId]):string>
 *   - <getBox(): DOM Element>
 *   - <isInBox(element): boolean>
 *
 * Cascading Style Sheets (sandbox.css):
 *   - <css.getClasses(element): object>
 *   - <css.addClass(element,name)>
 *   - <css.removeClass(element,name)>
 *
 * Document Object Model (sandbox.dom):
 *   - <dom.$(localId): DOM Element>
 *   - <dom.element(name[,attributes[,childNodes]]): DOM Element>
 *   - <dom.fireEvent(element,type[,properties]): DOM Event>
 *   - <dom.cancelEvent(event)>
 *   - <dom.getListeners(): array>
 *   - <dom.addListener(element,type,callback): Listener>
 *   - <dom.removeListener(listener)>
 *   - <dom.removeAllListeners()>
 *
 * Events for loose coupling with other modules (sandbox.events):
 *   - <events.subscribe(filter,callback)>
 *   - <events.unsubscribe(filter)>
 *   - <events.publish(event)>
 *
 * Asynchronous communication with a remote server (sandbox.server):
 *   - <server.send(url,data,receive)>
 *
 * Uniform Resource Locator, local navigation (sandbox.url):
 *   - <url.getLocation(): object>
 *   - <url.setHash(hash)>
 *   - <url.onHashChange(callback)>
 *
 * General utilities (sandbox.utils):
 *   - <utils.setTimeout(callback,delay)>
 *   - <utils.trim(string): string>
 *   - <utils.log(message)>
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
/*requires lb.core.js */
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
  //   object, the new instance of Sandbox

  // Define aliases
      /*requires lb.base.array.js */
  var addOne = lb.base.array.addOne,
      removeOne = lb.base.array.removeOne,
      removeAll = lb.base.array.removeAll,
      /*requires lb.base.dom.js */
      dom = lb.base.dom,
      /*requires lb.base.dom.css.js */
      css = lb.base.dom.css,
      /*requires lb.base.dom.Listener.js */
      Listener = lb.base.dom.Listener,
      /*requires lb.base.ajax.js */
      send = lb.base.ajax.send,
      /*requires lb.base.string.js */
      trim = lb.base.string.trim,
      /*requires lb.base.log.js */
      log = lb.base.log.print,
      /*requires lb.base.history.js */
      history = lb.base.history,
      setHash = history.setHash,
      /*requires lb.base.config.js */
      config = lb.base.config,
      /*requires lb.core.events.publisher.js */
      publisher = lb.core.events.publisher,
      /*requires lb.core.events.Subscriber.js */
      Subscriber = lb.core.events.Subscriber,

  // Private fields

    // object, the factory used to create DOM elements, listeners and events.
    // A custom factory can be configured by setting the property lbFactory.
    // Defaults to lb.base.dom.factory.
    /*requires lb.base.dom.factory.js */
    factory = config.getOption('lbFactory', lb.base.dom.factory),

    // DOM element, the root of the box, carrying the module identifier.
    // Used only in getBox(), to avoid multiple lookups of the same element.
    // Initialized on first call to getBox().
    box,

    // array, the set of Subscribers created for this module.
    // Kept locally for use in unsubscribe().
    subscribers = [],

    // array, the set of listeners created by this module
    // Kept for removeAllListeners().
    listeners = [],

    // function, the current listener set to onHashChange(), which will get
    // replaced in a new call to onHashChange().
    hashChangeCallback = null;

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
    // Function: getBox(): DOM Element
    // Get the root HTML element for this module.
    //
    // Returns:
    //   DOM Element, the HTML element corresponding to the module id
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
      box = factory.createElement('div',{'id': id});
      document.body.appendChild(box);
    }
    return box;
  }

  function isInBox(element){
    // Function: isInBox(element): boolean
    // Check whether the given element is in the box.
    //
    // Parameter:
    //   element - DOM Element, an element
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

  function getClasses(element){
    // Function: css.getClasses(element): object
    // Get the CSS classes of given DOM element.
    //
    // Parameter:
    //   element - DOM Element, an element of the box
    //
    // Returns:
    //   object, a hash of CSS classes, with a boolean property set to true
    //   for each of the CSS class names found on element, e.g.
    //   | {'big':true, 'box':true}
    //   for
    //   | <div class='big box'></div>.
    //   When no class attribute is present, or when it is empty, an empty
    //   object is returned.
    //
    // Note:
    // When the element is out of the box, an empty object is returned as well.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot get CSS classes of element "'+element+
          '" outside of box "'+id+'"');
      return {};
    }

    return css.getClasses(element);
  }

  function addClass(element,name){
    // Function: css.addClass(element,name)
    // Append a CSS class to a DOM element part of the box.
    //
    // Parameters:
    //   element - DOM Element, an element of the box
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

    css.addClass(element,name);
  }

  function removeClass(element,name){
    // Function: css.removeClass(element,name)
    // Remove a CSS class from a DOM element part of the box.
    //
    // Parameters:
    //   element - DOM Element, an element of the box
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

    css.removeClass(element,name);
  }

  function $(localId){
    // Function: dom.$(localId): DOM Element
    // Get the element of the box with given local identifier.
    //
    // Parameter:
    //   localId - string, the local identifier of the element, without prefix.
    //             See getId() for details.
    //
    // Returns:
    //   * DOM Element, the element from the box with corresponding localId
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

    var element = dom.$( getId(localId) );
    if ( isInBox(element) ){
      return element;
    }
    log('Warning: element "'+getId(localId)+'" not part of box "'+id+'"');
    return null;
  }

  function element(name,attributes){
    // Function: dom.element(name[,attributes[,childNodes]]): DOM Element
    // Create a new DOM element using the configured element factory.
    // For example, using the default element factory,
    // |  element('a',{href:'#here',title:'Here'},'Click here')
    // will create a new DOM element
    // |  <a href='#here' title='Here'>Click here</a>
    //
    // A custom element factory can be configured using the property lbFactory
    // with <lb.core.application.setOptions(options)>.
    //
    // Parameters:
    //   name - string, the name of the element
    //   attributes - object, optional arguments as a set of named properties
    //   childNodes - array or list of arguments, the optional child nodes.
    //                Text nodes shall be represented simply as strings.
    //
    // Returns:
    //   DOM Element, the newly created DOM element.

    return factory.createElement.apply(factory,arguments);
  }

  function fireEvent(element, type, properties){
    // Function: dom.fireEvent(element,type[,properties]): DOM Event
    // Create and dispatch a new DOM event to the given element.
    //
    // Parameters:
    //   element - DOM Element, an element of the box
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   properties - object, optional event properties. Each property will be
    //                copied to the new DOM event.
    //
    // Returns:
    //   DOM Event, the new DOM event

    // Warning: element parameter hides element() function
    return factory.createEvent(element, type, properties);
  }

  function cancelEvent(event){
    // Function: dom.cancelEvent(event)
    // Cancel an event: prevent the default action and stop bubbling.
    //
    // Parameter:
    //   event - DOM Event

    factory.destroyEvent(event);
  }

  function getListeners(){
    // Function: dom.getListeners(): array
    // Get the list of listeners configured on DOM elements of the box.
    // Listeners can be added with addListener() and removed one by one with
    // removeListener(), or all at once with removeAllListeners().
    //
    // Returns:
    //   array, the current list of listener objects (lb.base.dom.Listener)

    return listeners;
  }

  function addListener(element,type,callback){
    // Function: dom.addListener(element,type,callback): Listener
    // Register a new listener for a type of event on a DOM element of the box.
    //
    // Parameters:
    //   element - DOM Element, an element of the box
    //   type - string, the name of an event (without 'on') e.g. 'click'
    //   callback - function, a function to call when the event is dispatched.
    //
    // Returns:
    //   * null, when the element is outside the box (no listener added),
    //   * object, the new listener otherwise.
    //     This object shall be provided to removeListener() to unregister the
    //     listener. No other interaction is expected with this object.
    //
    // Notes:
    //   The listener is set on bubbling phase.

    // Warning: element parameter hides element() function
    if ( !isInBox(element) ){
      log('Warning: cannot add listener to element "'+element+
          '" outside of box "'+id+'"');
      return null;
    }

    var listener = new Listener(element,type,callback);
    listeners.push(listener);
    return listener;
  }

  function removeListener(listener){
    // Function: dom.removeListener(listener)
    // Unregister a listener.
    //
    // Parameters:
    //   listener - object, a listener instance returned by addListener().
    //
    // Note:
    //   Nothing happens when the listener has already been removed.

    for (var i=0; i<listeners.length; i++){
      if (listeners[i]===listener){
        listener.detach();
        listeners.splice(i,1);
        return;
      }
    }
  }

  function removeAllListeners(){
    // Function: dom.removeAllListeners()
    // Remove all listeners configured on DOM elements of the box.
    //
    // All remaining listeners, previously configured with addListener(),
    // add removed. This method is intended as a cleanup utility ; it is called
    // automatically by the framework after the module terminates in end(),
    // which makes its use optional for the module itself.

    for (var i=0; i<listeners.length; i++){
      listeners[i].detach();
    }
    removeAll(listeners);
  }

  function subscribe(filter,callback){
    // Function: events.subscribe(filter,callback)
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
    //   callback - function, the associated callback(event). The event object
    //              contains at least the same properties as the filter. In
    //              addition, custom properties may be defined by the creator
    //              of the event.

    var subscriber = new Subscriber(filter,callback);
    subscribers.push(subscriber);
    publisher.addSubscriber(subscriber);
  }

  function unsubscribe(filter){
    // Function: events.unsubscribe(filter)
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

  // Function: events.publish(event)
  // Publish a new event for broadcasting to all interested subscribers.
  //
  // Parameter:
  //   event - object, the event to publish. It shall be a valid JSON [1] 
  //           object: no methods, no circular references.
  //
  // Reference:
  // [1] Introducing JSON (JavaScript Object Notation)
  // http://www.json.org/

  // Note: publish is an alias for lb.core.events.publisher.publish

  // Function: server.send(url,data,receive)
  // Send and receive data from the remote host.
  //
  // Parameters:
  //   url - string, a url on remote host (must respect same origin policy)
  //   data - object, the data to send to the server. It must be valid JSON.
  //   receive - function, the callback with data received in response from/
  //             the server. The data provided in argument will be a valid
  //             JSON object or array.

  // Note: send is an alias for lb.base.ajax.send

  function getLocation(){
    // Function: url.getLocation(): object
    // Get the properties of the current URL location
    //
    // Returns:
    //   an object with a copy of properties commonly found on window.location
    //   and document.location:
    //     * href - string, the absolute URL of the current document
    //     * protocol - string, the protocol part of the URL, e.g. 'http://'
    //     * host - string, the host and port part of the url, e.g.
    //              'example.com:8080' or often just 'example.com'
    //     * hostname - the host name part of the URL, e.g. 'example:com'
    //     * port - string, the port part of the URL, e.g. '8080' or often ''
    //     * pathname - string, the relative path, e.g. '/2010/10/31/index.php'
    //     * search - string, the query part of the url, e.g. '?param=value'
    //     * hash - string, the local part of the url, e.g. '#anchor'.
    //   These properties are read-only here and not shared with other modules.
    var location = window.location;
    return {
      href: location.href,
      protocol: location.protocol,
      host: location.host,
      hostname: location.hostname,
      port: location.port,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    };
  }

  // Function: url.setHash(hash)
  // Jump to a new local location by replacing the hash part of the URL.
  //
  // This method is used for local navigation, and ensures, in collaboration
  // with the cross-browser history adapter module, that the back button
  // of the browser works as expected.
  //
  // Parameter:
  //   hash - string, the new local location, e.g. '#local/path'

  // Note: setHash is an alias for lb.base.history.setHash

  function onHashChange(callback){
    // Function: url.onHashChange(callback)
    // Set a listener to observe changes in local part of the URL.
    // Calling this method wit a new callback will replace the listener
    // previously set. You may call it with null to remove the current listener
    // altogether.
    //
    // Parameter:
    //   callback - function, the callback(hash) function will be called once
    //              for each subsequent change of hash. The hash parameter is a
    //              string, decoded, starting with the '#' character.

    if (hashChangeCallback){
      history.removeListener(hashChangeCallback);
    }
    hashChangeCallback = callback;
    if (callback){
      history.addListener(callback);
    }
  }

  function setTimeout(callback, delay){
    // Function: utils.setTimeout(callback,delay)
    // Plan the delayed execution of a callback function.
    //
    // Parameters:
    //   callback - function, the function to run after a delay
    //   delay - integer, the delay in milliseconds

    window.setTimeout(function(){
      try {
        callback();
      } catch(e){
        log('ERROR: failure in setTimeout for callback '+callback+'.');
      }
    },delay);
  }

  // Function: utils.trim(string): string
  // Remove leading and trailing whitespace from a string.
  //
  // Parameter:
  //   string - string, the string to trim
  //
  // Returns:
  //   string, a copy of the string with no whitespace at start and end

  // Note: trim is an alias for lb.base.string.trim

  // Function: utils.log(message)
  // Log a message.
  //
  // Log messages will be printed in the browser console, when available,
  // and if the log output has been activated, which happens when Debug=true
  // is included anywhere in the URL.
  //
  // Parameter:
  //   message - string, the message to log

  // Note: log is an alias for lb.base.log.print

  // Public methods
  this.getId = getId;
  this.getBox = getBox;
  this.isInBox = isInBox;
  this.css = {
    getClasses: getClasses,
    addClass: addClass,
    removeClass: removeClass
  };
  this.dom = {
    $:$,
    element: element,
    fireEvent: fireEvent,
    cancelEvent: cancelEvent,
    getListeners: getListeners,
    addListener: addListener,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners
  };
  this.events = {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publisher.publish
  };
  this.server = {
    send: send
  };
  this.url = {
    getLocation: getLocation,
    setHash: setHash,
    onHashChange: onHashChange
  };
  this.utils = {
    setTimeout: setTimeout,
    trim: trim,
    log: log
  };
};
