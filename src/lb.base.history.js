/*
 * Namespace: lb.base.history
 * History (in Local Navigation) Adapter Module for Base Library
 *
 * Use of this module is optional for the Legal Box Scalable Web Application:
 * the module can be omitted or disabled (by setting the configuration property
 * 'lb:history:enabled' to false).
 *
 * This module requires two elements to be present in the initial document,
 * an iframe of id 'lb.base.history.iframe' and a hidden input field of id
 * 'lb.base.history.input'. In case these elements are not found (and the
 * module is enabled), they will be created using document.write, which
 * prevents this module from being loaded dynamically.
 *
 * When the iframe is not present in the document, the configuration property
 * 'lb:history:cheapUrl' must be configured to the relative URL of a resource
 * from the same domain, already loaded to avoid a new query, such as the path
 * to the favicon. The path used by default is '/favicon.ico' which is the most
 * common location for the favicon. In case the favicon is located at a
 * different location, or is unavailable, you must set this property to the
 * url of an existing resource. A missing resource may cause "Access is denied"
 * errors in IE when the page is refreshed and setToken() is called to set a
 * new hash, depending on unidentified conditions: in a test session, the same
 * code produced the error or not on refresh depending on previous tests and
 * the state of the browser cache.
 *
 * The two elements should be hidden. The source of the iframe can be any
 * resource on the same from the same domain as the document [1]. We advise to
 * set it to the location of the favicon, which has been loaded already and
 * will not cost another roundtrip. The iframe is only needed in IE [2], and
 * can be created within a conditional comment to spare its creation cost in
 * other browsers:
 *
 * | <!--[if IE]>
 * |   <iframe id="lb.base.history.iframe" src="favicon.ico" class="hidden"
 * |   ></iframe>
 * | <![endif]-->
 * | <input id="lb.base.history.input" type="hidden" />
 *
 * The following CSS can be used to hide the iframe (in IE):
 * | iframe.hidden {
 * |   position: absolute;
 * |   top: 0;
 * |   left: 0;
 * |   width: 1px;
 * |   height: 1px;
 * |   visibility: hidden;
 * | }
 *
 * References:
 *   + [1] YUI 2: Browser History Manager
 *     http://developer.yahoo.com/yui/history/
 *
 *   + [2] History - Closure Library API Documentation
 *     http://closure-library.googlecode.com/svn/docs/class_goog_History.html
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-06-02
 */
/*requires lb.base.js */
/*requires lb.base.config.js */
/*requires lb.base.dom.js */
/*requires closure/goog.events.js */
/*requires closure/goog.History.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog, window */
// preserve the module, if already loaded
lb.base.history = lb.base.history || (function() {
  // Builder of
  // Closure for lb.base.history module

  // Declare aliases
  var History = goog.History,
      NAVIGATE = History.EventType.NAVIGATE,
      listen = goog.events.listen,
        // use encodeURI / decodeURI instead of encodeURIComponent and
        // decodeURIComponent because the hash may contain a path with slashes,
        // i.e. more than one URI component. The / character gets encoded as
        // %2F by encodeURIComponent; it is preserved by encodeURI.
        // References:
        //   [1] encodeURIComponent Method (Windows Scripting - JScript)
        //   http://msdn.microsoft.com/en-us/library/aeh9cef7%28VS.85%29.aspx
        //
        //   [2] encodeURI - Mozilla Developper Center
        //   https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference
        //                                   /Global_Functions/encodeURI
      encodeHash = window.encodeURI,
      decodeHash = window.decodeURI,
      getOption = lb.base.config.getOption,
      $ = lb.base.dom.$,

  // Private fields

     // object - the underlying history manager (instance of goog.History)
     history = null;

  function init(){
    // Function: init()
    // Initialize the history manager.
    //
    // Note:
    // The polling loop is only initialized when a listener is added in
    // a call to onHashChange().

    // enabled by default, unless 'lb:history:enabled' is set to false.
    if ( !getOption('lb:history:enabled',true) ){
      return;
    }

    history = new History(
      // opt_invisible : boolean
      // Don't hide the hash, make it visible in url
      false,
      // opt_blankPageUrl : string
      // Only used in IE when the iframe is not present.
      // Use the favicon as default, it is probably in cache already.
      // If you need to customize this path, you should create the iframe.
      getOption('lb:history:cheapUrl','/favicon.ico'),
      // opt_input : HTMLInputElement
      // HTML input element used to track state in all browsers.
      // Initialize with $('lb.base.history.input') (may be null).
      $('lb.base.history.input'),
      // opt_iframe : HTMLIFrameElement
      // iframe used in IE to push history state changes.
      // Initialize with $('lb.base.history.iframe') (may be null).
      $('lb.base.history.iframe')
    );
  }

  function getHash(){
    // Function: getHash(): string
    // Get the hash part of current url.
    //
    // Note:
    // The underlying history manager must have been initialized with init(),
    // and not destroyed yet.
    //
    // Returns:
    //   * null when the history manager has been destroyed or not initialized
    //   * string, the url-decoded value of the current hash otherwise

    if (!history){
      return null;
    }
    return '#'+decodeHash( history.getToken() );
  }

  function setHash(hash){
    // Function: setHash(hash)
    // Set a hash part in current url.
    //
    // Notes:
    // The hash will be encoded in this function.
    // This call has no effect if the history manager is not initialized.
    //
    // Param:
    //   hash - string, the new hash part to set, with or without the initial
    //          hash sign, e.g. 'new-hash', '#new-hash' or '#new hash'

    if (!history){
      return null;
    }

    if ( hash.charAt(0) === '#' ){
      // setToken does not expect a hash sign at start of token
      // which would results in duplicate hash
      hash = hash.slice(1);
    }

    history.setToken(
      encodeHash(hash),
      // opt_title - string
      // Optional title to display in IE history.
      // I set the hash as optional title, which is better than the default,
      // the src of the iframe (e.g. http://example.com/favicon.ico)
      hash
    );
  }

  function onHashChange(callback){
    // Function: onHashChange(callback)
    // Register a callback for modifications of the hash.
    //
    // Note:
    // The callback will fire immediately with the value of the current hash.
    // The call is ignored when the underlying history manager has not been
    // initialized, or has been destroyed.
    //
    // Param:
    //   callback - function, a function callback(hash), which will be called
    //              for each change of hash. The new hash, decoded and starting
    //              with '#', will be provided as parameter.

    if (!history){
      return;
    }

    listen(history, NAVIGATE, function(event){
      // refactoring with getHash() possible for the hash conversion
      callback( '#'+decodeHash(event.token) );
    });
    history.setEnabled(true);
  }

  function destroy(){
    // Function: destroy()
    // Terminate the history manager.

    if (history){
      history.dispose();
      history = null;
    }
  }

  return { // public API
    init: init,
    getHash: getHash,
    setHash: setHash,
    onHashChange: onHashChange,
    destroy: destroy
  };
}());
