/*
 * Namespace: lb.core.Sandbox
 * Sandbox for Modules of Legal Box Scalable JavaScript Application
 *
 * A new instance of Sandbox gets attributed to each instance of Module. It
 * acts both as a proxy and a facade to the application core, restricting
 * modifications to the box assigned to the module, an HTML element which
 * encloses the module.
 *
 * The methods related to the module itself are defined on the Sandbox. Other
 * methods are defined by separate plugin modules.
 *
 * Module (sandbox):
 *   - <sandbox.getId([localId]):string>
 *   - <sandbox.getBox(createIfMissing): DOM Element>
 *   - <sandbox.isInBox(element): boolean>
 *
 * Cascading Style Sheets (sandbox.css, defined by <lb.core.plugins.css>):
 *   - <lb.core.plugins.css.sandbox.css.getClasses(element): object>
 *   - <lb.core.plugins.css.sandbox.css.addClass(element,name)>
 *   - <lb.core.plugins.css.sandbox.css.removeClass(element,name)>
 *
 * Document Object Model (sandbox.dom, defined by <lb.core.plugins.dom>):
 *   - <lb.core.plugins.dom.sandbox.dom.$(localId): DOM Element>
 *   - <lb.core.plugins.dom.sandbox.dom.element(name[,attributes[,childNodes]]): DOM Element>
 *   - <lb.core.plugins.dom.sandbox.dom.fireEvent(element,type[,properties]): DOM Event>
 *   - <lb.core.plugins.dom.sandbox.dom.cancelEvent(event)>
 *   - <lb.core.plugins.dom.sandbox.dom.getListeners(): array>
 *   - <lb.core.plugins.dom.sandbox.dom.addListener(element,type,callback): Listener>
 *   - <lb.core.plugins.dom.sandbox.dom.removeListener(listener)>
 *   - <lb.core.plugins.dom.sandbox.dom.removeAllListeners()>
 *
 * Events for loose coupling with other modules (sandbox.events, defined by <lb.core.plugins.events>):
 *   - <lb.core.plugins.events.sandbox.events.subscribe(filter,callback)>
 *   - <lb.core.plugins.events.sandbox.events.unsubscribe(filter)>
 *   - <lb.core.plugins.events.sandbox.events.publish(event)>
 *
 * Internationalization through language properties (sandbox.i18n, defined by <lb.core.plugins.i18n>):
 *   - <lb.core.plugins.i18n.sandbox.i18n.getLanguageList(): array of strings>
 *   - <lb.core.plugins.i18n.sandbox.i18n.getSelectedLanguage(): string>
 *   - <lb.core.plugins.i18n.sandbox.i18n.selectLanguage(languageCode)>
 *   - <lb.core.plugins.i18n.sandbox.i18n.addLanguageProperties(languageCode,languageProperties)>
 *   - <lb.core.plugins.i18n.sandbox.i18n.get(key[,languageCode]): any>
 *   - <lb.core.plugins.i18n.sandbox.i18n.getString(key[,data[,languageCode]]): string>
 *   - <lb.core.plugins.i18n.sandbox.i18n.filterHtml(htmlNode[,data[,languageCode]])>
 *
 * Asynchronous communication with a remote server (sandbox.server, defined by <lb.core.plugins.server>):
 *   - <lb.core.plugins.server.sandbox.server.send(url,data,receive)>
 *
 * Uniform Resource Locator, local navigation (sandbox.url, defined by <lb.core.plugins.url>):
 *   - <lb.core.plugins.url.sandbox.url.getLocation(): object>
 *   - <lb.core.plugins.url.sandbox.url.setHash(hash)>
 *   - <lb.core.plugins.url.sandbox.url.onHashChange(callback)>
 *
 * General utilities (sandbox.utils):
 *   - <lb.core.plugins.utils.sandbox.utils.has(object,property[,...]): boolean>
 *   - <lb.core.plugins.utils.sandbox.utils.is([...,]value[,type]): boolean>
 *   - <lb.core.plugins.utils.sandbox.utils.getTimestamp(): number>
 *   - <lb.core.plugins.utils.sandbox.utils.setTimeout(callback,delay): number>
 *   - <lb.core.plugins.utils.sandbox.utils.clearTimeout(timeoutId)>
 *   - <lb.core.plugins.utils.sandbox.utils.trim(string): string>
 *   - <lb.core.plugins.utils.sandbox.utils.log(message)>
 *   - <lb.core.plugins.utils.sandbox.utils.confirm(message): boolean>
 *
 * The plugins are loaded by the Sandbox Builder. The sandbox API can be
 * customized by configuring a different sandbox builder to load additional or
 * alternative plugins. See <lb.core.plugins.builder> for details.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-04-26
 */
/*requires lb.core.js */
/*jslint white:false, plusplus:false */
/*global lb, document, window */
lb.core.Sandbox = function (id){
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
      /*requires lb.base.type.js */
  var is = lb.base.type.is,
      /*requires lb.base.object.js */
      has = lb.base.object.has,
      /*requires lb.base.config.js */
      config = lb.base.config,
      /*requires lb.base.dom.factory.js */
      defaultFactory = lb.base.dom.factory,
      /*requires lb.base.dom.js */
      dom = lb.base.dom,
      /*requires lb.base.string.js */
      trim = lb.base.string.trim,
      /*requires lb.base.log.js */
      log = lb.base.log.print,
      /*requires lb.base.history.js */
      history = lb.base.history,
      setHash = history.setHash,

  // Private fields

    // DOM element, the root of the box, carrying the module identifier.
    // Used only in getBox(), to avoid multiple lookups of the same element.
    // Initialized on first call to getBox().
    box = null,

    // function, the current listener set to onHashChange(), which will get
    // replaced in a new call to onHashChange().
    hashChangeCallback = null;

  function getId(localId){
    // Function: sandbox.getId([localId]): string
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

    if ( has(localId) ) {
      return id+'.'+localId;
    } else {
      return id;
    }
  }

  function getBox(createIfMissing){
    // Function: sandbox.getBox(createIfMissing): DOM Element
    // Get the root HTML element for this module.
    //
    // Parameter:
    //   createIfMissing - boolean, optional, defaults to true,
    //                     Whether to create the box element if it is not found
    //                     in the document.
    // Note:
    //   In case createIfMissing is true (by default) and no HTML element is
    //   found in the document with the module id, a new div element is created
    //   with this id and inserted last in the document body.
    //
    // Returns:
    //   * DOM Element, the HTML element corresponding to the module id,
    //   * or null, in case createIfMissing is false and the element is missing
    createIfMissing = has(createIfMissing)? createIfMissing : true;

    var factory;

    if ( has(box) ) {
      return box;
    }
    box = dom.$(id);
    if ( !has(box) && createIfMissing){
      log('Warning: no element "'+id+
          '" found in box. Will be created at end of body.');
      factory = config.getOption('lbFactory', defaultFactory);
      box = factory.createElement('div',{'id': id});
      document.body.appendChild(box);
    }
    return box;
  }

  function isInBox(element){
    // Function: sandbox.isInBox(element): boolean
    // Check whether the given element is in the box.
    //
    // Parameter:
    //   element - DOM Element, an element
    //
    // Returns:
    //   * true if the element is a descendant of or the root of the box itself
    //   * false otherwise

    // Note:
    // if optimization or reuse is needed, isInBox() could rely on a new method
    // to add to base DOM API: contains(ancestorElement,descendantElement)
    // (available as goog.dom.contains(parent,descendant) in Closure library)

    var ancestor = element;
    while ( has(ancestor) ) {
      // TODO: return false when a document node is reached without passing by
      //       the root of the box

      // TODO: allow document-fragment or null as last ancestor
      //       for nodes not/no longer part of the DOM

      // box must be found in ancestors or self
      if ( ancestor === getBox(false) ) {
        return true;
      }
      ancestor = ancestor.parentNode;
    }
    return false;
  }

  function getLocation(){
    // Function: sandbox.url.getLocation(): object
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

  // Function: sandbox.url.setHash(hash)
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
    // Function: sandbox.url.onHashChange(callback)
    // Set a listener to observe changes in local part of the URL.
    // Calling this method with a new callback will replace the listener
    // previously set. Calling onHashChange(null) will remove the current
    // listener altogether.
    //
    // Parameter:
    //   callback - function, the callback(hash) function will be called once
    //              for each subsequent change of hash. The hash parameter is a
    //              string, decoded, starting with the '#' character.

    if ( has(hashChangeCallback) ){
      history.removeListener(hashChangeCallback);
    }
    hashChangeCallback = callback;
    if ( has(callback) ){
      history.addListener(callback);
    }
  }

  // Function: sandbox.utils.has(object,property[,...]): boolean
  // Check whether an object property is present and not null nor undefined.
  //
  // A chain of nested properties may be checked by providing more than two
  // arguments.
  //
  // The intent of this method is to replace unsafe tests relying on type
  // coercion for optional arguments or object properties:
  // | function on(event,options){
  // |   options = options || {}; // type coercion
  // |   if (!event || !event.data || !event.data.value){
  // |     // unsafe due to type coercion: all falsy values '', false, 0
  // |     // are discarded, not just null and undefined
  // |     return;
  // |   }
  // |   // ...
  // | }
  // with a safer test without type coercion:
  // | function on(event,options){
  // |   options = has(options)? options : {}; // no type coercion
  // |   if (!has(event,'data','value'){
  // |     // safe check: only null/undefined values are rejected;
  // |     return;
  // |   }
  // |   // ...
  // | }
  //
  // Parameters:
  //   object - any, an object or any other value
  //   property - string, the name of the property to look up
  //   ...      - string, additional property names to check in turn
  //
  // Returns:
  //   * false if no argument is provided or if the object is null or
  //     undefined, whatever the number of arguments
  //   * true if the full chain of nested properties is found in the object
  //     and the corresponding value is neither null nor undefined
  //   * false otherwise

  // Note: is is an alias for lb.base.object.has

  // Function: sandbox.utils.is([...,]value[,type]): boolean
  // Check the type of a value, possibly nested in sub-properties.
  //
  // The method may be called with a single argument to check that the value
  // is neither null nor undefined.
  //
  // If more than two arguments are provided, the value is considered to be
  // nested within a chain of properties starting with the first argument:
  // | is(object,'parent','child','leaf','boolean')
  // will check whether the property object.parent.child.leaf exists and is
  // a boolean.
  //
  // The intent of this method is to replace unsafe guard conditions that
  // rely on type coercion:
  // | if (object && object.parent && object.parent.child) {
  // |   // Issue: all falsy values are treated like null and undefined:
  // |   // '', 0, false...
  // | }
  // with a safer check in a single call:
  // | if ( is(object,'parent','child','number') ) {
  // |   // only null and undefined values are rejected
  // |   // and the type expected (here 'number') is explicit
  // | }
  //
  // Parameters:
  //   ...   - any, optional, a chain of parent properties for a nested value
  //   value - any, the value to check, which may be nested in a chain made
  //           of previous arguments (see above)
  //   type - string, optional, the type expected for the value.
  //          Alternatively, a constructor function may be provided to check
  //          whether the value is an instance of given constructor.
  //
  // Returns:
  //   * false, if no argument is provided
  //   * false, if a single argument is provided which is null or undefined
  //   * true, if a single argument is provided, which is not null/undefined
  //   * if the type argument is a non-empty string, it is compared with the
  //     internal class of the value, put in lower case
  //   * if the type argument is a function, the instanceof operator is used
  //     to check if the value is considered an instance of the function
  //   * otherwise, the value is compared with the provided type using the
  //     strict equality operator ===
  //
  // Type Reference:
  //   'undefined' - undefined
  //   'null'      - null
  //   'boolean'   - false, true
  //   'number'    - -1, 0, 1, 2, 3, Math.sqrt(2), Math.E, Math.PI...
  //   'string'    - '', 'abc', "Text!?"...
  //   'array'     - [], [1,2,3], ['a',{},3]...
  //   'object'    - {}, {question:'?',answer:42}, {a:{b:{c:3}}}...
  //   'regexp'    - /abc/g, /[0-9a-z]+/i...
  //   'function'  - function(){}, Date, setTimeout...
  //
  // Notes:
  // This method retrieves the internal class of the provided value using
  // | Object.prototype.toString.call(value).slice(8, -1)
  // The class is then converted to lower case.
  //
  // See "The Class of an Object" section in the JavaScript Garden for
  // more details on the internal class:
  // http://bonsaiden.github.com/JavaScript-Garden/#types.typeof
  //
  // The internal class is only guaranteed to be the same in all browsers for
  // Core JavaScript classes defined in ECMAScript. It differs for classes
  // part of the Browser Object Model (BOM) and Document Object Model (DOM):
  // window, document, DOM nodes:
  //
  //   window        - 'Object' (IE), 'Window' (Firefox,Opera),
  //                   'global' (Chrome), 'DOMWindow' (Safari)
  //   document      - 'Object' (IE),
  //                   'HTMLDocument' (Firefox,Chrome,Safari,Opera)
  //   document.body - 'Object' (IE),
  //                   'HTMLBodyElement' (Firefox,Chrome,Safari,Opera)
  //   document.createElement('div') - 'Object' (IE)
  //                   'HTMLDivElement' (Firefox,Chrome,Safari,Opera)
  //   document.createComment('') - 'Object' (IE),
  //                   'Comment' (Firefox,Chrome,Safari,Opera)

  // Note: is is an alias for lb.base.type.is

  function getTimestamp(){
    // Function: sandbox.utils.getTimestamp(): number
    // Get current timestamp, in milliseconds.
    //
    // Returns:
    //   number, the number of milliseconds ellapsed since the epoch
    //   (January 1st, 1970 at 00:00:00.000 UTC).

    return (new Date()).getTime();
  }

  function setTimeout(callback, delay){
    // Function: sandbox.utils.setTimeout(callback,delay): number
    // Plan the delayed execution of a callback function.
    //
    // Parameters:
    //   callback - function, the function to run after a delay
    //   delay - integer, the delay in milliseconds
    //
    // Returns:
    //   number, the timeout identifier to be passed to utils.clearTimeout()
    //   to cancel the planned execution.

    return window.setTimeout(function(){
      try {
        callback();
      } catch(e){
        log('ERROR: failure in setTimeout for callback '+callback+'.');
      }
    },delay);
  }

  function clearTimeout(timeoutId){
    // Function: sandbox.utils.clearTimeout(timeoutId)
    // Cancels the planned execution of a callback function.
    //
    // Parameter:
    //   timeoutId - number, the identifier returned by the call to
    //               utils.clearTimeou() to cancel.

    window.clearTimeout(timeoutId);
  }

  // Function: sandbox.utils.trim(string): string
  // Remove leading and trailing whitespace from a string.
  //
  // Parameter:
  //   string - string, the string to trim
  //
  // Returns:
  //   string, a copy of the string with no whitespace at start and end

  // Note: trim is an alias for lb.base.string.trim

  // Function: sandbox.utils.log(message)
  // Log a message.
  //
  // Log messages will be printed in the browser console, when available,
  // and if the log output has been activated, which happens when Debug=true
  // is included anywhere in the URL.
  //
  // Parameter:
  //   message - string, the message to log

  // Note: log is an alias for lb.base.log.print

  function confirm(message){
    // Function: sandbox.utils.confirm(message): boolean
    // Open a confirmation (OK/Cancel) dialog.
    //
    // Parameter:
    //   message - string, the confirmation message
    //
    // Returns:
    //   boolean, true if user clicked OK, false is she clicked Cancel button.

    return window.confirm(message);
  }

  // Public methods
  this.getId = getId;
  this.getBox = getBox;
  this.isInBox = isInBox;
  this.url = {
    getLocation: getLocation,
    setHash: setHash,
    onHashChange: onHashChange
  };
  this.utils = {
    has: has,
    is: is,
    getTimestamp: getTimestamp,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    trim: trim,
    log: log,
    confirm: confirm
  };
};
