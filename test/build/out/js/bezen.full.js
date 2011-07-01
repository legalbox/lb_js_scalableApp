/*
 * bezen.js - Root of bezen.org Javascript library
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define, window, bezen, document */
define('bezen',['require','exports','module'],function() {

    var nix = function(){  
      // an empty function that does nothing
      // declared here to be reused as a constant where needed, instead
      // of creating a new similar-looking function in many places
    };
     
    var $ = function(id) {
      // The classic shortcut for getElementById(), in its simplest form.
      // Note: nothing fancy here, this is just an alias for getElementById.
      //
      // param:
      //   id - (string) a DOM element identifier
      //
      // return: (DOM node) (null)
      //   same result as document.getElementById
       
      return document.getElementById(id);
    };

    var bezen = {
      // public API
      $: $,
      nix: nix,
      _: { // private section, for unit tests
      }
    }

    // initialize global variable bezen in browser environment,
    // for backward-compatibility
    if (window){
      // preserve the library, if already loaded
      window.bezen = window.bezen || bezen;
    }

    return bezen;
  }
);
/*
 * bezen.array.js - Array utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define */
define('bezen.array',["./bezen"],
  function(bezen) {

    // Constant

    var ARRAY = []; // used to borrow instance methods for array-like objects
                    // e.g. ARRAY.push.call(arguments,null);
                    // This technique was documented by Matthew Wilson,
                    // http://diakopter.blogspot.com
                    //       /2009/05/efficient-javascript-arguments.html 
     
    var empty = function(array) {
      // remove all elements from an array
      // by setting its length to 0
      //
      // params:
      //   array - (array)(!nil) an array
       
      array.length = 0;
    };

    var last = function(array) {
      // get the last item of an array
      //
      // params:
      //   array - (array)(!nil) an array
      //
      // return:
      //   the last item in the array,
      //   or null in case the array is undefined, null or empty
      if (!array || array.length===0) {
        return null;
      }
       
      return array[array.length -1];
    };
    
    var push = function(array, item){
      // simulate Array.push for array-like objects
      // Note: while push allows unlimited items, this method is limited to 
      //       a single item and will ignore any following arguments.
      //
      // params:
      //   array - (object) array-like object, e.g. function arguments
      //   item - (any) the item to push to the array
      //
      // return: (integer)
      //   the new length of the array
       
      if (Array.push) {
        // use native method
        return Array.push(array,item);
      } else {
        return ARRAY.push.call(array,item);
      }
    };

    var pop = function(array){
      // simulate Array.pop for array-like objects
      //
      // params:
      //   array - (object) array-like object, e.g. function arguments
      //
      // return: (any)
      //   the last element, removed from the array if the array was not empty,
      //   undefined if the array was empty
       
      if (Array.pop) {
        // use native method
        return Array.pop(array);
      } else {
        return ARRAY.pop.call(array);
      }
    };
     
    var shift = function(array){
      // simulate Array.shift for array-like objects
      //
      // params:
      //   array - (object) array-like object, e.g. function arguments
      //
      // return: (any)
      //   the first element, removed from the array if the array was not empty
      //   or undefined if the array was empty
       
      if (Array.shift) {
        // use native method
        return Array.shift(array);
      } else {
        return ARRAY.shift.call(array);
      }
    };
    
    var unshift = function(array, item){
      // simulate Array.unshift for array-like objects
      // Note: while unshift allows unlimited items, this method is limited to
      //       a single item and will ignore any following arguments.
      //
      // params:
      //   array - (object) array-like object, e.g. function arguments
      //   item - (any) the item to prepend to the array
      //
      // return: (integer)
      //   the new length of the array
      //   Note: in IE, this method returns undefined
       
      if (Array.unshift) {
        // use native method
        return Array.unshift(array,item);
      } else {
        return ARRAY.unshift.call(array,item);
      }
    };

    var copy = function(array){
      // return a swallow copy of the given array/array-like object
      //
      // param:
      //   array - (array or object) the array or array-like object to copy
      //
      // return:
      //   null if the array is null or undefined,
      //   a new array with the same items as the given array otherwiser
      if (!array){
        return null;
      }
      
      var duplicate = [];
      for (var i=0; i<array.length; i++){
        duplicate.push(array[i]);
      }
      return duplicate;
    };

    var hash = function(array){
      // return a hash of values in the given array/array-like object
      //
      // params:
      //   array - (array or object) an array or array-like object with a list
      //           of property names to set to the resulting unordered hash
      //
      // return: (object)
      //   an array-like object with a property set to true for each name in
      //   the given array.
      //
      if (!array){
        return null;
      }
       
      var arrayhash = {};
      for (var i=0; i<array.length; i++) {
        arrayhash[ array[i] ] = true;
      }
      return arrayhash;
    };

    // Assign to bezen.array
    // for backward-compatibility in browser environment
    bezen.array = { // public API
      empty: empty,
      last: last,
      // isArray: see bezen.object.isArray
      push: push,
      pop: pop,
      shift: shift,
      unshift: unshift,
      copy: copy,
      hash: hash,

      _:{ // private section, for unit tests
      }
    };

    return bezen.array;
  }
);
/*
 * bezen.object.js - Object utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define */
define('bezen.object',["./bezen"],
  function(bezen) {
   
    var beget = function(prototype){
      // Create a new object inheriting properties through a link to the given 
      // prototype.
      //
      // Adapted from code of Object.beget, p.22 in
      //   "Javascript: The Good Parts"
      //   by Douglas Crockford.
      //   Copyright 2008 Yahoo! Inc.
      //   ISBN13: 978-0-596-51774-8
      // used under conditions defined in "Using Code Examples".
       
      var F = function(){};
      F.prototype = prototype;
      return new F();
    };
     
    var exists = function(object) {
      // Check whether an object exists, and, by providing extra arguments,
      // whether each following argument can be accessed in turn on the object
      //
      // For example, calling
      //   exists({list: ['A','B', 0, 2] }, 'list', 1)
      // will return true, while calling
      //   exists(null)
      // is false, and so is
      //   exists({list:[]}, 'list', 0)
      // since the array list has no item defined at 0
      //
      // Note that this method checks for undefined and null, so
      //   exists( {list:[null]}, 'list', 0)
      // would return false as well
      //
      // You can provide extra arguments to check deeper into the object.
      // 
      // The intent of this method is to allow doing at once
      // if ( exists(a,b,c,d,e,f) ) {
      //   a.b.c.d.e.f.g = 'safe';
      // }
      // without risking to access a non-existing property if one of
      // a,b,c,d,e,f is not defined...
      //
      // params:
      //   object - (object) (null) (undefined) 
      //            an object to check for existence and properties
      //   ... (following arguments) - (list of strings) properties to be looked
      //                               for in chain: object.a.b.c ...
      // return: (boolean)
      //   true if the whole chain exists,
      //   false if null or undefined is found at some point in the chain.
      //
      if ( object===null || object===undefined ) {
        return false;
      }
      
      for (var i=1; i<arguments.length; i++) {
        object = object[ arguments[i] ];
        if ( object===null || object===undefined ) {
          return false;
        }
      }
      
      return true;
    };
    
    var isArray = function(that) {
      // Return true iff that is an array
      // Adapted from code of is_array, p.61 in
      //   "Javascript: The Good Parts"
      //   by Douglas Crockford.
      //   Copyright 2008 Yahoo! Inc.
      //   ISBN13: 978-0-596-51774-8
      // used under conditions defined in "Using Code Examples".
      //
      // params:
      //   that - (any) the object or value to check
      //
      // return: (boolean)
      //   true iff that is considered to be an array
      //   false otherwise
      
      var result =
        that &&
        typeof that === 'object' &&
        typeof that.length === 'number' &&
        typeof that.splice === 'function' &&
        !( that.propertyIsEnumerable('length') );
      return result? true: false; // return false, even if that is only falsy
    };

    var isString = function(that) {
      // check whether that is a string,
      // either a String object or a string litteral
      //
      // params:
      //   that - (any) the object or value to check
      //
      // return: (boolean)
      //   true iff that is a string
      //   false otherwise
       
      return typeof that === 'string' ||
             that instanceof String;
    };

    // Assign to bezen.object
    // for backward compatibility
    bezen.object = {
      // public API
      beget: beget,
      exists: exists,
      isArray: isArray,
      isString: isString,
       
      _:{ // private section, for unit tests
      }
    };

    return bezen.object;
  }
);
/*
 * bezen.assert.js - Assertions for Unit Tests
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define */
define('bezen.assert',["./bezen", "./bezen.object"],
  function(bezen,  object) {
  
    // Define aliases
    var isArray = object.isArray,
        exists = object.exists;
     
    var fail = function(message) {
      // Throw an exception with provided message
      //
      // param:
      //   message - (string) (!nil) message describing the exception case
       
      var exception = new Error(message);
      exception.fileName = exception.fileName || 'bezen.assert.js';
      exception.lineNumber = exception.lineNumber || 42;
      throw exception;
    };
    
    var isTrue = function(condition,message) {
      // Assert whether condition is true
      // or fail with provided error message.
      //
      // params:
      //   condition - (boolean) (!nil) the condition to evaluate
      //   message - (string) (!nil) the error message
       
      if (condition!==true) {
        fail(message);
      }
    };
    
    var isFalse = function(condition, message) {
      // Assert whether condition is false
      // or fail with provided error message.
      //
      // params:
      //   condition - (boolean) (!nil) the condition to evaluate
      //   message - (string) (!nil) the error message
       
      if (condition!==false) {
        fail(message);
      }
    };
    
    var difference = function(actual, expected) {
      // Get common message for difference between actual and expected
      // used in comparison functions.
      //
      // params:
      //   actual - (any) (!nil) actual value (will be converted to a string)
      //   expected - (any) (!nil) expected value (will be converted to a string)
      //
      // return: (string)
      //   a message describing the difference
       
      return ' expected: "'+expected+'" found: "'+actual+'"';
    };

    var equals = function(actual, expected, message) {
      // Assert that actual and expected are equal
      // or fail with specified message if a difference is found.
      // This comparison is limited to scalars, as it relies on !== operator.
      //
      // params:
      //   actual - (any scalar value) (!nil) the actual value found
      //   expected - (any scalar value) (!nil) the expected value
      //   message - (string) (!nil) the message describing the assertion
       
      if (expected !== actual) {
        message = message || '';
        fail( message+difference(actual, expected) );
      }
    };

    var arrayEquals = function(actual, expected, message) {
      // Apply comparison to each item of actual and expected arrays,
      // recursively, and fail with given message if a difference is found
      //
      // params:
      //   actual - (array) (!nil) the actual list of items found
      //   expected - (array) (!nil) the expected list of items
      //   message - (string) (!nil) the message describing the assertion
       
      if (actual === expected) {
        return;
      }
      
      var isActualArray = isArray(actual);
      var isExpectedArray = isArray(expected);
      if ( isActualArray !== isExpectedArray ) {
        // difference of nature
        fail( message + difference(actual, expected) );  
      } else if ( !isActualArray ) {
        // neither is an array, but could still be equal
        equals(actual,expected,message);
        return;
      }
       
      if ( actual.length !== expected.length ) {
        fail( message + ' different length,' + difference(actual, expected) );
      }
      for (var i=0; i<actual.length; i++) {
        arrayEquals(actual[i], expected[i], message+' at index['+i+']');
      }
    };
    
    var objectEquals = function(actual, expected, message) {
      // Apply comparison to each property of actual and expected objects,
      // recursively, and fail with given message if a difference is found
      //
      // Note:
      //   own and inherited properties are compared separately, and differences
      //   in inherited properties, or mismatch between inherited and own
      //   properties will result in a failed assertion. In particular, the
      //   assertion will fail if one object owns a property and the other only
      //   inherits it, even with the same value.
      //
      // params:
      //   actual - (object) (!nil) the actual set of properties found
      //   expected - (object) (!nil) the expected set of properties
      //   message - (string) (!nil) the message describing the assertion
      
      if (actual===expected) {
        return;
      }
       
      if ( !exists(actual) || !exists(expected) ) {
        // one is null or undefined, and the other is different
        fail( message + difference(actual, expected) );
      }

      var isActualObject = typeof actual === 'object';
      var isExpectedObject = typeof expected === 'object';
      if ( isActualObject !== isExpectedObject ) {
        // difference of nature
        fail( message + difference(actual, expected) );  
      } else if ( !isActualObject ) {
        // neither is an object, but could still be equal
        equals(actual,expected,message);
        return;
      }
      
      var testedProperties = {}, type;
      for (var expectedName in expected) { 
        if ( expected.hasOwnProperty(expectedName) ===
             actual.hasOwnProperty(expectedName) ) {
          // keep track of tested properties to avoid duplicate tests in 2nd loop
          testedProperties[expectedName] = true;
          type = expected.hasOwnProperty(expectedName)? 'own': 'inherited';
          objectEquals(actual[expectedName], expected[expectedName], 
            message+' in '+type+' property "'+expectedName+'"'
          );
        } else {
          fail( message +
                ' missing property "'+expectedName+
                '" (or owned/inherited property mismatch) '+
                difference(actual[expectedName],expected[expectedName])
          );
        }
      }
       
      for (var actualName in actual) {
        if ( testedProperties[actualName] ){
          // already tested
        } else {
          // extra property, only found in actual
          type = actual.hasOwnProperty(actualName)? 'own': 'inherited';
          fail( message +
                ' extra '+type+' property "'+actualName+'"'+
                difference(actual[actualName],expected[actualName])
          );
        }
      }
    };

    // Assign to bezen.assert,
    // for backward compatibility
    bezen.assert = {
      // public API
      fail: fail,
      isTrue: isTrue,
      isFalse: isFalse,
      equals: equals,
      arrayEquals: arrayEquals,
      objectEquals: objectEquals,
       
      _:{ // private section, for unit tests
        difference: difference
      }
    };

    return bezen.assert;
  }
);
/*
 * bezen.error.js - "catch all" mechanism for window.onerror (IE/FF), 
 *                  setTimeout and setInterval.
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * The intent of this module is to deploy a safety net to catch and log
 * unexpected errors at the top level. This is done by configuring a proper
 * callback in window.onerror for IE and Firefox.
 *
 * Sadly, window.onerror is still not supported in Opera, Safari and Chrome.
 * In these browsers, errors are not reported for code triggered by setTimeout.
 *
 * For this purpose, this module defines an alternate setTimeout/setInterval 
 * which catches errors and calls any handler attached to window.onerror.
 *
 * You can set the safeSetTimeout/safeSetInterval methods defined by this 
 * module to window.setTimeout and window.setInterval manually, or you can
 * call bezen.error.catchAll() which will do it for you. In addition, catchAll
 * will set window.onerror to a default handler which logs errors using
 * bezen.log.error(), if available. You may define your own handler instead, 
 * by setting your own function to window.error either before or after calling
 * catchAll().
 *
 * You may use the catchError method in your own code to catch and report
 * errors to window.onerror in the same way as this module does for setTimeout
 * and setInterval.
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global define, window */
define('bezen.error',["./bezen", "require"],
  function(bezen,  require) {
   
    // Define aliases
    var unsafeSetTimeout = window.setTimeout,
        unsafeSetInterval = window.setInterval;
    
    var reportError = function(error,url,line){
      // Convenience method to report all errors: if the module bezen.log is
      // present, an error message is created and logged, otherwise this call
      // is ignored.
      //
      // The intent of this method is to offer a single entry point to report
      // all errors caught in try/catch blocks and other safety nets such as
      // window.onerror.
      //
      // There are two allowed forms to call it:
      // - with a single Error parameter, for use in a catch clause:
      //     try {
      //       throw new Error('message','file',42);
      //     } catch(e){
      //       bezen.error.reportError(e);
      //     }
      //
      // - with 3 parameters, for use in window.onerror or direct calls:
      //     reportError('failed to load data','script.js',0);
      //
      // params:
      //   error - (object) Error object (1-param form)
      //           or (string) error message (3-param form)
      //   url     - (string) file where the error was raised
      //   line    - (integer) line number
      //
      // Warning:
      //   The fileName and lineNumber properties of the error object are
      //   not standard, and only available in Firefox browser. In other 
      //   browsers the error logs will end with 'at undefined[undefined]'.
      //
      // References:
      //   Error - MDC
      //   https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference
      //                                   /Global_Objects/Error
      //
      //   Error Object (Windows Scripting - JScript)
      //   http://msdn.microsoft.com/en-us/library/dww52sbt(VS.85).aspx

      var log = require("./bezen.log");
      if (!log){
        return;
      }
       
      if (typeof error === 'object'){
        // convert 1-param call to 3-param call
        reportError(error.message, error.fileName, error.lineNumber);
        return;
      }
       
      log.error(error + ' at ' + url + '[' + line + ']', true);
    };
     
    var onerror = function(message,url,line) { 
      // Default error handler for window.onerror
      //
      // The handler will be set to window.onerror by catchAll(), and will be
      // triggered for errors caughts by safeSetTimeout and safeSetInterval as
      // well.
      //
      // Note:
      //   Without the catch all mechanism defined by this module, window.onerror
      //   is only supported by Mozilla Firefox and IE without script debugger.
      //   window.onerror is not called in IE if script debugger is enabled.
      //   It is not called in Opera, Safari and Chrome either. 
      //
      //   With this module, window.onerror will be triggered in all browsers 
      //   for any error caught in code starting by a setTimeout/setInterval,
      //   and in some browsers (Firefox/IE) for uncaught errors.
      //
      // params:
      //   message - (string) error message
      //   url     - (string) file where the error was raised
      //   line    - (integer) line number
       
      reportError('window.onerror: ' + message, url, line);
      return true; // do not report error in browser
    };
     
    var catchError = function(func,description){
      // A wrapper for the given function to catch and report errors to
      // the window.onerror handler
      //
      // Notes:
      //   - a handler should have been assigned to window.onerror beforehand,
      //     either directly or by calling catchAll() to set a default handler.
      //     In case no window.onerror handler has been set, the call is ignored.
      //
      //   - in case the first argument is not a function, an error is reported
      //     with reportError(), and the bezen.nix function is returned.
      //
      // params:
      //   func - (function) (!nil) the function to call safely
      //   description - (string) (optional) (default: 'error.catchError') 
      //                 a description of the function for logging purpose
      //                 e.g. 'object.method'
      //
      // return: (any)
      //   bezen.nix (function that does nothing) if func is not a function,
      //   a new function wrapping func in a try/catch otherwise
      //
      description = description || 'error.catchError';
       
      if (typeof func!=='function'){
        reportError(description+': A function is expected, found '+ typeof func);
        return bezen.nix;
      }
       
      var safefunc = function(){
        try {
          return func.apply(this,arguments);
        } catch(e) {
          if (window.onerror){
            window.onerror(description+': '+e.message+' in '+func,
                           e.fileName, e.lineNumber,true);
          }
        }
      };
      return safefunc;
    };
    
    var safeSetTimeout = function(func,delay){
      // a safe alternative to setTimeout, catching and logging errors thrown
      // by the callback
      //
      // params:
      //   func - (function or string) the function to call safely,
      //          or a string of code to evaluate safely
      //   delay - (integer) the delay
      //
      // return:
      //   the handler returned by setTimeout
      if (typeof func === 'string') {
        if (bezen.log){
          bezen.log.warn('window.setTimeout: eval is evil: "'+func+'"');
        }
        func = new Function(func);
      }
      return unsafeSetTimeout(catchError(func,'window.setTimeout'),delay);
    };
   
    var safeSetInterval = function(func,delay){
      // a safe alternative to setInterval, catching and logging errors thrown
      // by the callback
      //
      // params:
      //   func - (function or string) the function to call safely, or a string
      //          of code to evaluate safely
      //   delay - (integer) the delay
      //
      // return:
      //   the handler returned by setInterval
      if (typeof func === 'string') {
        if (bezen.log){
          bezen.log.warn('window.setInterval: eval is evil: "'+func+'"');
        }
        func = new Function(func);
      }
       
      return unsafeSetInterval(catchError(func,'window.setInterval'),delay);
    };
     
    var catchAll = function(){
      // configure a handler to window.onerror and override setTimeout to catch 
      // and log errors while preventing them from being displayed to the 
      // end-user by the browser.
      //
      // This method should be called as soon as possible before any significant
      // code is run:
      //   * calls to setTimeout, window.setTimeout
      //   * calls to setInterval, window.setInterval
      //   * internal/external script code possibly throwing errors
      //
      // Note: this method will override any listener previously set to
      //       window.onerror, as well as the native window.setTimeout and
      //       window.setInterval. Back up those original functions if needed.
      // 
      
      window.onerror = onerror;
      window.setTimeout = safeSetTimeout;
      window.setInterval = safeSetInterval;
    };

    // Assign to bezen.error,
    // for backward compatibility in browser environment
    bezen.error = { // public API
      reportError: reportError,
      onerror: onerror,
      safeSetTimeout: safeSetTimeout,
      safeSetInterval: safeSetInterval,
      catchError: catchError,
      catchAll: catchAll,
       
      _: { // private section, for unit tests
      }
    };

    return bezen.error;
  }
);
/*
 * bezen.dom.js - Document Object Model utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global document */
define('bezen.dom',["./bezen", "./bezen.error"],
  function(bezen,  error) {

    // Declare aliases
    var catchError = error.catchError;
     
    // DOM Node Type
    // Ref: W3C REC-DOM-Level-1-19981001
    var ELEMENT_NODE = 1,
        ATTRIBUTE_NODE = 2,
        TEXT_NODE = 3;
     
    var element = function(name,attributes) {
      // Create a new element with given name, attributes and children.
      //
      // params:
      //   name - (string) (!nil) name of the new element to be created
      //   attributes - (object) (!nil) name/value pairs of attributes
      //                for the new element
      //   ... - (list of DOM elements and/or strings) (optional) 
      //         remaining args are added as children elements and text nodes
      //
      // Example:
      //   element('ul',{},
      //     element('li',{},
      //       element('a',{href:"#first"},"first link")
      //     ),
      //     element('li',{},
      //       element('a',{href:"#second"},"second link")
      //     ),
      //     element('li',{},
      //       element('a',{href:"#third"},"third link")
      //     )
      //   );
      //
      // Warnings: in IE
      //   - attributes in uppercase can prevent new object from loading
      //     properly in IE: 'SRC' for IFrame is not converted to 'src'
      //     using this method. The lowercase version should be specified
      //     in calls to this method. A later version of the code may also 
      //     convert received values in lowercase just in case.
      //
      //   - setting the 'class' attribute does not update the className
      //     property as expected. A later version of this code might set
      //     the className property directly when the attribute name is 'class'.
      //
      //   - setting the 'style' attribute does not work either. A later version
      //     of this code might set the style property directly.
      //
      //   - some elements cannot be added as child of others, e.g.
      //     'embed' as child of 'object'. They are silently ignored here.
       
      var parent = document.createElement(name);
      if (!attributes) {
        return parent;
      }
       
      for (var attribute in attributes) {
        if ( attributes.hasOwnProperty(attribute) ) {
          parent.setAttribute( attribute, attributes[attribute] );
        }
      }
      
      if (parent.canHaveChildren===false) {
        // avoid error in IE: children forbidden
        return parent;
      }
       
      for (var i=2; i<arguments.length; i++) {
        var child = arguments[i];
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        parent.appendChild( child );
      }
      return parent;
    };
    
    var clear = function(element) {
      // Clear an element contents by resetting its innerHTML
      //
      // param:
      //   element - (DOM element) (!nil) the element to empty
      //
      // Note:
      //   in case the element cannot have children (IE) the call is ignored
      //
      if (element.canHaveChildren===false) {
        return;
      }
       
      element.innerHTML = '';
    };

    var insertBefore = function(node,newNode) {
      // Insert a new node before given node
      //
      // params:
      //   node - (DOM node)(!nil) the reference node, will be next sibling 
      //          of the new node after insertion
      //   newNode - (DOM node) the new node, to insert before
       
      var parent = node.parentNode;
      parent.insertBefore(newNode,node);
    };
    
    var insertAfter = function(node,newNode) {
      // Insert a new node after given node
      //
      // params:
      //   node - (DOM node)(!nil) the reference node, will be previous sibling 
      //          of the new node after insertion
      //   newNode - (DOM node) the new node, to insert after
      //
      // Reference for this implementation based on element.insertBefore:
      //   https://developer.mozilla.org/en/insertBefore 

      var parent = node.parentNode;
      parent.insertBefore(newNode, node.nextSibling);
    };

    var remove = function(element) {
      // Remove an element from the DOM
      //
      // param:
      //   element - (DOM element) (!nil) the element to remove
      //
      // Notes:
      //   - nothing happens if the element has no parent
      //   - the parentNode property is read-only
      //   - in IE, the parentNode is not set to null like in other browsers,
      //     but to a document fragment object. To detect this case, I check
      //     here the presence of the innerHTML property on the parent. In case
      //     no innerHTML is present, the parent is considered to be such a
      //     foster document fragment.
       
      if (element.parentNode && element.parentNode.innerHTML) {
        element.parentNode.removeChild(element);
      }
    };
     
    var hasAttribute = function(node, attributeName) {
      // emulate hasAttribute by checking DOM level 2 specified property
      // of the attribute node. The native function is used when available.
      // 
      // params:
      //   node - (DOM element) (!nil) the element to check for given attribute
      //   attributeName - (string) (!nil) an attribute name
      //
      // return: (boolean)
      //   true if the attribute is present on the element,
      //   false otherwise
      //
      // Note: when the behavior is emulated, in IE, the attribute may not 
      //       have been defined in the original document, but may be an
      //       optional attribute set to its default value.
        
      if (node.hasAttribute) {
        return node.hasAttribute(attributeName);
      }
       
      var attributeNode = node.getAttributeNode(attributeName);
      if (attributeNode === null) {
        return false;
      }
      return attributeNode.specified;
    };
    
    var appendScript = function(parent, scriptElt, listener) {
      // append a script element as last child in parent and configure 
      // provided listener function for the script load event
      //
      // params:
      //   parent - (DOM element) (!nil) the parent node to append the script to
      //   scriptElt - (DOM element) (!nil) a new script element 
      //   listener - (function) (!nil) listener function for script load event
      //
      // Notes:
      //   - in IE, the load event is simulated by setting an intermediate 
      //     listener to onreadystate which filters events and fires the
      //     callback just once when the state is "loaded" or "complete"
      //
      //   - Opera supports both readyState and onload, but does not behave in
      //     the exact same way as IE for readyState, e.g. "loaded" may be
      //     reached before the script runs.
      //
      //   - a listener can be set to the 'onerror' property of the script
      //     beforehand to detect errors in loading external scripts. I thought
      //     about adding an optional parameter for this listener function,
      //     and came to the conclusion that it was unnecessary: like other
      //     properties of the script, it can be set on the script element
      //     before calling this function to append and load the script.
      //
      // Known Limitation:
      //   - When trying to load dynamically a script with src '//:' using this
      //     method, the listener function is not triggered (and neither is the
      //     onerror function if set): in Firefox the onload function is not
      //     called, in Internet Explorer the onreadystatechange function is
      //     triggered once for 'loaded', but never for 'complete'. The behavior
      //     of a static script with src '//:' is the same in Firefox, but 
      //     differs in Internet Explorer: with a static script the function
      //     onreadystatechange is triggered once for 'complete'.
      //     This special src value is used in some old hacks to detect the
      //     DOM readiness in Internet Explorer. Extra attention should be taken
      //     when loading scripts relying on this hack dynamically.
       
      var safelistener = catchError(listener,'script.onload');
       
      // Opera has readyState too, but does not behave in a consistent way
      if (scriptElt.readyState && scriptElt.onload!==null) {
        // IE only (onload===undefined) not Opera (onload===null)
        scriptElt.onreadystatechange = function() {
          if ( scriptElt.readyState === "loaded" || 
               scriptElt.readyState === "complete" ) {
            // Avoid memory leaks (and duplicate call to callback) in IE
            scriptElt.onreadystatechange = null;
            scriptElt.onerror = null;
            safelistener();
          }
        };
      } else {
        // other browsers (DOM Level 0)
        scriptElt.onload = safelistener;
      }
      parent.appendChild( scriptElt );
    };
    
    // Assign to bezen.dom
    // for backward compatibility
    bezen.dom = { // public API
      ELEMENT_NODE: ELEMENT_NODE,
      ATTRIBUTE_NODE: ATTRIBUTE_NODE,
      TEXT_NODE: TEXT_NODE,
      element: element,
      clear: clear,
      insertBefore: insertBefore,
      insertAfter: insertAfter,
      remove: remove,
      hasAttribute: hasAttribute,
      appendScript: appendScript,
        
      _: { // private section, for unit tests
      }
    };
    return bezen.dom;
  }
);
/*
 * bezen.string.js - String utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define */
define('bezen.string',["./bezen"],
  function(bezen) {

    var trim = function(string) {
      // trim a string 
      //
      // param:
      //   string - (string) (!nil) a string
      //
      // return: (string)
      //   a copy of the string, with initial and final whitespace removed
      //
      // I use here the trim1 algorithm described by Steven Levithan
      // as "a general-purpose implementation which is fast cross-browser"
      // http://blog.stevenlevithan.com/archives/faster-trim-javascript
      
      string = string.replace(/^\s\s*/, ''); // remove leading whitespace
      return string.replace(/\s\s*$/, ''); // remove trailing whitespace
    };
    
    var startsWith = function(string, prefix) {
      // whether a string starts with a given prefix
      //
      // params:
      //   string - (string)(!nil) a string
      //   prefix - (string, ...) a prefix to be searched for at the start of
      //            the string. Note: the prefix is first converted to a string.
      //
      // return: (boolean)
      //   true when the prefix is found at start
      //   false otherwise
      //
      // This implementation compares the prefix with the start of the string,
      // up to the length of the prefix.
      prefix = String(prefix);
      
      return string.slice(0,prefix.length) === prefix;
    };

    var endsWith = function(string, suffix) {
      // whether a string ends with a given suffix
      //
      // params:
      //   string - (string) a string
      //   suffix - (string, ...) a suffix to be searched for at the end of
      //            the string. Note: the prefix is first converted to a string.
      //
      // return: (boolean)
      //   true when the suffix is found at end
      //   false otherwise
      //
      // This implementation compares the suffix with the end of the string,
      // up to the length of the suffix.
      suffix = String(suffix);

      return string.slice(string.length-suffix.length) === suffix;
    };

    // Assign to bezen.string,
    // for backward compatibility
    bezen.string = {
      // public API
      trim: trim,
      startsWith: startsWith,
      endsWith: endsWith,
       
      _: { // private section, for unit tests
      }
    };

    return bezen.string;
  }
);
/*
 * bezen.domwrite.js - Simulated document.write and writeln for the safe 
 *                     loading of external scripts after page load
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * I developed this library to allow a deferred loading for third party
 * scripts making use of document.write().
 *
 * The problem:
 *   - external scripts typically inserted for advertisements and analytics
 *     are not necessary to the initial loading of the page
 *   - however, when they call document.write() after window.onload fired,
 *     the page is reset to blank, which prevents lazy loading
 *
 * The solution:
 *   - replace document.write to prevent the page reset, collect the markup 
 *     and insert it in the DOM dynamically.
 *
 *   In all examples below, $ is an alias to document.getElementById:
 *   var $ = function(id){ return document.getElementById(id) };
 *
 *   // First example: load with bezen.load.js
 *   window.onload = function() {
 *     // capture document.write and document.writeln
 *     bezen.domwrite.capture();
 *     
 *     // by default, loading and rendering are done at end of document.body
 *     bezen.load.script("http://example.com/js/analytics", function(){
 *       // render the captured markup to document.body
 *       bezen.domwrite.render(function(){
 *         // optionally, change the parent for the second script
 *         var parent = $('ads');
 *         bezen.load.script(parent, "http://example.com/js/ads", function(){
 *           // render (newly) captured markup to selected parent
 *           bezen.domwrite.render(parent);
 *         });
 *       });
 *     });
 *   };
 *
 *   The same example can be rewritten to make use of LABjs (http://labjs.com)
 *   instead of bezen.load.js:
 *
 *   // Second example: load with LAB.js
 *   window.onload = function() {
 *     // capture document.write and document.writeln
 *     bezen.domwrite.capture();
 *     
 *     $LAB
 *     .setOptions({AppendTo: "body"}) // create scripts in document.body
 *     .script("http://example.com/js/analytics")
 *     .wait(function(){
 *       // render the captured markup to document.body
 *       bezen.domwrite.render(document.body, function() {
 *         // optionally, change the parent for the second script
 *         var parent = $('ads');
 *         $LAB
 *         // LABjs provides no way to select a parent other than head/body;
 *         // defaults to .setOptions({AppendTo: "head"})
 *         .script("http://example.com/js/ads")
 *         .wait(function(){
 *           // render (newly) captured markup to selected parent
 *           bezen.domwrite.render(parent);
 *         });
 *       });
 *     });
 *   }
 *
 * Limitations:
 *   I identified four differences between this simulation of document.write 
 *   and the browser's implementation of document.write:
 *
 *   1°) The browser inserts markup immediately. No insertion is done in this
 *   simulation until the next call to bezen.domwrite.render. The capture
 *   just stores the markup until render() inserts it in selected parent
 *   and runs any included script.
 *
 *   PROS: the overall result at the end of the processing is the most
 *   accurate with this late rendering: since document.write allows to write 
 *   opening and closing tags in separate calls, inserting markup after each
 *   call leads to unexpected results due to an automatic repair done by the 
 *   browser for unclosed elements.
 *
 *   CONS: in incriminated scripts, written nodes will not appear in the DOM
 *   immediately after a call to document.write(), and trying to retrieve
 *   such an element with getElementById or getElementsByTagName will lead to
 *   a null result.
 *
 *   2°) During normal document construction, any script element inserted with
 *   document.write is always last in the document, and can be retrieved at
 *   last position in document.getElementsByTagName("script"). In this
 *   implementation, after rendering, the same script would be found last
 *   in selected parent element, and would not necessarily be last in the
 *   document. A turnaround is to use document.body as parent for rendering.
 *
 *   3°) This implementation yields during rendering after inserting a script 
 *   element to wait for its execution, and also after inserting one or 
 *   several nodes without script to let the browser process user events.
 *   During the yield, some contents may be inserted in the document, by
 *   separate scripts or by the processing of following markup during document
 *   loading. I encountered the latter case during unit testing: all tests 
 *   where triggered by an internal script at the end of the body, but followed
 *   by some whitespace ("\n  ") due to code indentation. While running a test
 *   of render() with document.body as parent, this whitespace got inserted
 *   during the first yield of the script, which is after the first dynamic
 *   node and before the followings.
 *
 *   In the browser's implementation of document.write, no yielding occurs 
 *   during rendering (which is part of document.write). A turnaround is to 
 *   start the dynamic loading in window.onload to ensure that all the markup
 *   in the source document has been processed, and to build a safe sequence
 *   of execution for scripts based on known dependencies, waiting for the
 *   callback of bezen.domwrite.render() before loading the following script.
 *
 *   4°) in case of errors while loading, parsing or running scripts inserted
 *   with document.write, the insertion and interpretation of following markup
 *   will go on, in browser's implementation. In this implementation, any such
 *   error will stop the rendering of captured markup.
 *   
 * Direction for future developments:
 *   If these limitations happen to have a significant impact on existing
 *   libraries in the wild, I may rework the underlying algorithm, by using
 *   a custom HTML parser to insert nodes immediately while keeping track
 *   of unclosed tags.
 *
 *   Under these circumstances, with a partial rendering done at the end of
 *   each call to document.write, a new, more complex callback mechanism would
 *   be needed to get a hint of the complete loading of a script and its
 *   dependencies.
 *   
 * Credits:
 *   I'm just standing on the shoulders of giants, who shared their knowledge
 *   on blogs, web sites, books and in their Javascript libraries:
 *   
 *   John Resig
 *     XHTML, document.write, and Adsense
 *     http://ejohn.org/blog/xhtml-documentwrite-and-adsense/ 
 *  
 *   Steve Souders
 *     "Delayed Script Execution" in Opera
 *     http://stevesouders.com/tests/delayed-script-execution.php
 *
 *   Nicholas C. Zakas
 *     The best way to load external JavaScript
 *     http://www.nczonline.net/blog
 *           /2009/07/28/the-best-way-to-load-external-javascript/ 
 *
 *   Frank Thuerigen
 *     solution: lazy loading JS ad code containing document.write()
 *     http://www.webdeveloper.com/forum/showthread.php?t=195112
 *
 *   Kyle Simpson, whith whom I discussed this library and its use with LABjs
 *     LABjs (Loading And Blocking JavaScript)
 *     http://labjs.com/
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint evil:true, nomen:false, white:false, onevar:false, plusplus:false */
/*global document, setTimeout */
define('bezen.domwrite',["./bezen", "./bezen.string", "./bezen.array", "./bezen.dom"],
  function(bezen,  string,           array,           dom) {

    // Define aliases
    var nix = bezen.nix,
        trim = string.trim,
        empty = array.empty,
        hasAttribute = dom.hasAttribute,
        appendScript = dom.appendScript,
    // Original browser functions
        originalDocumentWrite = document.write,
        originalDocumentWriteln = document.writeln;
     
    // array of HTML markup written in subsequent calls to domWrite function.
    // The collectMarkup function collects the markup and empties the array.
    var markupArray = [];
     
    var domWrite = function(markup) {
      // simulated document.write function.
      // It is intended to enable, after window onload, the dynamic loading 
      // of external scripts that call the document.write function.
      //
      // Note: unlike native document.write, domWrite does not call
      //       document.open() after window onload, thus preventing
      //       the document reset which happens in this case.
      //
      // params:
      //   markup - (string) HTML markup
       
      markupArray.push( markup );
    };
     
    var domWriteln = function(markup) {
      // simulated document.writeln function
      //
      // params:
      //   markup - (string) HTML markup
       
      domWrite( markup+'\n' );
    };

    var collectMarkup = function() {
      // retrieve the markup collected by domWrite
      // or null if no markup was collected
      //
      // return: (string)
      //   null if domWrite has not called since last call to collectMarkup,
      //   otherwise the concatenated markup collected by domWrite (ordered)
      //   
      if (markupArray.length === 0) {
        return null;
      }
       
      var markup = markupArray.join('');
      empty(markupArray);
      return markup;
    };
     
    var parseMarkup = function(markup) {
      // parse HTML by inserting markup in a new div outside the DOM
      //
      // This is the method used in this module to parse the markup written
      // to document.write and document.writeln, in a call to render().
      //
      // Note: The <br> hack is required for proper parsing of script 
      //       elements in IE. It consists in inserting a <br> element
      //       at start of markup (then removed before returning result).
      //
      // param:
      //   markup - (string) (!nil) HTML markup to parse
      //
      // return: (DOM node)
      //   the first child node (might be null), within its parent parser div
       
      var divParser = document.createElement("div");
      divParser.innerHTML = '<br/>'+markup;
      divParser.removeChild( divParser.firstChild );
      return divParser.firstChild;
    };
     
    var isJavascriptScript = function(node) {
      // check whether this node is a script element identified as javascript
      //
      // params:
      //   node - (DOM node) (!nil) the node to check
      //
      // return: (boolean)
      //   false if node.nodeName !== "SCRIPT"
      //         or (node.language 
      //             && node.language.toLowerCase() !== "javascript")
      //         or (node.type
      //             && node.type.replace(
      //                  /^\s+|\s+$/g,""
      //                ).toLowerCase() !== "text/javascript"
      //   true otherwise 
      //
      // Note: this method does not take into account the overload of default
      //       script type using HTTP or meta parameter.
      //       For cross-browser compatibility, it also ignores alternate MIME
      //       types for javascript:
      //       - "application/javascript" (the new standard)
      //       - "application/x-javascript" (private extension)
      //       Only the deprecated "text/javascript" is supported here.
      //
      
      if ( node.nodeName !== "SCRIPT" ) {
        return false;
      }
        
      if ( node.language && 
           node.language.toLowerCase() !== "javascript" ) {
        return false;
      }

      if ( node.type &&
           trim(node.type).toLowerCase() !== "text/javascript" ) {
        return false;
      }
      
      return true;
    };
     
    var appendScriptClone = function(parent, scriptElt, listener) {
      // clone a script element with custom code to ensure 
      // that it runs and that provided callback is triggered
      // then append it to parent.
      //
      // Note: to design this method, I performed extensive tests of dynamic
      //       loading in these browsers:
      //         - IE6, IE7, IE8,
      //         - FF2, FF3, FF3.5,
      //         - Safari 3.1, Safari 4.0,
      //         - Chrome 2,
      //         - Opera 9.6 and Opera 10
      //
      // The steps to clone external scripts are:
      //   - create a new script node
      //   - copy all (non-default) attributes
      //   - copy the script text
      //
      // The steps are different for internal scripts:
      //   - clone it in a shallow way with cloneNode(false)
      //   - copy the script text
      //   - set the "type" attribute to "any" before appending to the DOM
      //   - restore the original type attribute afterwards
      // These steps ensure that the internal script is cloned but does not run,
      // which allows to trigger the callback in a reliable way:
      //   - evaluate the script text using a new Function()
      //   - trigger the callback (after yield) with setTimeout
      //
      // params:
      //   parent - (DOM element) (!nil) parent element to append the script to
      //   scriptElt - (DOM element) (!nil) the script element to copy
      //               It must be a Javascript script.
      //   listener - (function) (!nil) the listener function to be triggered
      //              when the script has been loaded and run
      //
      // Known Limitations:
      //   - in case of error in an external or internal script cloned with this
      //     method, the listener is never triggered. I thought about using the
      //     script.onerror handler to detect errors and go on, but this handler
      //     is only triggered for external scripts, for unusual errors such as
      //     interruption of the download or missing local file, and cannot be
      //     relied on cross-browser. In addition, parsing errors or other 
      //     Javascript errors do not trigger the script.onerror handler, only,
      //     in some browsers, the global window.onerror handler.
      //
      //   - for consistency between internal and external scripts, I refrained
      //     from adding a try/catch mechanism around the evaluation of the
      //     internal script code. As a consequence, any error thrown during the
      //     evaluation will break the chain of loading in the same manner.
      //
      // References:
      //   How to trigger script.onerror in Internet Explorer? - StackOverflow
      //   http://stackoverflow.com/questions/2027849
      //         /how-to-trigger-script-onerror-in-internet-explorer
      //
      //   onerror Event - MSDN
      //   http://msdn.microsoft.com/en-us/library/cc197053%28VS.85%29.aspx
       
      if ( hasAttribute(scriptElt,"src") ) {
        var externalScript = document.createElement("script");
        for (var i=0; i<scriptElt.attributes.length; i++) {
          var attribute = scriptElt.attributes[i];
          if (  hasAttribute( scriptElt, attribute.name )  ) {
            externalScript.setAttribute(attribute.name, attribute.value);
          }
        }
        externalScript.text = scriptElt.text;
        appendScript(parent, externalScript, listener);
      } else {
        var internalScript = scriptElt.cloneNode(false);
        internalScript.text = scriptElt.text;
        internalScript.type = "any";        
        parent.appendChild( internalScript );
        // revert "type" attribute to its original state
        if ( hasAttribute(scriptElt, "type") ) {
          // restore original value
          internalScript.setAttribute("type", scriptElt.type);
        } else {
          // remove newly created type attribute
          internalScript.removeAttribute("type");
        }       
         
        // global eval script text to run it now, just once
        (  new Function( internalScript.text )  )();
         
        // run the callback just after
        listener();
      }
    };
   
    // Note: the declaration of render before use by loadPiecemeal is required
    //       by JSLint - these two methods are mutually recursive
    var render;

    var loadPiecemeal = function(parent, input, callback) {
      // load input created by parseMarkup node by node, by:
      //   - inserting a clone of the input node in the document
      //   - loading scripts and loading in turn any markup collected
      //   - going on with the following node in the input, in "document order"
      //   - finally, firing the callback after reaching the end of the input
      //
      // Note: this method is intended for private use, in combination with
      //       domWrite and render to simulate document.write
      //
      // params:
      //   parent - (DOM element) (!nil) current parent to append cloned nodes to
      //   input - (DOM node) (null) current node in the input generated by 
      //           the parser parseMarkup(). A null value means that the end of 
      //           the input has been reached
      //   callback - (function) (!nil) the function to trigger after the end of 
      //              successful loading.
      //              Warning: the callback function is mandatory here, as it
      //                       is required to report the end of the processing
      //
      
      if (input===null) {
        // end of the input
        callback();
        return;
      }
       
      var nextInput = null;
      var nextParent = parent;
      var nextStep = function() {
        loadPiecemeal(nextParent, nextInput, callback);
      };
       
      if ( isJavascriptScript(input) ) {
        setTimeout(function(){
          appendScriptClone(parent, input, function() { 
            render(parent, nextStep);
          });
        },0);
        // keep nextInput null - skip first child for cross-browser consistency
         
      } else {
        // regular node
        var clone = input.cloneNode(false);
        parent.appendChild(clone);
        setTimeout(nextStep, 0);
         
        if (input.firstChild) {
          var scriptCount = input.getElementsByTagName('script').length;
          if ( scriptCount === 0 ) {
            // shortcut: if there is no script within
            //           copy all descendants at once as innerHTML
            clone.innerHTML = input.innerHTML;
          } else {
            // go the long way
            nextInput = input.firstChild;
            nextParent = clone;
          }
        }
      }
       
      // Note: I do not return in the above if/else, but plan the nextStep
      //       closure execution with listeners / setTimeout.
      //       I can then update safely the nextInput and nextParent 
      //       referenced by the closure.
      // Important: this relies on the fact that setTimeout defers the execution
      //       of the next step after the end of the current thread of execution.
      //       It will work here only as long as a setTimeout *is* met on all
      //       paths (internal script / external script / regular node).
      //       It worked *most*of*the*time* by appending an external script to 
      //       the DOM and setting the next step to the callback, except, 
      //       sometimes, in Safari, where the script may run immediately,
      //       followed by the callback, without waiting for the end of the 
      //       current method. I first fixed it by using setTimeout to append 
      //       the external script. I then moved it to the upper lever, around
      //       appendScriptClone in loadPiecemeal.
      //       This behavior must be preserved across future refactorings.
      
      // if there is no first child (or if this is a script node)
      // move to the next sibling
      if (nextInput === null) {
        nextInput = input.nextSibling;
      }
       
      // if there is no next sibling
      // move to the first sibling found in an ancestor
      var inputAncestor = input.parentNode;
      while( nextInput === null && inputAncestor !== null) {
        nextInput = inputAncestor.nextSibling;
        nextParent = nextParent.parentNode;
        inputAncestor = inputAncestor.parentNode;
      }      
       
      // return to yield
      return;
    };

    var capture = function() {
      // start capturing markup written to document.write and document.writeln,
      // by replacing the functions with methods domWrite and domWriteln from
      // this module
      //
      // In order to preserve any replacement function already set to write or
      // writeln, the capturing functions domWrite and domWriteln are only set
      // if the corresponding property is still equal to the original browser 
      // function (saved as reference in a variable when this module loaded).
      //
      // For example, if document.write has already been replaced by a function
      // defined by bezen.ready to capture the script defer hack, while
      // document.writeln is still the original browser function, the former
      // will be preserved, and the latter set to the domWriteln function.
       
      var dom = document;
      if (dom.write===originalDocumentWrite){
        dom.write = domWrite;
      }
      if (dom.writeln===originalDocumentWriteln){
        dom.writeln = domWriteln;
      }
    };
     
    // Note: already declared before use by loadPiecemeal:
    // these two methods are mutually recursive
    render = function(parent, callback) {
      // load markup collected by domWrite in a progressive way,
      // to simulate document.write: after loading a script, 
      // any markup collected is first loaded and appended at current location,
      // then the processing of remaining markup is resumed. 
      //
      // params:
      //   parent - (DOM element) (optional) (default: document.body) the parent 
      //            to append new markup to
      //   callback - (function) (optional) (default: bezen.nix) function to
      //              call after successful loading of the complete markup
      //
      // Note: 
      //   In case no markup has been collected, the callback fires immediately.
      //
      if (parent instanceof Function) {
        // callback provided as first parameter, no parent provided
        callback = parent;
        parent = document.body;
      } else {
        parent = parent || document.body;
        callback = callback || nix;
      }
      
      var markup = collectMarkup();
      if (markup===null) {
        callback();
      } else {
        loadPiecemeal(parent, parseMarkup(markup), callback);
      }
    };
    
    var restore = function(){
      // restore the original browser functions (saved in variables during the
      // loading of this module) to document.write and document.writeln
      
      document.write = originalDocumentWrite;
      document.writeln = originalDocumentWriteln;
    };
    
    // Assign to bezen.domwrite
    // for backward compatibility
    bezen.domwrite = { // public API
      capture: capture,
      parseMarkup: parseMarkup,
      render: render,
      restore: restore,
       
      _: { // private section, for unit tests
        markupArray: markupArray,
        domWrite: domWrite,
        domWriteln: domWriteln,
        collectMarkup: collectMarkup,
        isJavascriptScript: isJavascriptScript,
        appendScriptClone: appendScriptClone,
        loadPiecemeal: loadPiecemeal
      }
    };
    return bezen.domwrite;
  }
);
/*
 * bezen.focus.js - focus a DOM element
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global document */
define('bezen.focus',["./bezen"],
  function(bezen) {
  
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
     
    // Assign to bezen.focus
    // for backward compatibility
    bezen.focus = { // public API
      
      init: initFocus,
      focus: focus,

      _: { // private section, for unit tests
      }
    };
    return bezen.focus;
  }
);
/*
 * bezen.load.js - Dynamic script loading utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global bezen, setTimeout, document */
define('bezen.load',["./bezen", "./bezen.array", "./bezen.object", "./bezen.dom"],
  function(bezen,  array,           object,           dom){
  
    // Define aliases
    var nix = bezen.nix,
        isString = object.isString,
        unshift = array.unshift,
        appendScript = dom.appendScript,
        element = dom.element;
     
    var loadScript = function(parent, attributes, callback, delay) {
      // create a dynamic script element in given location
      //
      // params:
      //   parent - (DOM element) (optional) (default: document.body) parent to 
      //            append the dynamic script element to
      //
      //   attributes - (object or string) (!nil) object with properties 
      //                corresponding to the attributes of the script to create,
      //                including at least the mandatory "src" attribute;
      //                alternatively a string with the "src" attribute value.
      //
      //   callback - (function) (optional) (default: bezen.nix) the callback to
      //              trigger after the script has successfully loaded
      //
      //   delay - (integer) (optional) (default: 0) waiting delay, in 
      //           milliseconds, in the setTimeout prior to the insertion of 
      //           the new script in DOM
      //
      // Note:
      //   Firefox waits for a 250ms delay before the initial paint of the page,
      //   a tradeoff to avoid some reflows while loading data that changes the
      //   contents and layout of the page. In order to give some breeze to the
      //   browser before loading dynamic scripts, the delay of the first script
      //   in the chain should be set to a value higher than 250ms. On the 
      //   contrary, the scripts that provide core functionalities of your web
      //   site should be loaded with a static script tag or a delay of 0ms.
      //
      //   You may want to wait for a user action to start the dynamic loading;
      //   the description of the Google Fade In Effect, although it is not used
      //   for the purpose of dynamic script loading, is a good illustration of
      //   this technique:
      //
      //        Fade In Effect in Google Home Page
      //    
      //   At the end of 2009, Google changed its own page to display only the
      //   core UI at first (the logo, search form and sometimes a featured ad), 
      //   and load the rest of the page dynamically, with a fade in.
      //
      //   The fade is triggered when the mouse moves or when the focus leaves
      //   the search input box by pressing the tab key (but it will not get
      //   triggered if you just input keywords and validate with enter):
      //
      //   www.google.com
      //   <!doctype html><html onmousemove="google&&google.fade&&google.fade()">
      //   (...)
      //   <input autocomplete="off" onblur="google&&google.fade&&google.fade()"
      //   (...)
      //   <form action="/search" name=f onsubmit="google.fade=null">
      //   (...)
      //
      //   Google also uses dynamic script loading on its home page, but it is 
      //   not triggered by this mechanism. The dynamic loading code is called
      //   in a setTimeout with a delay of 0ms, from an internal script at the
      //   end of the page.
      //
      // Reference:
      //   nglayout.initialpaint.delay - MozillaZine Knowledge Base
      //   http://kb.mozillazine.org/nglayout.initialpaint.delay
      //
      if ( parent && !parent.nodeType ) {
        // optional parent omitted, add null parent first and shift arguments
        unshift(arguments,null);
        return loadScript.apply(null,arguments);
      }
      if ( isString(attributes) ) {
        return loadScript(parent, {src:attributes}, callback, delay);
      }
      callback = callback || nix;
      parent = parent || document.body;
      delay = delay || 0;
       
      // Note: setTimeout allows Firefox to behave like IE and Safari for
      // asynchronous loading, and take the burden off the onload thread to
      // improve user experience, by letting user events fire: scrolling, click 
      // for navigation...
      //
      // Reference:
      // http://www.artzstudio.com/2008/07
      //                          /beating-blocking-javascript-asynchronous-js/
      setTimeout(function(){
        appendScript(parent, element("script", attributes), callback);
      },delay);
    };
     
    var getSingleCallback = function(total, callback) {
      // get a unique callback for a set of listeners
      // The intent is to wait for all listeners before triggering the
      // provided callback function. This is done by setting the one
      // callback returned by this function to each listener.
      //
      // Note: all listeners must fire for the provided callback to be called
      //
      // params:
      //   total - (integer) (!nil) the number of listeners to wait for
      //   callback - (function) the callback function
      //
      // return:
      //   the expected single callback function if the callback is defined,
      //   bezen.nix otherwise
      // 
      if (!callback) {
        return nix;
      }
       
      var count = 0;
      return function() {
        count++;
        if (count < total) {
          return;
        }
        callback();
      };
    };

    var loadScripts = function(parent, attributesArray, callback, delay) {
      // load a set of external scripts in parallel
      // 
      // params:
      //   parent - (DOM element) (optional) (default: document.body) the parent
      //            to append dynamic scripts elements to
      //
      //   attributesArray - (array) (!nil) a list of objects with properties
      //                     corresponding to the attributes of scripts to
      //                     create, including at least the "src" attribute
      //                     Alternatively an array of strings corresponding
      //                     to the "src" attribute value for each script.
      //
      //   callback - (function) (optional) (default: bezen.nix) the callback to
      //              trigger after all scripts have successfully loaded
      //
      //   delay - (integer) (optional) (default: 0) waiting delay, in 
      //           milliseconds, in the setTimeout prior to the insertion of 
      //           each new script element in DOM
      if (parent && !parent.nodeType) {
        // optional parent omitted, add null parent first and shift arguments
        unshift(arguments,null);
        return loadScripts.apply(null,arguments);
      }
       
      var commonCallback = getSingleCallback(attributesArray.length, callback);
      for (var i=0; i<attributesArray.length; i++) {
        loadScript(parent, attributesArray[i], commonCallback, delay);
      }
    };

    // Assign to bezen.load
    // for backward compatiblity
    bezen.load = { // public API
      script: loadScript,
      scripts: loadScripts,
      
      _: { // private section, for unit tests
        getSingleCallback: getSingleCallback
      }
    };
    return bezen.load;
  }
);
/*
 * bezen.log.js - Logging methods
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * Log is intended for (local) debugging purpose and is not sent back to 
 * the server.
 *
 * It is printed on 'console.log' if available, on 'jash.print' if defined,
 * in innerHTML of DOM element with id 'bezen.log' if present, and stored
 * in the variable bezen.log.records[level] up to 100 records in any case.
 *
 * Usage:
 *   log.on();                    // enable logging
 *   log.info('message');         // message
 *   log.warn('message');         // Warning: message
 *   log.error('message');        // [ERROR] message
 *   log.off();                   // stop logging from here
 *
 * Note:
 *   - logging is turned off by default, thus all calls to info(), warn()
 *     and error() will be silently ignored, unless the second argument,
 *     alwaysOn, is set to true, which should be done for unexpected 
 *     errors.
 *   - It can be turned on and off again by calling log.on() and log.off()
 *   - logging can also be enabled/disabled a the level of a single message,
 *     by setting the localOnOff switch in last parameer to true/false.
 *     This is especially useful for debug messages with following pattern:
 *       var debug = false;
 *       log.info('message',debug);
 *       log.warn('message',debug);
 *       log.error('message',debug);
 *     Setting the local variable to true will display the messages
 *     whatever the status of global on()/off() switch is currently.
 *
 * In order to take advantage of more powerful features provided by Firebug 
 * console, objects, functions, ... should be provided as separate parameters
 * in the call. Instead of the typical usage pattern using concatenation
 *   log.warn('Issue detected with '+object+' in callback '+callback);
 * provide a list of separate arguments, replacing the + with a ,
 *   log.warn('Issue detected with ',object,' in callback ',callback);
 *
 * This usage pattern is compatible with the localOnOff switch: if more
 * than one parameter is provided, and the last parameter is a boolean,
 * it is considered as the localOnOff switch and not printed in logs:
 *   // force log with localOnOff switch set to true in last param
 *   log.error('Issue detected with '+object+' in callback '+callback,true);
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define, window, document */
define('bezen.log',["./bezen", "./bezen.object", "./bezen.array"],
  function(bezen,  object,           array) {
   
    // Define aliases
    var $ = bezen.$,
        exists = object.exists,
        pop = array.pop,
        unshift = array.unshift;
     
    var MAX_RECORDS = 100;
    var DOM_LOG_ID = 'bezen.log';
    
    // log records
    var records = [];
    
    var ON  = true;
    var OFF = false;
    var globalOnOff = OFF;
    var on = function()  { globalOnOff = ON;  };
    var off = function() { globalOnOff = OFF; };

    var isOn = function(localOnOff) {
      // check whether a message should be logged or not,
      // based on local and global status
      //
      // param:
      //   localOnOff - (boolean) always display this message if true,
      //                always hide this message if false,
      //                hide or show based on global on()/off() if missing 
      //
      // return:
      //   true if localOnOff is ON
      //   false if localOnOff is OFF
      //   globalOnOff otherwise
      //
      
      if (localOnOff === ON) {
        return true;
      }
        
      if (localOnOff === OFF) {
        return false;
      }
       
      return globalOnOff;
    };
    
    var log = function() {
      // log message:
      //   * on Firebug/Jash console if available,
      //   * in $('bezen.log') if present
      //   * and in log.records, up to 100 (MAX_RECORDS) records.
      // params:
      //   ... - (string, object, boolean, ...) messages for the logs
      //
      // Note: the arguments will be concatenated to a single string for records
      //       and Jash console, but will be provided as separated parameters to
      //       Firebug console, which then provides clickable links for objects.
      //       In case window.console is defined without the firebug property,
      //       e.g. with Safari console, the full string is printed as well.
       
      var message = arguments[0];
      for (var i=1; i<arguments.length; i++) {
        message += arguments[i];
      }
        
      if ( records.length < MAX_RECORDS ) {
        records.push(message);
      }
       
      if ( exists(window,'jash','print') ) {
        window.jash.print(message);
      }
       
      if ( exists(window,'console','log') ) {
        var console = window.console;
        if ( exists(console,'firebug') ) {
          console.log.apply(this,arguments);
        } else {
          console.log(message);
        }
      }
       
      var logDiv = $(DOM_LOG_ID);
      if ( exists(logDiv) ) {
        logDiv.appendChild( document.createTextNode(message) );
        logDiv.appendChild( document.createElement('br') );
      }
    };
    
    var logIfOn = function() {
      // log a message based on local and global on/off switches
      //
      // params:
      //   ... - (string, object, boolean, ...) messages for the logs. In case
      //         the last parameter is a boolean, it is considered as localOnOff
      //         and not printed in logs, unless this is the *only* parameter:
      //         the first parameter is always considered as a message to log.
      //         Example:
      //           on();
      //           logIfOn( true );      // log(true)
      //           logIfOn( true, true); // log(true), not log(true, true)
      //
      //   localOnOff - (boolean) (optional) always log this message if true,
      //                always ignore this message if false, otherwise
      //                log or ignore based on global on()/off().
      //                Example:
      //                  on();
      //                  logIfOn("message"); // log("message")
      //                  logIfOn("message",false); // force to ignore
      //                  off();
      //                  logIfOn("message"); // ignore
      //                  logIfOn("message", true); // force to log
        
      if ( arguments.length>1 && 
           typeof arguments[arguments.length-1] === 'boolean' ) {
        var localOnOff = arguments[arguments.length-1];
        if ( isOn(localOnOff) ) {
          pop(arguments);
          log.apply(null,arguments);
        }
      } else {
        if ( isOn() ) {
          log.apply(null,arguments);
        }
      }
    };
     
    var info = function() {
      // Log an information message.
      //
      // params:
      //   ... - (string, object, boolean, ...) messages for the logs. In case
      //         the last parameter is a boolean, it is considered as localOnOff
      //         and not printed in logs, unless this is the *only* parameter:
      //         the first parameter is always considered as a message to log.
      //         Example:
      //           on();
      //           info( true );      // log(true)
      //           info( true, true); // log(true), not log(true, true)
      //
      //   localOnOff - (boolean) (optional) always log this message if true,
      //                always ignore this message if false, otherwise
      //                log or ignore based on global on()/off().
      //                Example:
      //                  on();
      //                  info("message"); // log("message")
      //                  info("message",false); // force to ignore
      //                  off();
      //                  info("message"); // ignore
      //                  info("message", true); // force to log
      
      logIfOn.apply(null,arguments);
    };

    var warn = function(message,localOnOff) {
      // Log a warning message.
      //
      // params:
      //   ... - (string, object, boolean, ...) messages for the logs. In case
      //         the last parameter is a boolean, it is considered as localOnOff
      //         and not printed in logs, unless this is the *only* parameter:
      //         the first parameter is always considered as a message to log.
      //         Example:
      //           on();
      //           warn( true );      // log("Warning: ",true)
      //           warn( true, true); // log("Warning: ",true),
      //                              // not log("Warning: ",true, true)
      //
      //   localOnOff - (boolean) (optional) always log this message if true,
      //                always ignore this message if false, otherwise
      //                log or ignore based on global on()/off().
      //                Example:
      //                  on();
      //                  warn("message"); // log("Warning: ","message")
      //                  warn("message",false); // force to ignore
      //                  off();
      //                  warn("message"); // ignore
      //                  warn("message", true); // force to log
      
      unshift(arguments,'Warning: ');
      logIfOn.apply(null,arguments);
    };

    var error = function(message,localOnOff) {
      // Log an error message.
      //
      // params:
      //   ... - (string, object, boolean, ...) messages for the logs. In case
      //         the last parameter is a boolean, it is considered as localOnOff
      //         and not printed in logs, unless this is the *only* parameter:
      //         the first parameter is always considered as a message to log.
      //         Example:
      //           on();
      //           error( true );      // log("[ERROR] ",true)
      //           error( true, true); // log("[ERROR] ",true),
      //                               // not log("[ERROR ] ",true,true)
      //
      //   localOnOff - (boolean) (optional) always log this message if true,
      //                always ignore this message if false, otherwise
      //                log or ignore based on global on()/off().
      //                Example:
      //                  on();
      //                  error("message"); // log("[ERROR] ","message")
      //                  error("message",false); // force to ignore
      //                  off();
      //                  error("message"); // ignore
      //                  error("message", true); // force to log
      
      unshift(arguments,'[ERROR] ');
      logIfOn.apply(null,arguments);
    };
    
    var view = function(offset, end) {
      // return a multi-line string showing all logs in the following format:
      //   1. ...\n
      //   2. Warning: ...\n
      //   4. [ERROR] ...\n
      //   5. ...\n
      //   6. ...\n
      //   ...
      //
      // A simple bookmarlet may be defined to display this string in any
      // browser, using window.alert:
      //   javascript:window.alert(bezen.log.view())
      //
      // Two optional parameters allow to limit the number of records displayed:
      // params:
      //   offset - (string) (default:0) number of records to skip
      //   end - (string) (default:records.length) highest position of record
      //         to display. This value will be capped at records.length.
      //
      // The above bookmarklet may be rewritten to display only first 10 records
      //   javascript:window.alert(bezen.log.view(0,10))
      // and then modified to read the records 10 to 50
      //   javascript:window.alert(bezen.log.view(10,50))
      offset = offset || 0;
      end = end || records.length;
      if (end > records.length) {
        end = records.length;
      }
       
      var lines = '';
      for (var i=offset; i<end; i++) {
        lines += (i+1)+'. '+records[i]+'\n';
      }
       
      return lines;
    };

    // Assign to bezen.log
    // for backward compatibility
    bezen.log = {
      // public API
      on: on,
      off: off,
      info: info,
      warn: warn,
      error: error,
      view: view,
       
      _: { // private section, for unit tests
        isOn: isOn,
        log: log,
        logIfOn: logIfOn,
        globalOnOff: globalOnOff,
        records: records
      }
    };

    return bezen.log;
  }
);
/*
 * bezen.mainloop.js - Main Loop
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * The main loop concept is frequently used in Video Games: it is an infinite
 * loop that lasts for the whole duration of the application. Each run of the 
 * loop triggers actions to update the state of the game and its rendering.
 *
 * The main loop concept implemented here is slightly different: actions can
 * be added and removed, and listen to messages sent by other actions. In the
 * default mode, a callback function will only be triggered when a new message
 * is received. In order to trigger an action on each run, it must be set up
 * as 'always on' during initial add.
 *
 * The intent of this module is to allow late/dynamic loading of recurring 
 * functionalities.
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global bezen, window, setTimeout */
define('bezen.mainloop',["./bezen", "./bezen.error"],
  function(bezen,  error) {
 
    // Declare aliases
    var catchError = error.catchError;

    // the delay between two run of the main loop, in milliseconds
    var msLoopDelay;
     
    // The list of actions called in the main loop.
    // Each action is stored as an object with
    // {
    //   'send' - (function) the listener function to trigger; will be called
    //            with a message as parameter.
    //   'name' - (string) the action name, used in logs and for its removal
    //   'isAlwaysOn' - (boolean) false for default mode, true for 'always on'.
    //                  The default behavior is to run the action only once each
    //                  time a new message is received. If true, the action will
    //                  run in every loop.
    //   'lastMessage' - (any) the last message received
    // }
    var actions = [];
    
    // the queue of new messages received (First In First Out).
    // A message may be any scalar / object / array value.
    var messages = [];
     
    // the current message, which will be sent immediately to new actions, and
    // will be sent repeatedly to actions in 'always on' mode.
    // A message stays current until the end of a loop when all registered 
    // actions have received it and a new message is available.
    var currentMessage = null;
     
    var addAction = function(listener, name, isAlwaysOn) {
      // Add given listener action (a function) to the list of loop actions
      // to be executed in the main loop.
      //
      // params:
      //   listener - (function) listener for the action. The function will be
      //              called with the current message as parameter.
      //   name - (string) name of the action, for removal and logs
      //   isAlwaysOn - (optional) (boolean) (default: false) whether this 
      //                action should run at each loop (true) or only one time
      //                for each new message (default behavior, false)
      //
      // return: (object)
      //   the action object 
      isAlwaysOn = isAlwaysOn || false;
       
      var safelistener = catchError(listener,name);
      var action = {
        send: safelistener,
        name: name,
        isAlwaysOn: isAlwaysOn,
        lastMessage: null
      };
       
      actions.push(action);
      return action;
    };
     
    var removeAction = function(name){
      // remove the action with given name
      //
      // Note:
      //   in case duplicate actions are added with the same name, only the 
      //   first one will be removed
      //
      // param:
      //   name - (string) the action name
      //
      // return: (object)
      //   the removed action object if found,
      //   null otherwise
       
      for (var i=0; i<actions.length; i++){
        var action = actions[i];
        if (action.name===name){
          actions.splice(i,1);
          return action;
        }
      }
      return null;
    };
     
    var postMessage = function(message){
      // post a new message for broadcast to loop actions
      //
      // This message will be sent to all loop actions in the next run of the
      // main loop after all preceding messages have been sent.
      //
      // param:
      //   message - (any) the message to broadcast
      
      // push it to the queue
      messages.push(message);
    };
     
    var broadcastMessage = function(message){
      // broadcast a new message to loop actions
      //
      // All loop actions will receive a new message if it's different than the
      // last one they got, only actions in 'always on' mode will receive it 
      // otherwise.
      //
      // param:
      //   message - (any) the message to broadcast
       
      for (var i=0; i<actions.length;i++) {
        var action = actions[i];
        if ( action.isAlwaysOn || 
             action.lastMessage !== message ) {
          action.send(message);
          action.lastMessage = message;
        }
      }
    };
    
    var getCurrentMessage = function(previousMessage){
      // get the current message to broadcast
      //
      // The first message will be removed from the queue to become the current
      // message for broadcasting, unless the queue is empty. In this case the
      // previous message given as parameter is returned.
      //
      // param:
      //   previousMessage - (any) the previous current message
      //
      // return:
      //   the first message removed from the queue, if there was one,
      //   or the previous message given as parameter otherwise
      
      if (messages.length>0) {
        return messages.shift();
      } else {
        return previousMessage;
      }
    };
     
    var mainloop = function() {
      // run the mainloop, recursively, forever
      //
      // Each registered action will be called during a run of the loop,
      // depending of its configured mode:
      //   * 'always on' actions will run on each run
      //   * otherwise, an action will only run if a new message is broadcast
      //
      // New messages sent during the run of a loop will be queued to run in
      // following loops. A single message is sent to registered actions during
      // each loop.
      //
      // Notes:
      //   * the current message is initially null, like the lastMessage
      //     property of actions after initial add. Thus actions in default mode
      //     will not get triggered until the first non-null message is received.
      //   * there is currently no way to stop the main loop. It will run 
      //     for the whole duration of the page's lifetime.
      
      currentMessage = getCurrentMessage(currentMessage);
      broadcastMessage(currentMessage);
       
      setTimeout(mainloop,msLoopDelay);
    };
     
    var start = function(delay) {
      // start the main loop with configured delay
      //
      // param:
      //   delay - (integer) the delay between two loops, in milliseconds.
      //           The delay is fixed. There is currently no way to change it
      //           after the start of the loop.
       
      msLoopDelay = delay; 
      // start to run the loop (forever)
      mainloop();
    };
     
    // Assign to bezen.mainloop
    // for backward compatibility
    bezen.mainloop = { // public API
      addAction: addAction,
      removeAction: removeAction,
      postMessage: postMessage,
      start: start,
       
      _: { // private section, for unit tests
        actions: actions,
        messages: messages,
        broadcastMessage: broadcastMessage,
        getCurrentMessage: getCurrentMessage,
        mainloop: mainloop
      }
    };
    return bezen.mainloop;
  }
);
/*
 * bezen.ready.js - Detection and Simulation of DOM ready and page load
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * This module is obviously inspired by ready() in John Resig's jQuery, and 
 * one of its goals is to allow the dynamic loading of Javascript libraries of
 * its kind.
 *
 * After loading this script in a static way, call capture() to detect the 
 * readiness of the DOM using listeners for various events. You may also load
 * this module dynamically after page load, in which case you will have to
 * force it to a readyState with beReady(). This is needed to set the 
 * document.readyState property to 'complete' for browsers such as Firefox 2, 
 * Firefox 3 and Firefox 3.5 which do not support document.readyState.
 * Note that in Safari and IE, the document.readyState property cannot be 
 * modified; in these browsers, beReady() will have no effect. In any case,
 * no listener will be triggered until the document.readyState property has
 * been set to 'complete'.
 *
 * After calling capture(), listeners added to detect the "load" related 
 * events are collected by this module instead, to be triggered all at once 
 * either as soon as the document gets in a ready state by itself, or by 
 * calling simulate() to trigger the listener methods registered, too late, 
 * by scripts loaded dynamically. Calling simulate() before the document is 
 * considered ready has no effect.
 *
 * In order to prevent errors when running the listeners, each listener 
 * function is wrapped individually in a try/catch with catchError(), a method
 * from defined by the module bezen.error, which forwards any caught error to 
 * the window.onerror handler for all browsers, even those without native 
 * support for window.onerror.
 * 
 * It is also possible to declare your own listener for the ready state, by
 * setting a function of your choice to addListener(), with an optional 
 * description (e.g. the function name) used in error logs.
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global window, document */
define('bezen.ready',["./bezen", "./bezen.dom", "./bezen.domwrite"],
  function(bezen,  dom,           domwrite) {
  
    // Define aliases
    var parseMarkup = domwrite.parseMarkup,
        hasAttribute = dom.hasAttribute,
    // original browser functions, wrapped and replaced with custom functions in
    // the capture method. Initialized by init() call in capture().
        windowAddEventListener,
        documentAddEventListener,
        windowAttachEvent,
        documentAttachEvent,
    // original functions found in document.write and document.getElementById,
    // wrapped and replaced with custom functions in the captureScriptDeferHack
    // method. The document.write function will actually be a reference to the 
    // replacement function provided by the module bezen.domwrite.
        domWrite,
        documentGetElementById;
     
    // the listeners to trigger on ready state
    var listeners = [];
     
    // the defer scripts captured by the filter set in place on document.write
    // by captureDeferScriptHack() to detect the defer script hack.
    // These scripts will be returned by getElementById when the id matches.
    // Typical script properties at the end of the hack:
    //   id: '__ie_onready',             // set by filterDomWrite
    //   onreadystatechange: function(){ // set by client code, after retrieving
    //                                   // the fake script with getElementById
    //     // (...)
    //   },
    //   readyState: 'complete'          // set by collectScriptDeferHack before
    //                                   // wrapping and adding the handler to 
    //                                   // the set of listeners to trigger
    var deferScripts = [];
     
    var init = function(){
      // initialize the references to original browser functions
      // addEventListener and attachEvent (depending on browser support)
      // on window and document.
      //
      // Note: I added this method, instead of using direct initialization in
      //       the above declaration of the variables, to make the filtering
      //       functions testable: it is intended to be called in unit tests 
      //       after setting stub functions to replace browser methods, or after
      //       restoring the original browser functions.
       
      windowAddEventListener = window.addEventListener;
      documentAddEventListener = document.addEventListener;
      windowAttachEvent = window.attachEvent;
      documentAttachEvent = document.attachEvent;
    };
     
    var isReady = function(){
      // check whether the document is in a ready state
      //
      // The check is performed on the readyState property of the document,
      // expected to be "complete". This property will be set to "complete"
      // either by the browser itself, by the detection of document readiness
      // in this module, following a call to capture(), or forced to "complete"
      // by calling beReady().
      //
      // return: (boolean)
      //   true if the document is considered ready,
      //   false otherwise
      
      return document.readyState === 'complete';
    };
     
    var beReady = function(){
      // force the document to a ready state, by setting its readyState property
      // to "complete"
      //
      // This method is exposed to allow to bypass the detection of the document
      // readiness in case this module is loaded dynamically, after the page
      // load. It must only be called when there is sufficient proof that the
      // document is ready, e.g. after one of the 'DOMContentLoaded' or 'load'
      // events occurred.
      //
      // It is inspired by a technique described by Andrea Giammarchi on his 
      // blog, and incorporated by Kyle Simpson in LABjs 1.0rc4:
      // 
      // Web Reflection - 195 Chars to Help Lazy Loading - Andrea Giammarchi
      // http://webreflection.blogspot.com/2009/11
      //                                  /195-chars-to-help-lazy-loading.html 
      //
      // LABjs - release notes - Kyle Simpson
      // http://labjs.com/releasenotes.php 
      //
      // In Safari and IE, the document.readyState property cannot be modified.
      // Trying to delete or modify the property results in no change in Safari
      // and in an error in IE. Taking this into account and following the
      // example provided by Andrea Giammarchi in his article, I chose to ignore
      // the call to beReady() when document.readyState property is present.
      if (document.readyState){
        return;
      }
       
      document.readyState = "complete"; 
    };
     
    var addListener = function(listener, description){
      // add a listener to be triggered when the document is ready
      //
      // The listener will be called either:
      // * during the first of the 'DOMContentLoaded' or 'load' events reported
      //   by the browser after capture() was started
      // * during the first following call to simulate()
      //
      // Note:
      //   No new listener will be added in case the listener parameter is null
      //   or undefined, or if it is an object andd listener.handleEvent is null
      //   or undefined.
      //
      // params:
      //   listener - (object or function) (!nil) the listener function, or an 
      //              object with a handleEvent(event) function (that is the 
      //              EventListener interface defined by W3C DOM level 2), to be
      //              triggered when the document becomes ready or simulate() 
      //              is called.
      //              
      //              In browsers that support the DocumentEvent interface by
      //              providing a document.createEvent method, an event 
      //              parameter will be provided to the listener function when 
      //              triggered, either coming from the browser or created with 
      //              DocumentEvent.createEvent() to match the expectations of 
      //              the EventListener interface in case no event is provided 
      //              by the browser at this stage (e.g. in window.onload).
      //  Limitation: the following read-only properties will remain to their 
      //              default values on this created event:
      //                eventPhase - 0 (N/A), instead of 2 (AT_TARGET)
      //                currentTarget - null, instead of document
      //              
      //              In browsers of the IE family, which define the method
      //              document.createEventObject(), an event will be made 
      //              available for the duration of the call to the listener in 
      //              the window.event property, either the one provided by the 
      //              browser or a new one created using document.createEvent() 
      //              to match the possible expectations of listeners registered
      //              with attachEvent(). 
      // 
      //  References: Interface EventListener (introduced in DOM Level 2) - W3C
      //              http://www.w3.org/TR/DOM-Level-2-Events/events.html
      //                                                #Events-EventListener
      //
      //              Interface DocumentEvent (introduced in DOM Level 2) - W3C
      //              http://www.w3.org/TR/DOM-Level-3-Events/
      //                              #events-Events-DocumentEvent-createEvent
      //
      //              event Object (window) - MSDN 
      //              http://msdn.microsoft.com/en-us/library
      //                                             /ms535863(VS.85).aspx 
      //
      //              createEventObject Method (document, ...) - MSDN
      //              http://msdn.microsoft.com/en-us/library
      //                                             /ms536390(VS.85).aspx
      //
      //   description - (string) (optional) (default: 'bezen.onready')
      //              description of the listener for optional error logging
      //              given that bezen.error is available. In calls within this 
      //              module, the following descriptions are used:
      //
      //                * 'window.onload'
      //                  for a handler found on window.onload, or added with
      //                  window.attachEvent
      //
      //                * 'window.load'
      //                  for a listener of 'load' event added with 
      //                  window.addEventListener
      //
      //                * 'document.load'
      //                  for a listener of 'load' event added with
      //                  document.addEventListener
      //
      //                * 'document.DOMContentLoaded'
      //                  for a listener of 'DOMContentLoaded' event added with 
      //                  document.addEventListener
      //                   
      //                * 'document.onreadystatechange'
      //                  for a listener of 'onreadystatechange' added with
      //                  document.attachEvent
      //
      if ( !listener ||
           (typeof listener==='object' && !listener.handleEvent) ){
        return;
      }
      listener = listener.handleEvent || listener;
      description = description || 'bezen.onready';

      var error = require("bezen.error");

      var safelistener = 
        error?
        error.catchError(listener,description):
        listener;
       
      listeners.push(safelistener); 
    };

    var collectScriptDeferHack = function(){
      // collect all handlers attached to defer scripts captured as potential 
      // use of the script defer hack, and add these functions to listeners
      //
      // Since these handler functions check the value of the script.readyState
      // property on 'this', and trigger some code when it reaches 'complete',
      // we take two steps to ensure that this.readyState equals 'complete':
      //
      //   1°) set the readyState property of the script to 'complete' by hand
      //
      //   2°) wrap the handler in a function that applies the handler to the
      //       script, making 'this' a reference to the fake script inside the
      //       handler code: function(){ handler.apply(script,arguments); }
      //
      // This approach also ensures that the readyState property is found as
      // expected if the script is accessed through a reference in a variable:
      //   var script = document.getElementById('__ie_onready');
      //   script.onreadystatechange = function(){
      //     if (script.readyState === 'complete'){
      //       init();
      //     }
      //   };
      //
      // However, 
      //
      // Notes:
      //   - in current implementation, the script is removed from the set, and
      //     will no longer be returned by getElementById from this point.
      //   - when no onreadystatechange function is found on a script, it is
      //     discarded without further action
       
      var wrapHandler = function(script, handler){
        // wrap a handler in a closure function
        //
        // Notes:
        //   - this code cannot be inlined in the loop below, because the
        //     handler variable is in the lexical scope of the whole function,
        //     not of a single iteration of the loop, and is shared by all
        //     closures that would be created within the loop.
        //
        //   - on the other hand, this method is a function factory which 
        //     creates closures that do not share the same environment: each
        //     new call creates a new runtime environment with a new set of
        //     local variables/parameters.
        //
        // Reference:
        //   Working with Closures - MDC
        //   https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide
        //                                   /Working_with_Closures
        //
        // param:
        //   script - (object) the (fake) script object, used to set the 
        //            readyState property to 'complete' before calling the 
        //            handler function
        //   handler - (function) the handler to wrap in a closure
        //
        // return: (function)
        //   a new closure function that sets the script.readyState to 'complete'
        //   then calls the handler function
         
        return function(){
          script.readyState = 'complete';
          handler.apply(script,arguments);
        }; 
      };
       
      while (deferScripts.length>0){
        var script = deferScripts.pop();
        var handler = script.onreadystatechange;
        if (typeof handler==='function'){
          addListener( wrapHandler(script,handler) );
        }
      }
    };
     
    var filterWindowAttachEvent = function(type, listener){
      // filter window.attachEvent, keeping track of listeners for the 'onload'
      // event in this module instead of relying on the browser's function.
      //
      // Listeners for other events are forwarded to the browser's function as
      // is. If this method is used in a browser that does not define 
      // window.attachEvent, all calls for other events will be ignored.
      //
      // params: (same as document.attachEvent)
      //   type - (string) (!nil) the type of DHTML event, e.g. 'onload'.
      //          See complete reference for details (in DHTML Event - MSDN).
      //
      //   listener - (function) (!nil) the listener function to register for
      //              the given type of event. The function will be triggered
      //              when events of this type fire on the document.
      //
      // return: (boolean) (same as window.attachEvent)
      //   true when the listener was successfully registered for the event,
      //   false when the listener was not registered
      //
      // References:
      //   attachEvent Method - MSDN
      //   http://msdn.microsoft.com/en-us/library/ms536343(VS.85).aspx
      //
      //   DHTML Events - MSDN
      //   http://msdn.microsoft.com/en-us/library/ms533051(VS.85).aspx 
       
      if (type==="onload"){
        // manage the listener by ourselves
        addListener(listener,'window.onload');
        return true; // successful bind
      } else {
        // forward other calls to the native window.attachEvent, if defined
        if (windowAttachEvent){
          // Note: windowAttachEvent is not a real function in IE:
          //       typeof window.attachEvent is 'object' and both
          //       window.attachEvent.call and window.attachEvent.apply are
          //       undefined. This is not the case in Opera, where 
          //       window.attachEvent is a regular function
          return windowAttachEvent(type, listener); 
          // Fails in IE: window.attachEvent.apply is undefined
          // return windowAttachEvent.apply(document,arguments);
        } else {
          return false;
        }
      } 
    };

    var filterWindowAddEventListener = function(type, listener, useCapture) {
      // filter window.addEventListener, keeping track of listeners for 'load' 
      // event in this module instead of relying on the browser's function.
      //
      // Listeners for other events are forwarded to the browser's function as
      // is. If this method is used in a browser that does not define 
      // window.addEventListener, all calls for events different than 'load'
      // will be ignored.
      //
      // params: (same as window.addEventListener)
      //   type - (string) the event type to listen to
      //   listener - (object or function) the object or function to register
      //              as listener for events of the given type. In case an 
      //              object is provided it must provide a method 
      //              handleEvent(evt). In both cases, an Event object will be
      //              passed as parameter when the listener is triggered,
      //              providing contextual information about the event.
      //   useCapture - (boolean) true to specify a listener for the capture
      //              phase only (not during the target and bubbling phases),
      //              false to specify a listener for the target and bubbling
      //              phases.
      //
      // References:
      //   element.addEventListener - Mozilla Developer Center
      //   https://developer.mozilla.org/en/DOM/element.addEventListener
      //    
      //   Interface EventListener (introduced in DOM Level 2) - W3C
      //   http://www.w3.org/TR/DOM-Level-2-Events/events.html
      //                                           #Events-EventListener
      //    
      //   Interface EventTarget (introduced in DOM Level 2) - W3C
      //   http://www.w3.org/TR/DOM-Level-3-Events/
      //                        #events-Events-EventTarget-addEventListener
       
      if (type==="load") {
        // manage the listener by ourselves
        addListener(listener,'window.load');
      } else {
        // forward other calls to the native window.addEventListener, if defined
        if (windowAddEventListener){
          windowAddEventListener.apply(window, arguments);
        }
      }
    };
    
    var filterDocumentAddEventListener = function(type, listener, useCapture){
      // filter document.addEventListener, keeping track of listeners for 'load'
      // and 'DOMContentLoaded' events in this module instead of relying on the 
      // browser's function.
      //
      // Listeners for other events are forwarded to the browser's function as
      // is. If this method is used in a browser that does not define 
      // document.addEventListener, all calls for events different than 'load'
      // and 'DOMContentLoaded' will be ignored.
      //
      // params: (same as document.addEventListener)
      //   type - (string) the event type to listen to
      //   listener - (object or function) the object or function to register
      //              as listener for events of the given type. In case an 
      //              object is provided it must provide a method 
      //              handleEvent(evt). In both cases, an Event object will be
      //              passed as parameter when the listener is triggered,
      //              providing contextual information about the event.
      //   useCapture - (boolean) true to specify a listener for the capture
      //              phase only (not during the target and bubbling phases),
      //              false to specify a listener for the target and bubbling
      //              phases.
      //
      // References:
      //   element.addEventListener - Mozilla Developer Center
      //   https://developer.mozilla.org/en/DOM/element.addEventListener
      //    
      //   Interface EventListener (introduced in DOM Level 2) - W3C
      //   http://www.w3.org/TR/DOM-Level-2-Events/events.html
      //                                           #Events-EventListener
      //    
      //   Interface EventTarget (introduced in DOM Level 2) - W3C
      //   http://www.w3.org/TR/DOM-Level-3-Events/
      //                        #events-Events-EventTarget-addEventListener
       
      if (type==="load" || type==="DOMContentLoaded"){
        // manage the listener by ourselves
        addListener(function(){
          // apply the listener function to the document 
          listener.apply(document,arguments);
        },'document.'+type);
      } else {
        // forward other calls to the native document.addEventListener, 
        // if defined
        if (documentAddEventListener){
          documentAddEventListener.apply(document,arguments);
        }
      }
    };
     
    var filterDocumentAttachEvent = function(type, listener){
      // filter document.attachEvent, keeping track of listeners for the
      // 'onreadystatechange' event in this module instead of relying on 
      // the browser's function.
      //
      // Listeners for other events are forwarded to the browser's function as
      // is. If this method is used in a browser that does not define 
      // document.attachEvent, all calls for others events will be ignored.
      //
      // params: (same as document.attachEvent)
      //   type - (string) (!nil) the type of DHTML event, e.g. 'onclick',
      //          'onload', 'onreadystatechange'. See complete reference
      //          for details (in DHTML Event - MSDN).
      //
      //   listener - (function) (!nil) the listener function to register for
      //              the given type of event. The function will be triggered
      //              when events of this type fire on the document.
      //
      // return: (boolean) (same as document.attachEvent)
      //   true when the listener was successfully registered for the event,
      //   false when the listener was not registered
      //
      // References:
      //   attachEvent Method - MSDN
      //   http://msdn.microsoft.com/en-us/library/ms536343(VS.85).aspx
      //
      //   DHTML Events - MSDN
      //   http://msdn.microsoft.com/en-us/library/ms533051(VS.85).aspx 
      
      if (type==="onreadystatechange"){
        // manage the listener by ourselves
        addListener(listener,'document.onreadystatechange');
        return true; // successful bind
      } else {
        // forward other calls to the native document.attachEvent, if defined
        if (documentAttachEvent){
          // Note: documentAttachEvent is not a real function in IE:
          //       typeof document.attachEvent is 'object' and both
          //       document.attachEvent.call and document.attachEvent.apply are
          //       undefined. This is not the case in Opera, where 
          //       document.attachEvent is a regular function, but doing the call
          //       in this way works in Opera as well
          return documentAttachEvent(type, listener); 
          // Fails in IE: document.attachEvent.apply is undefined
          // return documentAttachEvent.apply(document,arguments);
        } else {
          return false;
        }
      }
    };
     
    var onready; // declared in advanced because of mutual use
    var captureWindowOnload = function(){
      // add any handler set on window.onload to listeners for ready state
      // and replace it with the onready handler defined by this module
      //
      // Note: in case the current handler already is onready, nothing happens
      //
      // This method is intended to be called in capture() to replace any 
      // previous handler with onready to make sure that the 'load' event will
      // be detected in all browsers, and in onready() to make sure that any
      // handler set afterward will be added to listeners as well.
       
      var windowOnload = window.onload;
      if ( windowOnload &&
           windowOnload !== onready ){
        addListener(windowOnload,'window.onload');
      }
      window.onload = onready;
    };
    
    onready = function(event){
      // trigger all added/captured listeners
      //
      // This method is set as listener to the 'DOMContentLoaded' and 'load' 
      // events, and as handler on window.onload by capture(). It is also called
      // directly by simulate().
      //
      // See the description of the listener parameter in the addListener method
      // for details of how the event parameter/property provided to listeners
      // will be forwarded or created depending on the browser.
      //
      // Notes:
      //   * if a new handler has been set to window.onload since capture(),
      //     it will be added to the listeners beforehand
      //   * for created events, when no event is available for example during
      //     a call of simulate(), the event type will default to 'load'
      //   * before triggering any listener, a negotiation is done with the
      //     browser by calling beReady() then isReady(). If not ready, in a
      //     browser which defines document.readyState, no listener will be
      //     triggered until the readyState is set to 'complete' by the browser.
      event = event || window.event;
       
      beReady();
      if ( !isReady() ){
        // the browser defines document.readyState, and it has not set it to
        // 'complete' yet. Do not trigger any listener at this point.
        return;
      }
       
      // detach handlers to avoid memory leaks in IE
      if (window.detachEvent){
        window.detachEvent('onload', onready);
      }
      if (document.detachEvent){
        document.detachEvent('onreadystatechange', onready);
      }
       
      if (!event) {
        if (document.createEvent) {
          // References:
          //  document.createEvent - MDC
          //  https://developer.mozilla.org/en/DOM/document.createEvent
          //
          //  Event module definitions - W3C
          //  http://www.w3.org/TR/DOM-Level-2-Events/events.html
          //                                          #Events-eventgroupings  
          event = document.createEvent('HTMLEvents');
          event.initEvent('load',false,false);
          // Note:
          //   the following read-only properties of the created event can only 
          //   be set to expected values by calling document.dispatchEvent, with
          //   the risk of triggering listeners attached to the document before
          //   the capture() method was called a second time, which will happen
          //   unless their developer was forward-thinking enough to call
          //   removeEventListener during first trigger:
          //     target - null, instead of document
          //     currentTarget - null, instead of document
          //     eventPhase - 0 (N/A), instead of 2 (AT_TARGET)
          //   This should not be an issue however, as the 'load' event does not
          //   bubble and the document has no ancestor.
        } else if (document.createEventObject) {
          // The event must be provided in window.event as well. Since this
          // property is ready-only, I use the technique described in Seth 
          // Dillingham's "Creating Custom Events with JavaScript: Decoupling"
          // to fire a custom event, adapted here to fire an 'onreadystatechange'
          // event on a temporary document fragment, instead of firing an 
          // 'onclick' event on a hidden anchor.
          //
          // References:
          //   event Object (window) - MSDN 
          //   http://msdn.microsoft.com/en-us/library/ms535863(VS.85).aspx 
          //
          //   createEventObject Method (document, ...) - MSDN
          //   http://msdn.microsoft.com/en-us/library/ms536390(VS.85).aspx   
          //
          //   Creating Custom Events with JavaScript: Decoupling
          //   by Seth Dillingham
          //   http://www.truerwords.net/articles/web-tech/custom_events.html
          event = document.createEventObject();
          // Fails in IE, the property is read-only
          // window.event = event;
           
          var documentFragment = document.createDocumentFragment();
          documentFragment.attachEvent('onreadystatechange',function(){
            documentFragment.detachEvent('onreadystatechange',arguments.callee);
            window.event.type = 'load';
            onready(event);
          });
          documentFragment.fireEvent('onreadystatechange', event);
          return;
        }
      } 
       
      captureWindowOnload();
      collectScriptDeferHack();
       
      while( listeners.length > 0){
        listeners.shift()(event);
      }
    };
    
    var hasListeners = function(){
      // check whether some listeners remain to be triggered, either captured,
      // or potential listeners to be captured on window.onload or defer scripts
      //
      //
      // return: (boolean)
      //   true if at least one captured listener remains in the set, or if at
      //        least one defer scripts remains to be checked, or if the
      //        window.onload property is defined and different from onready
      //   false otherwise
     
      // return ( listeners.length > 0 ||
      //         deferScripts.length > 0 ||
      //         (window.onload && window.onload !== onready) );
      
      if (listeners.length > 0){
        return true;
      }

      if (deferScripts.length > 0){
        return true;
      }

      if (window.onload) {
        if ( window.onload !== onready ){
          return true;
        }
      }
      return false;
    };
     
    var capture = function(){
      // capture listeners for the 'DOMContentLoaded', 'onreadystatechange',
      // 'onload' and 'load' events, and start listening for these events, and 
      // wrap any existing handler for window.onload in a new handler.
      //
      // The new window.onload handler will trigger any handler previously set
      // and deletes the window.onload property to detect if it gets set to a
      // new handler at a later stage.
      //
      // After calling the capture() method, any function previously set to 
      // window.onload or subsequently attached to the 'DOMContentLoaded' or the 
      // 'load' event will get triggered by bezen.ready as soon as any of the
      // possible hints that the document is ready is detected.
      //
      // The capture() method needs to be called only once, and may be followed
      // by one or several calls to simulate().
      
      init();
      captureWindowOnload();
       
      if ( windowAddEventListener &&
           window.addEventListener !== filterWindowAddEventListener ){
        window.addEventListener('load', onready, false);
        window.addEventListener = filterWindowAddEventListener; 
      }
       
      if ( documentAddEventListener &&
           document.addEventListener !== filterDocumentAddEventListener ){
        document.addEventListener('load', onready, false);
        document.addEventListener('DOMContentLoaded', onready, false);
        document.addEventListener = filterDocumentAddEventListener;
      }
       
      if ( windowAttachEvent &&
           window.attachEvent !== filterWindowAttachEvent ){
        window.attachEvent('onload', onready);
        window.attachEvent = filterWindowAttachEvent; 
      }
       
      if ( documentAttachEvent &&
           document.attachEvent !== filterDocumentAttachEvent ){
        // Note: This handler ignores all values of document.readyState except 
        //       'complete'. This seems in line with Microsoft recommendations 
        //       of usage for this method:
        //
        //         "When working with behaviors, wait for the onreadystatechange 
        //         event to fire and verify that the readyState property of the 
        //         element is set to complete to ensure that the behavior is 
        //         completely downloaded and applied to the element. Until the 
        //         onreadystatechange event fires, if you use any of the 
        //         behavior-defined members before attaching the behavior to the 
        //         element, a scripting error can result, indicating that the 
        //         object does not support that particular property or method."
        document.attachEvent('onreadystatechange', onready);
        document.attachEvent = filterDocumentAttachEvent;
      }
    };
    
    var filterDomWrite = function(markup){
      // filter document.write to detect script defer hack
      //
      // When the hack is detected (a script with id, defer and a strange src,
      // see captureScriptDeferHack for details) a new fake script with given
      // id is added to the set of fakeScripts.
      //
      // Otherwise, the markup is provided to the document.write function
      // (previously replaced by an alternative provided by bezen.domwrite in
      // captureDeferScriptHack).
      //
      // param:
      //   markup - (string) HTML markup for document.write
      //
      // Note:
      //   this method will be set to document.write by captureScriptDeferHack().
       
      if (typeof markup==='string'){
        var node = parseMarkup(markup);
        if ( node &&
             node.nodeName === 'SCRIPT' &&
             node.nextSibling===null && 
             hasAttribute(node,'id') &&
             hasAttribute(node,'defer')
           ){
          var javascriptUrl = 'javascript'; // construct to pass JSLint check
          javascriptUrl += ':void(0)';
          var src = node.getAttribute('src');
          if ( src === '//:' ||
               src === '//0' ||
               src === javascriptUrl ){
            deferScripts.push(node);
            return;
          }
        }
      }
       
      // otherwise forward to document.write filter
      domWrite(markup);
    };

    var filterDocumentGetElementById = function(id){
      // filter document.getElementById to return captured defer scripts
      // and allow client code relying on the script defer hack to set a 
      // handler function
      //
      // In order to avoid conflicts when multiple libraries use the script
      // defer hack with the same script id, the last script added will always
      // be returned in case several match.
      //
      // Note:
      //   captureScriptDeferHack() sets this method to document.getElementById
      //
      // param:
      //   id - (string) the id to look for
      //
      // return: (DOM node)
      //   the captured defer script node with matching id, if there is one,
      //   the result of the original document.getElementById function otherwise
       
      for (var i=deferScripts.length; i>=0; i--){
        var script = deferScripts[i];
        if (script && script.id===id) {
          return script;
        }
      }
       
      // otherwise, return regular document.getElementById
      if (documentGetElementById.apply){
        // generic forwarding to browser function
        return documentGetElementById.apply(document,arguments);
      } else {
        // in IE, document.getElementById is no regular function
        // typeof document.getElementById === 'object'
        return documentGetElementById(id);
      }
    };
     
    var captureScriptDeferHack = function(){
      // deploy counter-measures to detect the hacks to detect the DOM readiness
      // in Internet Explorer, based on a conjunction of document.write and
      // a script with defer attribute, an id and a strange-looking src value.
      //
      // For example:
      //   document.write(
      //     "<script id='__ie_onready' src='//:' defer='true'><\/script>"
      //   );
      //
      // The id attribute is used to retrieve the script element immediately
      // after creating it with document.write, to attach a listener function
      // to the onreadystatechange property:
      //
      //   document.getElementById('__id_onready').onreadystatechange = 
      //   function(){
      //     if (this.readyState==='complete'){
      //       onload();
      //     }
      //   };
      //
      // The following src values are commonly used for this trick, because they
      // trigger the onreadystatechange handler with the script.readyState value
      // 'complete', which indicates the full loading of the (non-existant)
      // external script, and do not require to download any additional file:
      //   //:
      //   //0
      //   javascript:void(0)
      //
      // The main issues with this hack for dynamic loading are:
      //   * document.write cannot be called after page load (or all contents
      //     in the page get reset to blank)
      //   * when inserting the same markup with innerHTML, which is done by
      //     bezen.domwrite, the created script never reaches the 'complete'
      //     readyState.
      //
      // In order to simulate the DOM readiness for code relying on this hack,
      // we put two filters in place:
      //   - one filter on document.write, to detect the hack and extract the 
      //     identifier of the script, 
      //   - another filter on document.getElementById, to return a fake script
      //     object on which the onreadystatechange handler can be set
      //
      // Finally, in onready(), handlers attached to all the fake scripts are
      // collected and added to listeners to be fired.
      //
      // Note:
      //   This module only detects the script defer hack in document.write, not
      //   in document.writeln. Both document.write and document.writeln will be
      //   replaced however, after calling captureScriptDeferHack, as this 
      //   method delegates the capture of markup to the module bezen.domwrite
      //   which handles both methods.
      //
      // References:
      //   "The window.onload Problem - Solved!" by Dean Edwards 
      //   http://dean.edwards.name/weblog/2005/09/busted/
      //
      //   "The window.onload Problem Revisited" by Matthias Miller
      //   http://blog.outofhanwell.com/2006/06/08
      //                               /the-windowonload-problem-revisited/
      //
      //   "Using window.onload over HTTPS" by Matthias Miller
      //   http://blog.outofhanwell.com/2006/06/27/using-windowonload-over-https/
      //
      //   "DomLoaded Object Literal Updated" by Rob Cherny
      //   http://www.cherny.com/webdev/26/domloaded-object-literal-updated
      //
      //   "window.onload when DOM complete" - by RobG
      //   http://bytes.com/topic/javascript/answers
      //                         /599810-window-onload-when-dom-complete
      //
      //   "FastInit: a faster window.onload" by Andrew Tetlaw
      //   http://tetlaw.id.au/view/javascript/fastinit
      //
      //   "Possible bug/incompatibility with Dojo"
      //   a bug reported by Kyle Simpson (getify), on 2008-09-04, which affects
      //   SWFObject before version 2.2, due to the use of the script defer hack
      //   http://code.google.com/p/swfobject/issues/detail?id=168
       
      domwrite.capture(); // replace document.write with alternative
       
      var dom = document; // use alias to avoid JSLint 'eval is evil' warning
      domWrite = dom.write;
      dom.write = filterDomWrite;
       
      documentGetElementById = document.getElementById;
      document.getElementById = filterDocumentGetElementById;
    };
     
    var simulate = function(){
      // simulate the 'DOMContentLoaded', 'onreadystatechange', 'onload' and 
      // 'load' events by triggering all listeners captured since a previous 
      // call to capture() or simulate(), and calling window.onload() if a new 
      // handler got assigned to it.
      //
      // The capture() method must have been called beforehand. All calls to
      // simulate() before the document is detected as ready are ignored. In 
      // case this script itself has been loaded dynamically after the page load,
      // call beReady() to force the module in a ready state (by setting the 
      // readyState property of the document to "complete").
      //
      // After calling capture() just once, simulate() may be called repeatedly,
      // and listeners previously called will not be triggered again.
      //
      // This method is intended to trigger any functions attached to 
      // window.onload or added as listeners for the 'DOMContentLoaded' or 
      // 'load' events in scripts loaded dynamically after these events fired, 
      // too late to expect a callback.
      //
      
      if ( isReady() ){
        onready();
      } 
    };
    
    var restore = function(){
      // restore original browser functions, saved in local variables before
      // their replacement in capture() or captureDeferScriptHack():
      //   window.addEventListener                 // capture
      //   document.addEventListener               // capture
      //   window.attachEvent,                     // capture
      //   document.attachEvent,                   // capture
      //   document.write,                         // captureScriptDeferHack
      //   document.writeln,                       // captureScriptDeferHack
      //   document.getElementById                 // captureScriptDeferHack
       
      domwrite.restore();
      if (windowAddEventListener){
        window.addEventListener = windowAddEventListener;
      }
      if (documentAddEventListener){
        document.addEventListener = documentAddEventListener;
      }
      if (windowAttachEvent){
        window.attachEvent = windowAttachEvent;
      }
      if (documentAttachEvent){
        document.attachEvent = documentAttachEvent;
      }
      if (documentGetElementById){ 
        document.getElementById = documentGetElementById;
      }
    };

    // Assign to bezen.ready
    // for backward compatiblity
    bezen.ready = { // public API
      isReady: isReady,
      beReady: beReady,
      addListener: addListener,
      hasListeners: hasListeners,
      capture: capture,
      captureScriptDeferHack: captureScriptDeferHack,
      simulate: simulate,
      restore: restore,
       
      _:{ // private section, for unit tests
        listeners: listeners,
        deferScripts: deferScripts,
        init: init,
        onready: onready,
        captureWindowOnload: captureWindowOnload,
        filterWindowAttachEvent: filterWindowAttachEvent,
        filterWindowAddEventListener: filterWindowAddEventListener,
        filterDocumentAddEventListener: filterDocumentAddEventListener,
        filterDocumentAttachEvent: filterDocumentAttachEvent,
        collectScriptDeferHack: collectScriptDeferHack,
        filterDomWrite: filterDomWrite,
        filterDocumentGetElementById: filterDocumentGetElementById 
      }
    };
    return bezen.ready;
  }
);
/*
 * bezen.style.js - DOM style and CSS class utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define, document */
define('bezen.style',["./bezen", "./bezen.string", "./bezen.array"],
  function(bezen,  string,           array) {
  
    // Define aliases
    var hash = array.hash,
        trim = string.trim;
     
    var getClasses = function(node) {
      // return a hash of class names, with the ordered list of class name 
      // in the private property '_'.
      //
      // params:
      //   node - (DOM element) (optional) the element to get classes from.
      //          In case no node is provided, an empty hash will be returned.
      //
      // return: (object)
      //   a hash object with one property set to true for each class name.
      //   The original sequence of class names is preserved in an array set to
      //   the property '_', which is not a valid CSS name.
      //
      if (!node || !node.className) {
        return {_:[]};
      }
       
      var classNames = trim(node.className).split(/\s+/);
      var classes = hash(classNames);
      classes._ = classNames;
      return classes;
    };
    
    var setClasses = function(node,classes) {
      // set the node className with selected classes
      // The intent of this method is to update the classes previously retrieved
      // with getClasses(), after one or several modifications using addClass()
      // and removeClass().
      //
      // params:
      //   node - (DOM element) (!nil) the element to set the classes to
      //   classes - (object) (!nil) a hash object in the format returned by
      //             getClasses, with one property set to true for each class
      //             and the list of class names in the private property '_'
      //
      // Note: The order of classes will be preserved by
      //         setClasses(node, getClasses(node) )
       
      node.className = classes._.join(' ');
    };
     
    var addClass = function(classes,className) {
      // append a class to the end of current classes, unless the class is 
      // already defined to true in the hash. 
      //
      // params:
      //   classes - (object) (!nil) a hash object in the format returned by
      //             getClasses, with one property set to true for each class
      //             and the list of class names in the private property '_'
      //   className - (string) (!nil) a class name
      //
      // return: (object)
      //   the modified hash of class names
      //
      // Note: the order or remaining classes is preserved
      if ( classes[className] ) {
        return classes;
      }
       
      classes[className] = true;
      classes._.push(className);
      return classes;
    };
     
    var removeClass = function(classes,className) {
      // remove a class from current classes
      // 
      // params:
      //   classes - (object) (!nil) a hash object in the format returned by
      //             getClasses, with one property set to true for each class
      //             and the list of class names in the private property '_'
      //   className - (string) (!nil) a class name
      //
      // return: (object)
      //   the updated hash of class names
      // 
      // Notes:
      //   * the order or remaining classes is preserved
      //   * the class name will be completely removed even if present
      //     multiple times at different positions in the list
      if (!classes[className]){
        return classes;
      }
       
      delete classes[className];
      var newList = [];
      var oldList = classes._;
      for (var i=0; i<oldList.length; i++){
        if(oldList[i]!==className){
          newList.push(oldList[i]);
        }
      }
      classes._ = newList;
      return classes;
    };
     
    var showBlock = function(element) {
      // Show an element as block
      //
      // param:
      //   element - (DOM element) (!nil) the element to show
        
      if (element.style) {
        element.style.display = 'block';
      }
    };
      
    var hide = function(element) {
      // Hide element
      //
      // param:
      //   element - (DOM element) (!nil) the element to hide
       
      if (element.style) {
        element.style.display = 'none';
      }
    };
     
    var resetDisplay = function(element) {
      // Reset element display style to default
      //
      // param:
      //   element - (DOM element) (!nil) the element to modify
       
      if (element.style) {
        element.style.display = '';
      }
    };

    // Assign to bezen.style,
    // for backward compatibility
    bezen.style = {
      // public API
      getClasses: getClasses,
      setClasses: setClasses,
      addClass: addClass,
      removeClass: removeClass,
      showBlock: showBlock,
      hide: hide,
      resetDisplay: resetDisplay,
       
      _: { // private section, for unit tests
      }
    };

    return bezen.style;
  }
);
/*
 * bezen.template.js - HTML Templates
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 *
 * This module offers a template engine to create and update HTML elements
 * with dynamic data using Javascript. It grew from following principles:
 *
 *   - use only semantic markup, SEO-friendly, for the templates in the source
 *     of the HTML document
 *
 *   - do not mix Javascript and HTML in the Javascript code: keep the HTML in
 *     the document, the Javascript in the scripts
 *
 *   - templates are prototype HTML elements, cloned one or several times,
 *     with parameters of the form #param# to be replaced with a corresponding
 *     'param' from the dynamic data
 *
 * The three following principles are more complex, and you may skip them 
 * during your first reading:
 *
 *   - some sections of a template may be lists, with items to be repeated. In
 *     this case, an array is expected in the dynamic data, and for each item
 *     in the array, the list contents will be cloned and the templates
 *     within will get replaced with the values provided by the current item.
 *
 *   - some sections of a template may be optional. The parameters within will
 *     be replaced normally, except when the replacement value is null or 
 *     undefined. In case it is explicitly null, the whole optional section 
 *     will be removed. When the value is undefined, it will be kept, hidden, 
 *     to allow a later update e.g. after asynchronous data has been received.
 *
 *   - optional sections may be nested. If all nested optionals are removed,
 *     their closest optional ancestor will be removed as well. This behavior
 *     allows to get rid of empty sections when all optional sections within
 *     are missing.
 *
 * To obtain the expected hiding, the following rules must be defined in a
 * CSS stylesheet:
 *   .optional,
 *   .template {display:none;}
 *
 * For debugging purpose, during development, you may define the following 
 * rules in your CSS stylesheet instead:
 *  .optional  {background-color: #0FF;}
 *  .optional .optional {background-color: #0AA;}
 *  .template  {background-color: #FF0;}
 *
 * Let's start with the most simple use case: a block of text to fill with
 * dynamic data, and update from time to time. This simple use case aims
 * to demonstrate the replacement of a single parameter; it does not justify
 * the use of a template engine. The following examples will show use cases of
 * increasing complexity.
 *
 * 
 *                   §~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~§
 *                   § Example 1: dynamic block of text §
 *                   §                                  §
 *                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * In your HTML, define the block at its expected location:
 *   <div id='block1'>
 *     <h2>Title: #title#</h2>
 *   </div>
 *
 * You will need the id on the block to get access to the DOM element from
 * your Javascript code:
 *   var $ = bezen.$; // define an alias to bezen.$
 *   var block1 = $('block1');
 *
 * Inside the h2 within the div, you can spot #title#. This is a parameter 
 * named 'title' to be replaced with corresponding dynamic data. In this case,
 * the data should be a Javascript object with a property named 'title' set 
 * to the replacement text:
 *   var data = {title: 'Holidays for the school year 2009-2010'};
 *
 * The initNode method will update the div, inserting dynamic data in
 * place of the #title# parameter:
 *   var initNode = bezen.template.initNode; // define an alias
 *   initNode(block1, data);
 *
 * In the HTML DOM, the block would now be:
 *   <div id='block1'>
 *     <h2>Title: Holidays for the school year 2009-2010</h2>
 *   </div>
 *
 * For a real website, there are two problems with this simplistic use case:
 *   - the block is initially displayed in the page with the text
 *       #title#
 *   - the block can no longer be updated, as the parameter is no longer there.
 *     Calling initNode(block1, data) a second time would do nothing,
 *     since there is no #title# parameter anymore.
 *
 * We will address these two issues in the second example.
 *
 *
 *                   §~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~§
 *                   § Example 2: dynamic block of text §
 *                   §      as prototype and clone      §
 *                   §                                  §
 *                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * In the HTML, we will now define the block as:
 *   <div id='block2' class='template'>
 *     <h2>Title: #title#</h2>
 *   </div>
 *
 * The class 'template' indicates that this is a template node indeed, to
 * be kept hidden per a CSS rule that you defined. First problem solved.
 *
 * The template will be kept as is, and can be reused multiple times. Instead
 * of replacing the parameters in the template, we will first create a clone
 * of the block, then replace the parameters in the clone with the dynamic
 * text. In your script, you would write the following code:
 *
 *   var $ = bezen.$,
 *       removeClones = bezen.template.removeClones,
 *       addClone = bezen.template.addClone; // define aliases
 *
 *   var block = $('block2');
 *   var data = {title: 'Holidays for the school year 2009-2010'};
 *   removeClones(block);             // remove any clone from a previous run
 *   addClone(block,data);            // create a new clone and insert it as
 *                                    // next sibling at the same location,
 *                                    // initialize the clone with given data
 *
 * In your HTML DOM, you would now have as a result (indented for readability):
 *   <div id='block2' class='template'>
 *     <h2>Title: #title#</h2>
 *   </div>
 *   <div class=''>
 *     <h2>Title: Holidays for the school year 2009-2010</h2>
 *   </div>
 *
 * Note that the clone has been anonymized (there is no id attribute anymore,
 * to avoid duplicates) and that the class 'prototype' has been removed. Thus
 * if a rule is defined to hide elements with the class 'template', only the 
 * template will be hidden, not the clone.
 *
 * Calling the same code a second time would first remove the cloned div, then
 * create a new clone and replace the parameters within with the dynamic data.
 * The second problem is solved: the clone attached to the template can now
 * be replaced.
 *
 * The third example will show how to insert multiple clones. This is 
 * typically useful for a list of results or a table with data.
 *
 *
 *                       §~~~~~~~~~~~~~~~~~~~~~~~~~~~§
 *                       § Example 3: a simple table §
 *                       §                           §
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * In the HTML, I define a table with a header row followed with a single row 
 * which will be kept hidden, the template row.
 *
 * <table summary="holidays for the school year 2009-2010">
 *   <tr>
 *     <th>Month</th>
 *     <th>Year</th>
 *     <th>Holidays</th>
 *   </tr>
 *   <tr id='month' class='template #alternate#'>
 *     <td>#month#</td>
 *     <td>#year#</td>
 *     <td>#holidays#</td>
 *   </tr>
 * </table>
 *
 * I wanted to display alternate rows with different background colors. That's
 * why I added a parameter, #alternate#, within the class attribute of the
 * template row, to be replaced with 'odd' and 'even' alternately.
 * 
 * In this case, the data would be an array, with one object for each month:
 *   var data = [
 *     {month: 'September', year: 2009, holidays:  1},
 *     {month: 'October',   year: 2009, holidays:  8},
 *     {month: 'November',  year: 2009, holidays:  6},
 *     {month: 'December',  year: 2009, holidays: 13},
 *     {month: 'January',   year: 2010, holidays:  4},
 *     {month: 'February',  year: 2010, holidays: 12},
 *     {month: 'March',     year: 2010, holidays:  9},
 *     {month: 'April',     year: 2010, holidays: 18},
 *     {month: 'May',       year: 2010, holidays:  4},
 *     {month: 'June',      year: 2010, holidays:  1},
 *     {month: 'July',      year: 2010, holidays: 29},
 *     {month: 'August',    year: 2010, holidays: 31}
 *   ];
 *
 * We need to loop over the table, to add one clone for each month:
 *   var $ = bezen.$,
 *       removeClones = bezen.template.removeClones,
 *       addClone = bezen.template.addClone; // define aliases
 *
 *   var row = $('month');
 *   removeClones(row);
 *   for (var i=0; i<data.length; i++){
 *     var alternateStyle = i%2===0? 'even': 'odd'; // alternate styles
 *     data[i].alternate = alternateStyle;
 *     addClone(row,data[i]);
 *   }
 *
 * I set the 'alternate' value to 'even' or 'odd' for every other row.
 * This results in the complete table below. Note how the 'template' class is
 * removed, the #alternate# parameter gets replaced with 'even' or 'odd', 
 * which results in the class 'even clone' and 'odd clone' alternatively.
 *
 * <table summary="Holidays for the school year 2009-2010">
 *   <tr>
 *     <th>Month</th>
 *     <th>Year</th>
 *     <th>Holidays</th>
 *   </tr>
 *   <tr id='month' class='template #alternate#'>
 *     <td>#month#</td>
 *     <td>#year#</td>
 *     <td>#holidays#</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>September</td>
 *     <td>2009</td>
 *     <td>1</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>October</td>
 *     <td>2009</td>
 *     <td>8</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>November</td>
 *     <td>2009</td>
 *     <td>6</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>December</td>
 *     <td>2009</td>
 *     <td>13</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>January</td>
 *     <td>2010</td>
 *     <td>4</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>February</td>
 *     <td>2010</td>
 *     <td>12</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>March</td>
 *     <td>2010</td>
 *     <td>9</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>April</td>
 *     <td>2010</td>
 *     <td>18</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>May</td>
 *     <td>2010</td>
 *     <td>4</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>June</td>
 *     <td>2010</td>
 *     <td>1</td>
 *   </tr>
 *   <tr class='even'>
 *     <td>July</td>
 *     <td>2010</td>
 *     <td>29</td>
 *   </tr>
 *   <tr class='odd'>
 *     <td>August</td>
 *     <td>2010</td>
 *     <td>31</td>
 *   </tr>
 * </table>
 *
 * In the next example, I will combine a dynamic block of text with a table,
 * and initialize it in a single step thanks to the 'list' class.
 *
 *
 *            §~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~§
 *            § Example 4: dynamic block of text and table together, §
 *            §              using the 'list' class                  §
 *            §                                                      §
 *            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 * In this example, the table is part of the div block, and I reused the 
 * parameter #title# in the summary attribute of the table.
 * <div id='block4' class='template'>
 *   <h2>Title: #title#</h2>
 *   <table summary="#title#">
 *     <thead>
 *       <tr>
 *         <th>Month</th>
 *         <th>Year</th>
 *         <th>Holidays</th>
 *       </tr>
 *     </thead>
 *     <tbody class='month list'>
 *       <tr class='#alternate#'>
 *         <td>#month#</td>
 *         <td>#year#</td>
 *         <td>#holidays#</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 *
 * Compared with previous example, the table looks a little different: the
 * template row does not need an id anymore, because we need only to access
 * the ancestor div to replace all the parameters within. The trick is that
 * the 'list' class on the parent tbody instructs the template engine to
 * expect an array of data in the property named 'month list' (same as the 
 * full class attribute), and to clone all its contents, replacing the 
 * parameters of each clone with the data of corresponding array item.
 *
 * I had to add the tbody to avoid duplicating the header for each row, which
 * would have happened if I had set the 'list' on the table: both the first tr 
 * with the headers and the template tr would have been cloned together. 
 * Adding the tbody as an intermediate level allows to specify the 'list' 
 * behavior only for its child the template tr.
 *
 * The data for this example combines the data of the two previous examples.
 * I also added the 'alternate' property for each item in the 'month list'.
 * var data = {
 *   title: 'Holidays for the school year 2009-2010',
 *   'month list':[
 *     {month: 'September', year: 2009, holidays:  1, alternate: 'odd'},
 *     {month: 'October',   year: 2009, holidays:  8, alternate: 'even'},
 *     {month: 'November',  year: 2009, holidays:  6, alternate: 'odd'},
 *     {month: 'December',  year: 2009, holidays: 13, alternate: 'even'},
 *     {month: 'January',   year: 2010, holidays:  4, alternate: 'odd'},
 *     {month: 'February',  year: 2010, holidays: 12, alternate: 'even'},
 *     {month: 'March',     year: 2010, holidays:  9, alternate: 'odd'},
 *     {month: 'April',     year: 2010, holidays: 18, alternate: 'even'},
 *     {month: 'May',       year: 2010, holidays:  4, alternate: 'odd'},
 *     {month: 'June',      year: 2010, holidays:  1, alternate: 'even'},
 *     {month: 'July',      year: 2010, holidays: 29, alternate: 'odd'},
 *     {month: 'August',    year: 2010, holidays: 31, alternate: 'even'}
 *   ]
 * };
 *
 * Note that I had to add quotes around 'month list' to use it as a property
 * name, because there is a space within.
 *
 * The corresponding code is the same as the one for the second example, which
 * shows that we can go from that simplistic example to this more complex by 
 * changing only the HTML template and the data, not the Javascript code:
 *   var $ = bezen.$,
 *     removeClones = bezen.template.removeClones,
 *     addClone = bezen.template.addClone; // define aliases
 *
 *   var block = $('block4');
 *   removeClones(block);             // remove any clone from a previous run
 *   addClone(block,data);            // create a new clone and insert it as
 *                                    // next sibling at the same location,
 *                                    // initialize the clone with given data
 *
 * The expected result in this case justifies the use of the template engine:
 * <div id='block4' class='template'>
 *   <h2>Title: #title#</h2>
 *   <table summary="#title#">
 *     <thead>
 *       <tr>
 *         <th>Month</th>
 *         <th>Year</th>
 *         <th>Holidays</th>
 *       </tr>
 *     </thead>
 *     <tbody class='month list'>
 *       <tr class='#alternate#'>
 *         <td>#month#</td>
 *         <td>#year#</td>
 *         <td>#holidays#</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div> 
 * <div id='block4' class=''>
 *   <h2>Title: Holidays for the school year 2009-2010</h2>
 *   <table summary="Holidays for the school year 2009-2010">
 *     <thead>
 *       <tr>
 *         <th>Month</th>
 *         <th>Year</th>
 *         <th>Holidays</th>
 *       </tr>
 *     </thead>
 *     <tbody class='month list'>
 *       <tr class='odd'>
 *         <td>September</td>
 *         <td>2009</td>
 *         <td>1</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>October</td>
 *         <td>2009</td>
 *         <td>8</td>
 *       </tr>
 *       <tr class='odd'>
 *         <td>November</td>
 *         <td>2009</td>
 *         <td>6</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>December</td>
 *         <td>2009</td>
 *         <td>13</td>
 *       </tr>
 *       <tr class='odd'>
 *         <td>January</td>
 *         <td>2010</td>
 *         <td>4</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>February</td>
 *         <td>2010</td>
 *         <td>12</td>
 *       </tr>
 *       <tr class='odd'>
 *         <td>March</td>
 *         <td>2010</td>
 *         <td>12</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>April</td>
 *         <td>2010</td>
 *         <td>18</td>
 *       </tr>
 *       <tr class='odd'>
 *         <td>May</td>
 *         <td>2010</td>
 *         <td>4</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>June</td>
 *         <td>2010</td>
 *         <td>1</td>
 *       </tr>
 *       <tr class='odd'>
 *         <td>July</td>
 *         <td>2010</td>
 *         <td>29</td>
 *       </tr>
 *       <tr class='even'>
 *         <td>August</td>
 *         <td>2010</td>
 *         <td>31</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 *
 * Apart from 'template' and 'list', there is another class name which carries
 * a special meaning for this template engine: 'optional'. I will highlight 
 * the different behaviors attached to the 'optional' class in the example 5.
 *
 *
 *                    §~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~§
 *                    § Example 5: 'optional' behaviors §
 *                    §                                 §
 *                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * The primary use of the 'optional' class is to catch any missing parameter
 * and hide a section that contains it.
 * 
 * It works for parameters in child nodes:
 * <div class='optional'>#text#</div>
 *
 * It works for parameters in descendant nodes:
 * <div class='optional'>
 *   <p>
 *     <span>#text#</span>
 *   </p>
 * </div>
 *
 * It works for attributes on the same element:
 * <div class='optional' title='#text#'></div>
 * 
 * And even for a missing parameter in the class name itself:
 * <div class='optional #text#'></div>
 * 
 * In all the above cases, the div with the class 'optional' will be removed
 * from the document if the null value is found for the 'text' property. In
 * case the property is undefined, nothing happens, as we suppose that this is
 * a deferred value, which will provided in a later pass: the div will be 
 * left unchanged, including the 'optional' class.
 * 
 * On the other hand, if a 'text value' is provided for the 'text' property,
 * the optional class is removed, and the text gets replaced as expected:
 * <div class=''>text value</div>
 * <div class=''>
 *   <p>
 *     <span>text value</span>
 *   </p>
 * </div>
 * <div class='optional' title='text value'></div>
 * <div class='optional text value'></div>
 *
 * In the same way, the 'optional' class can catch a missing 'list', waiting
 * for a value to be provided later if the property for the list is undefined,
 * and removing the optional section around the list if the value is null.
 *
 * That's how, in the example below, the whole table will be removed if the 
 * null value is set to the 'month list' property.
 *
 * <table class='optional' summary="#title#">
 *   <thead>
 *     <tr>
 *       <th>Month</th>
 *       <th>Year</th>
 *       <th>Holidays</th>
 *     </tr>
 *   </thead>
 *   <tbody class='month list'>
 *     <tr class='#alternate#'>
 *       <td>#month#</td>
 *       <td>#year#</td>
 *       <td>#holidays#</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * An additional behavior is attached to nested 'optional' sections. I added
 * two 'optional' classes on the HTML of the example 4: the table is now
 * optional (like above), as well as the template div at the top:
 * <div id='block5' class='optional template'>
 *   <h2>Title: #title#</h2>
 *   <table class='optional' summary="#title#">
 *     <thead>
 *       <tr>
 *         <th>Month</th>
 *         <th>Year</th>
 *         <th>Holidays</th>
 *       </tr>
 *     </thead>
 *     <tbody class='month list'>
 *       <tr class='#alternate#'>
 *         <td>#month#</td>
 *         <td>#year#</td>
 *         <td>#holidays#</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 *
 * With data = {'title':null}, since the 'title' property is null, the 
 * replacement of the #title# parameter in the h2 fails, and the whole div 
 * is removed from the document. That's the end of the processing, as expected.
 *
 * But if the 'title' is set and the 'month list' property is null, with 
 * data = {title:"Holidays for the school year 2009-2010", 'month list':null} 
 * an additional behavior is triggered after the optional table is removed.
 * Since the optional div contains a single optional table, and this table has
 * been removed, the div is removed as well. The template engine considers 
 * that optional sections are no longer relevant when they have nested optional
 * sections and all these sections are missing.
 *
 * If we wanted to keep the div in the absence of the table, we would have to
 * modify the template by making the h2 optional as well:
 * <div id='block6' class='optional template'>
 *   <h2 class='optional'>Title: #title#</h2>
 *   <table class='optional' summary="#title#">
 *     <thead>
 *       <tr>
 *         <th>Month</th>
 *         <th>Year</th>
 *         <th>Holidays</th>
 *       </tr>
 *     </thead>
 *     <tbody class='month list'>
 *       <tr class='#alternate#'>
 *         <td>#month#</td>
 *         <td>#year#</td>
 *         <td>#holidays#</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 *
 * With this modification, calling
 *   addClone($('block6'),
 *     {title:"Holidays for the school year 2009-2010", 'month list':null}
 *   );
 * would preserve the clone with only the h2 within, since only one of the
 * two optional sections in the div was missing:
 * <div class=''>
 *   <h2 class=''>Title: Holidays for the school year 2009-2010</h2>
 * </div>
 *
 * To end this presentation, the behaviors attached to the class names
 * 'template', 'list', 'optional' can be attached instead to different class 
 * names of your choice by using the setAliases method:
 *   bezen.template.setAliases({
 *     template: prototype,
 *     list: repeat,
 *     optional: hideIfNull
 *   });
 *
 * After calling the above code, preferentially before any use of the template
 * engine, you could rewrite the above examples by using the 'prototype' class
 * instead of 'template', the 'repeat' class instead of 'list' and the class
 * 'hideIfNull' instead of 'optional'.
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global document, window */
define('bezen.template',["./bezen", "./bezen.dom", "./bezen.style"],
  function(bezen,  dom,           style){

    // Define Aliases
    var remove = dom.remove,
        insertAfter = dom.insertAfter, 
        getClasses = style.getClasses,
        removeClass = style.removeClass,
        setClasses = style.setClasses,
        ATTRIBUTE_NODE = dom.ATTRIBUTE_NODE;
     
    // format of a parameter to replace, e.g. #param#
    var PARAM_REGEXP = /#([a-zA-Z0-9\-]+)#/g;
     
    var STATUS_NO_CHANGE = 0,          // no replacement done
        STATUS_SUCCESS = 1,            // replacement succeeded
        STATUS_OPTIONAL_NIXED = 2,     // optional removed after failure inside
        STATUS_OPTIONAL_KEPT = 3,      // optional kept after success inside
        STATUS_MISSING = 4,            // undefined value found for param/list
        STATUS_FAILED = 5;             // null value found for param/list
      
    // meaningful CSS class names
    var css = {
      template: 'template',
      list: 'list',
      optional: 'optional'
    };
     
    var setAliases = function(aliases){
      // replace one or several class names meaningful to this template engine 
      // with custom aliases
      //
      // This method may be used to avoid a conflict between the CSS classes
      // expected by this template engine and existing classes or classes
      // expected by different Javascript libraries such as widgets.
      //
      // Declaring an alias for an unknown/forgotten CSS class name will have
      // no effect.
      //
      // param:
      //   aliases - (object) an object with a set of properties, each
      //             corresponding to the declaration of an alias to a CSS class
      //             name meaningful to this template engine:
      //               {template: aliasForTemplate,
      //                list: aliasForList,
      //                optional: aliasForOptional}
       
      for (var name in aliases) {
        if ( aliases.hasOwnProperty(name) &&
             css.hasOwnProperty(name)
           ){
          css[name] = aliases[name];
        }
      }
    };
     
    var removeClones = function(templateNode) {
      // Remove all clones of the template node.
      //
      // After creating a new clone, the addClone() method keeps track of this
      // last clone by setting it to the property bezen.lastClone of the 
      // template node.
      // 
      // This allows to remove only clone nodes in this method: all following
      // siblings of the template node up to the one equal to bezen.lastClone
      // will be removed.
      //
      // Notes:
      //   * if the property bezen is not set on the template node (e.g. before 
      //     the first clone has been added), the method terminates immediately
      //   * in case the node reference by bezen.lastClone is not found in the 
      //     following siblings of the template node, all following siblings 
      //     are removed, up to the last
      //
      // param:
      //   templateNode - (DOM node) (!nil) the template node
      if (!templateNode.bezen){
        return; 
      }
       
      var last = templateNode.bezen.lastClone;
      var next = templateNode.nextSibling;
      while (next !== null) {
        var node = next;
        next = node===last? null: next.nextSibling;
        remove(node);
      }
    };
     
    var getBaseUrl = function(url){
      // get the base URL of the page (without the hash part)
      //
      // param:
      //   url - (string) (optional) (default: window.location.href)
      //         the url to truncate
      //   Note: I switched from document.URL to window.location.href for 
      //         accurate results with local files in Internet Explorer. 
      //         Although both share the same value for online files using the
      //         http/https protocols, with the file protocol, in IE, 
      //         document.URL will look like
      //           file://D:\web\bezen.org\javascript\test\test-template.html
      //         while the corresponding window.location.href would be
      //           file:///D:/web/bezen.org/javascript/test/test-template.html
      //
      // return: (string)
      //   the full window URL, up to and excluding the hash part, if any 
      url = url || window.location.href;

      // Remove the fragment part of the url
      var pos = url.indexOf("#");
      return ( pos<0? url: url.slice(0,pos) );
    };

    var getNodeValue = function(node) {
      // Get the node value
      //
      // A specific processing is required for URLs in (A) href and (IMG) src
      // attributes, which get transformed to an absolute form in IE, 
      // prepending the web page URL to the left of the #param#.
      // This method removes the web page URL if found at the start of a 
      // href or src attribute.
      // 
      // params:
      //   node - (DOM node) a node with a value
      //          PRE: node.nodeValue is truthy
      //
      // return: (string or any)
      //   the node value from node.nodeValue, with the URL of the page
      //   removed from the start for href and src attributes.
      //   This value is typically a string. It may also be null, e.g. for the
      //   document itself, and may be a number or even an object (for custom
      //   properties, considered as attributes) in Internet Explorer.
       
      if ( (node.nodeType === ATTRIBUTE_NODE) && 
           (node.name === 'href' || node.name === 'src')  ) {
        var baseUrl = getBaseUrl(); 
        if ( node.nodeValue.indexOf(baseUrl) === 0 ) {
          // Remove absolute URL added by IE at start of local href and src
          // The URL is identical to the part of window.location.href before the '#'
          return node.nodeValue.replace(baseUrl,'');
        }
      }
       
      return node.nodeValue;
    };
     
    var replaceParams = function(node,data){
      // replace parameters in the node value with replacement values found in 
      // the given data, in properties with the same name as the corresponding
      // parameter
      //
      // params:
      //   node - (DOM node) (!nil) a DOM node with a nodeValue
      //   data - (object) (!nil) a hash object with replacement values in 
      //          properties named after the parameter they aim to replace
      //
      // return: (integer)
      //   the status of the replacement operation, one of
      //   STATUS_NO_CHANGE if no param was found
      //   STATUS_SUCCESS if all parameters were replaced successfully
      //   STATUS_MISSING if an undefined value was found, and no null value
      //   STATUS_FAIL if a null value was found
      
      var status = STATUS_NO_CHANGE;
       
      var initialValue = getNodeValue(node);
      if (typeof initialValue !== 'string'){
        // may occur in IE for colSpan attribute (number) or custom attribute
        // 'bezen' set to an object tracking properties on prototype element
        return status;
      }
       
      node.nodeValue = initialValue.replace(PARAM_REGEXP, 
        function(match,param) {
          // this replacement function is called each time a parameter is found
          //
          // This method relies on the external context for its input and its 
          // output: it will both
          //   - return the expected replacement text by looking for a property 
          //     named like the parameter in the data part of the context,
          //   - set the context status to STATUS_SUCCESS if a parameter is
          //     replaced successfully, STATUS_MISSING if the value found for
          //     the parameter was undefined, and STATUS_FAILED if the value
          //     found for the parameter was null. The status is only updated
          //     if the previous value is no greater than the new one, this to
          //     ensure that only the most critical status is preserved after
          //     processing multiple matches.
          //     The order of priority is:
          //       STATUS_NO_CHANGE          // no param found so far
          //     < STATUS_SUCCESS            // replacement successful
          //     < STATUS_MISSING            // undefined value found for param
          //     < STATUS_FAILED             // null value found for param
          //
          // params:
          //   match - (string) the matched parameter
          //   param - (string) the name of the parameter (capture group #1)
          //
          // return: (string)
          //   the replacement string
          
          var value = data[param],
              replacement = value,
              newstatus;
           
          if (value===undefined) {
            // No/undefined value found for the match
            // leave the value unchanged
            newstatus = STATUS_MISSING;
            replacement = match;

          } else if (value===null) {
            // null value found for the match
            newstatus = STATUS_FAILED; 
          } else {
            // Successful match, the parameter will get replaced by its value
            newstatus = STATUS_SUCCESS;
          }
           
          if (status < newstatus) {
             // update status if new status has higher priority
             status = newstatus;
          }
          return replacement;
        }
      );
      return status;
    };
     
    var anonymize = function(node,idhash) {
      // remove the id attribute of the node, if any
      // 
      // Optionally, This method allows to keep a link between the node and the
      // removed id by setting the node to the property named after its id in
      // the result object idhash.
      //
      // param:
      //   node - (DOM node) (!nil) the node to anonymize
      //   idhash - (object) (optional) a result parameter to keep a hash of
      //            anonymized nodes associated with their original identifiers
      if (!node.id){
        return;
      }
       
      if (idhash){
        idhash[ node.id ] = node;
      }
      // Note: removeAttribute is ignored if no @id is present
      node.removeAttribute('id');
    };
     
    var initNode = function(node, data, id, parentStatus) {
      // Process recursively all elements, attributes, and text nodes,
      // replacing recursively parameters in the form #param# found
      // in attribute and text values with the value of the parameter
      // named 'param' in provided data.
      //
      // In addition,
      //   * following CSS classes have a special meaning for this method:
      //
      //     - "list":
      //       elements with the class 'list' are treated as the parent of a
      //       set of elements to be duplicated a certain number of times by
      //       looping over a data array found in a property named after 
      //       the full class e.g. 'optional something list'. At each step of
      //       the loop, elements get initialized with the corresponding item of 
      //       the data array, which has parameters with values for replacements,
      //       and may even have data arrays for child lists as well. Original 
      //       child elements are removed after cloning.
      //
      //     - "optional":
      //       in case a parameter remains unreplaced, or the array property
      //       for a list is found null, the closest ancestor with the class
      //       'optional' is removed and the processing of following child nodes
      //       is halted. In case no such ancestor is found, nothing happens.
      //       If all replacements succeed, without null and without undefined
      //       values, the 'optional' class is removed, allowing the optional
      //       block to become visible (typically, a CSS rule would be defined
      //       to hide optional elements). When optional sections are nested
      //       inside another, the ancestor section will be removed if all the
      //       nested optional sections within are removed due to null values.
      //       In case at least one of the optional subsections was succesfully
      //       processed and kept in the document, the 'optional' class is 
      //       removed from the ancestor optional element as well.
      //
      //   * elements get anonymized (unless removed)
      //
      //   * recursive processing is stopped at first failure in an attribute
      //     or child node (motivated by optimization purpose, this behavior may
      //     be nixed if it happens to make debugging of templates cumbersome)
      //
      // params:
      //   node - (DOM node) (!nil) the node to initialize
      //   data - (object) its properties give values for parameter replacement
      //   id - (object) (optional) result hash object keeping track of 
      //        elements with id after they get anonymized.
      //        See anonymize() for details.
      //   parentStatus - (integer) (optional) (default: STATUS_NO_CHANGE)
      //        current status of the parent node. The returned status will 
      //        compute the maximum of this status and the operation status
      //
      // return: (integer)
      //   the updated status, which is the maximum of the parent status and 
      //   the status of the initializaton operation, i.e. one of
      //   STATUS_NO_CHANGE if no replacement occurred
      //   STATUS_SUCCESS if a replacement succeeded
      //   STATUS_MISSING if an undefined value was found (and no null value)
      //   STATUS_FAILED if a null value was found within
      parentStatus = parentStatus || STATUS_NO_CHANGE;
      
      // local variables used as iterators
      var i, childNode, nextNode;
       
      var status = STATUS_NO_CHANGE;
      if (node.nodeValue){
        // TODO: after reading the DOM HTML recommendation, I wonder whether
        //       processing instructions are reported... further tests needed
        // attribute node, text node or processing instruction
        status = replaceParams(node, data);
        return Math.max(status,parentStatus);
      }
       
      // recurse over attributes
      var attributes = node.attributes;
      if (attributes) {
        for (i=0; i<attributes.length && status !== STATUS_FAILED; i++){
          status = initNode(attributes[i], data, id, status);
        }
      }
       
      var classes = getClasses(node);
      if ( classes[css.list] ){
        // find array of data in property named after the list
        var listData = data[node.className];
         
        if (listData===null){
          status = Math.max(STATUS_FAILED,status);
        } else if (listData===undefined){
          status = Math.max(STATUS_MISSING,status);
        } else {
          // move the original items to a temporary document fragment
          var listContents = document.createDocumentFragment(); 
          childNode = node.firstChild; 
          while(childNode!==null) {
            nextNode = childNode.nextSibling;
            listContents.appendChild(childNode);
            childNode = nextNode;
          }
          // for each data item in the list
          for (i=0; i<listData.length; i++){
            // duplicate the whole document fragment
            var cloneListContents = listContents.cloneNode(true);
             
            // initialize it as a regular node
            status = initNode(cloneListContents, listData[i], id, status);
             
            // append it at the end of the list
            node.appendChild(cloneListContents); 
          } 
        }
         
      } else if (status!==STATUS_FAILED){
        // recurse over child nodes
        // Beware: childNodes is a dynamic list where optional child nodes will
        //         get removed when removed from the document 
         
        childNode = node.firstChild;
        while( childNode !== null && status !== STATUS_FAILED ){
          nextNode = childNode.nextSibling;
          status = initNode(childNode, data, id, status);
          childNode = nextNode;
        }
      }
      
      if ( classes[css.optional] ){
        if ( status===STATUS_FAILED ||
             status===STATUS_OPTIONAL_NIXED) {
          // remove the node
          remove(node);
          status = STATUS_OPTIONAL_NIXED;
          return Math.max(status,parentStatus);
           
        } else if ( status===STATUS_NO_CHANGE ||
                    status===STATUS_SUCCESS   ||
                    status===STATUS_OPTIONAL_KEPT ) {
          // remove the 'optional' class associated with a rule to hide the node
          // to let it show
          removeClass(classes,css.optional); 
          setClasses(node,classes);
          status = STATUS_OPTIONAL_KEPT;
        }
        // else keep the 'optional' class
      }
      anonymize(node,id);
      return Math.max(status,parentStatus); 
    };
     
    var addClone = function(templateNode, data, id) {
      // Add a single clone of the template node as next sibling if it is the 
      // first clone, or next to the last clone added to this template
      // 
      // In addition, this method:
      //   - sets the property bezen.lastClone of the template to the new clone
      //   - removes all id attributes found in the clone (if any)
      //   - removes the class 'template' from the clone (if present)
      //   - processes 'list' and 'optional' elements and replaces parameters 
      //     found in the clone, following the behaviors described in the
      //     documentation at the top of this file
      //
      // param:
      //   templateNode - (DOM node) (!nil) the prototype node to clone
      //   data - (object) (!nil) dynamic data for parameter replacements and
      //          the processing of 'list' elements
      //   id - (object) (optional) a result parameter to collect the clones
      //        of any element having an id in the template node. If the clone
      //        is removed during the processing, it will not be set.
      //
      // return: (DOM node)
      //   null when the clone is 'optional' and it was not added to the DOM
      //   the new clone, just added to the DOM, otherwise
       
      var clone = templateNode.cloneNode(true);
      var status = initNode(clone,data,id);
      if (status === STATUS_OPTIONAL_NIXED){
        return null;
      }
       
      if (clone.className){
        var classes = getClasses(clone);
        removeClass(classes,css.template);
        setClasses(clone, classes);
      }
       
      var meta = templateNode.bezen;
      if (meta){
        insertAfter(meta.lastClone, clone);
        meta.lastClone = clone;
      } else { 
        insertAfter(templateNode, clone);
        templateNode.bezen = {lastClone: clone};
      }
       
      return clone;
    };
    
    // Assign to bezen.template
    // for backward compatibility
    bezen.template = { // public API
      setAliases: setAliases,
      removeClones: removeClones,
      initNode: initNode,
      addClone: addClone,
       
      _: { // private section, for unit tests
        STATUS_NO_CHANGE: STATUS_NO_CHANGE,
        STATUS_SUCCESS: STATUS_SUCCESS,
        STATUS_OPTIONAL_NIXED: STATUS_OPTIONAL_NIXED,
        STATUS_OPTIONAL_KEPT: STATUS_OPTIONAL_KEPT,
        STATUS_MISSING: STATUS_MISSING,
        STATUS_FAILED: STATUS_FAILED,
        aliases: css,
        getBaseUrl: getBaseUrl,
        getNodeValue: getNodeValue,
        replaceParams: replaceParams,
        anonymize: anonymize
      }
    };
    return bezen.template;
  }
);
/*
 * bezen.testrunner.js - Test Runner for Unit Tests
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define, window, navigator, setTimeout */
define('bezen.testrunner',["./bezen", "./bezen.style", "./bezen.log", "./bezen.error"],
  function(bezen,  style,           log,           error) {
 
    // Define aliases
    var getClasses = style.getClasses,
        removeClass = style.removeClass,
        addClass = style.addClass,
        setClasses = style.setClasses,
        $ = bezen.$;
     
    // all unit tests defined by each separate test module
    //
    // Each test is a function, set to a property with the same name as the 
    // tested function, e.g.
    //   { 'bezen.module1.function1': testFunction1,
    //     'bezen.module2.function2': testFunction2, ...}
    // where testFunction1, testFunction2, are unit test functions for
    // function1 from module 'bezen.module1' and function2 from 'bezen.module2'.
    var allUnitTests = {};
    
    var define = function(closures, module) {
      // Define a list of unit tests to be run.
      //
      // Params:
      //   closure - (object) a list of unit tests as an object with key/values.
      //             Each entry in the list object should be in the form:
      //             * name: name of the test, in the form package.function or
      //                     package.subpackage.function for better log display
      //             * closure: reference to the function to be run
      //
      //   module - (string) (optional) (default: '') the module name, to be
      //            prepended to all the test names, separated with an extra '.'
      
      if (module) {
        module = module + '.';
      } else {
        module = '';
      }
       
      for (var name in closures) {
        if (closures.hasOwnProperty(name) ) {
          var testName = module+name;
          allUnitTests[testName] = closures[name];
          log.info('Defined: bezen.testrunner.run("'+testName+'")',true);
        }
      }
    };
    
    var updateProgress = function(status,progressBar,statusText){
      // update the optional progress bar and status text based on given status
      //
      // Either and both of the progressBar and the progressText can be omitted.
      //
      // params:
      //   status - (object) test status, of the form
      //            { total: 0,        // (number) total tests run
      //              pass: 0,         // (number) successful tests
      //              fail: 0 }        // (number) failed tests
      //   progressBar - (DOM node) (optional) a div representing a progress bar
      //                 The width of the div will be set, in percentage, to 
      //                 reflect the progress of the test from 0% to 100%.
      //                 The class 'fail' will be added if at least one test 
      //                 failed (status.fail>0), otherwise the class 'pass' will
      //                 be added. When adding 'fail' or 'pass', the opposite 
      //                 class will be removed if present.
      //   statusText -  (DOM node) (optional) an area to display a status text
      //                 in the form '{status.pass} / {status.total}' with the 
      //                 properties in curly braces replaced by their value.
      
      if (progressBar){
        var widthPercent, failed = false;
        if (status.total===0){
          widthPercent = 100;
          failed = true;
        } else {
          widthPercent = 
            Math.round( 100*(status.pass+status.fail)/status.total );
          failed = status.fail > 0;
        }
        
        progressBar.style.width = widthPercent+'%';
        var classes = getClasses(progressBar);
        if (failed) {
          addClass(classes,'fail');
          removeClass(classes,'pass');
        } else {
          removeClass(classes,'fail');
          addClass(classes,'pass');
        }
        setClasses(progressBar,classes);
      }
       
      if (statusText){
        statusText.innerHTML = status.pass + ' / ' + status.total;
      }
    };

    var unitTest = function(name, runTest){
      // create a new unit test with given name and function to run
      //
      // params:
      //   name - (string) (!nil) the name of the unit test
      //   runTest - (function) (!nil) the function to run for the test
      //
      // return: (object)
      //   the new unit test object, with following public methods:
      //     getName(): string - return the test name
      //     run() - run the test, isStarted() becomes true
      //     isStarted(): boolean - whether the test started
      //     isPassed(): boolean - whether the test is in success state
      //     fail() - set this test to a failure state
      //     startAsyncTest() - report the start of an asynchronous test
      //     endAsyncTest() - report the end of an asynchronous test
      //     hasToWait(): boolean - whether some asynchronous tests have not yet
      //                            been reported as ended
       
      // has this test started to run?
      var hasStarted = false;
      
      // has this test the failed status?
      var hasFailed = false;
       
      // how many asynchronous tests are there still running?
      var asyncTestsRunning = 0;
      
      // backup of the previous window.onerror handler, replaced when
      // asynchronous tests are running to report their end in case of error
      var windowOnError = null;
      
      // this instance of unit test
      var that = {};
      
      var getName = that.getName = function(){
        // get the name of the unit test
        //
        // return: (string)
        //   the name of the unit test, provided in the constructor
         
        return name;
      };
       
      var isStarted = that.isStarted = function(){
        // get whether the test has started to run
        // 
        // return: (boolean)
        //   false before the test has started
        //   true when the test has started
         
        return hasStarted;
      };
       
      var hasToWait = that.hasToWait = function(){
        // check whether the test runner has to wait for the end of this test,
        // because some asynchronous tests have neither ended nor been 
        // detected in failure by catching errors at window.onload level
        //
        // return: (boolean)
        //   true when at least one asynchronous test is still running
        //   false otherwise
         
        return asyncTestsRunning>0;
      };
       
      var startAsyncTest = that.startAsyncTest = function(){
        // report the start of an asynchronous test as part of this unit test
         
        asyncTestsRunning++;
      };
       
      var endAsyncTest = that.endAsyncTest = function(){
        // report the end of an asynchronous test as part of this unit test
        //
        // When the end of the last asynchronous test is reported, remove
        // the window.onerror handler detecting errors in asynchronous tests
        // and restore the previous handler.
          
        if ( hasToWait() ) {
          asyncTestsRunning--;
          if ( !hasToWait() ){
            // restore previous handler
            window.onerror = windowOnError;
          }
        }
      };
      
      var fail = that.fail = function(){
        // report the test as failed
        //
        // In addition, report one asynchronous test as ended, in case one is
        // still running, 
         
        hasFailed = true;
        endAsyncTest();
      };
        
      var isPassed = that.isPassed = function(){
        // get whether the test has passed successfully
        //
        // return: (boolean)
        //   false if the test was reported as failed
        //   true otherwise
        
        return !hasFailed;
      };
       
      var run = that.run = function(){
        // run the unit test with callback function provided in constructor
        // Also, set the state of the test to started just before, and replace
        // the window.onerror handler just after in case there are asynchronous
        // tests running, to report the end of one asynchronous test each time
        // an error is caught
         
        hasStarted = true;
        try {
          runTest.call(that,that); // call in the context of the test as 'this',
                                   // with the test provided as parameter as well
        } finally {
          if ( hasToWait() ){
            windowOnError = window.onerror; // back up previous handler
            window.onerror = function(message,url,line){
              // catch an asynchronous error and decrement counter
              // log the failure of the test
              endAsyncTest();
              fail();
              log.error(getName() +": "+ message +
                        " at " + url  + "[" + line + "]",true);
              return true; // do not report error in browser
            };
          }
        }
      };
       
      return that;
    };

    var runSelected = function(unitTests, progressBar, statusText, 
                               status, currentTest) {
      // Run selected unit tests
      // Param:
      //   unitTests - (array) (!nil) the list of unit tests to run
      //               Each unit test is an object with a name (string) and
      //               a run (function).
      //   progressBar - (DOM node) (optional) optional progress bar, to be
      //                 updated with updateProgress() after each test completes.
      //   statusText -  (DOM node) (optional) optional status area, to be 
      //                 updated with updateProgress() after each test completes.
      //   status - (object) (optional) accumulator keeping track of current 
      //            state in recursive calls of the function. This object will
      //            be returned as result; it is described below.
      //   currentTest - (object) (optional) current unit test object, in case
      //                 of a recursive call, waiting for this test to complete.
      //
      // return: (object)
      //   the current status of the test:
      //   {
      //     total: 0,        // (number) total tests run
      //     pass: 0,         // (number) successful tests
      //     fail: 0          // (number) failed tests
      //   }
      // Note:
      //   in case the test is not complete yet, (pass+fail<total) the status
      //   object will get updated in following (recursive) runs of this method.
      //   This happens when asynchronous tests have been started in a unit test,
      //   to wait for the end of the unit test before starting a new one.
       
      if (!status) {
        // initial run
        log.info("bezen.testrunner: Started "+new Date(),true);
        log.info(navigator.userAgent,true);
        status = {
          total: unitTests.length,
          pass: 0,
          fail: 0
        };
      }
      
      var runRemainingTestsInAsynchronousMode = function(){
        // wait for the end of asynchronous tests in current unit test and 
        // run the remaining tests in asynchronous mode afterwards
         
        if ( currentTest.hasToWait() ){
          log.info('Waiting for asynchronous tests in '+currentTest.getName() );
          setTimeout(arguments.callee,500);
        } else {
          runSelected(unitTests, progressBar, statusText, status, currentTest);
        }
      };

      currentTest = currentTest || unitTests.shift();
      while(currentTest){
        if ( !currentTest.isStarted() ){ 
          try {
            log.info('Started test "'+currentTest.getName()+'"');
            currentTest.run();
          } catch(e) {
            currentTest.fail();
            log.error(currentTest.getName() +": "+ e.message +
                      " at " + e.fileName + "[" + e.lineNumber + "]",true);
          }
        }
        if ( currentTest.hasToWait() ) {
          // switch to asynchronous execution of tests, wait 500ms
          setTimeout(runRemainingTestsInAsynchronousMode,500);
          return status;
        }
        if ( currentTest.isPassed() ) {
          status.pass++;
          log.info("PASS: "+currentTest.getName(),true);
        } else {
          status.fail++;
          log.info("FAIL: "+currentTest.getName(),true);
        }
        updateProgress(status,progressBar,statusText);
        currentTest = unitTests.shift();
      }
      var result = "FAILED";
      if (status.pass>0 && status.fail===0 ) {
        result = "PASS";
      }
       
      log.info("bezen.testrunner: "+ result +
        " ("+status.total+" test"+(status.total>1?"s":"")+
        " run, " + status.pass +" succeeded)",true);
      return status;
    };
    
    var run = function(testName, progressBarId, statusTextId) {
      // Run unit tests
      // catching any error occuring
      //
      // param:
      //   testName - (string) (optional) (default: '*') the name of a single 
      //              unit test to run. Defaults to running all tests when 
      //              missing.
      //
      //            Note:
      //              If a wildcard '*' is included at the end of the name,
      //              all tests starting with the text before are run, e.g.
      //              'questionnaire.*' will run all tests defined for 
      //              questionnaire as long as they follow the naming convention
      //              'questionnaire.testSomething'.
      //
      //   progressBarId - (optiona) (string) (default: 'bezen.test.progress') 
      //                   the id of the progress bar in the DOM. In case no
      //                   corresponding element is found, no progress bar will
      //                   be updated for this test.
      //
      //   statusTextId - (optional) (string) (default: 'bezen.test.status')
      //                  the id of the status text area in the DOM. In case no
      //                  corresponding element is found, no status area will be
      //                  updated for this test.
      //
      // return: (object)
      //   an object summarizing the result of the test:
      //   {
      //     total: 0,        // (number) total tests run
      //     pass: 0,         // (number) successful tests
      //     status: "PASS"   // (string) status of the test, one of:
      //                      // PASS - completed successfully
      //                      // FAILED - completed with a failure
      //                      // running - asynchronous tests ongoing
      //   }
      testName = testName || '*';
      progressBarId = progressBarId || 'bezen.test.progress';
      statusTextId = statusTextId || 'bezen.test.status';
       
      error.catchAll(); // log any uncaught errors 
      var unitTests = [];
      if (testName) {
        // Wildcard case: all tests matching starting substring
        if ( testName.charAt(testName.length-1) === '*' ) {
          var start = testName.slice(0,-1);
          for (var p in allUnitTests) {
            if ( allUnitTests.hasOwnProperty(p) ) {
              if ( p.indexOf(start) === 0 ) {
                unitTests.push( unitTest(p,allUnitTests[p]) );
              }
            }
          }
        } else if ( allUnitTests.hasOwnProperty(testName) ) {
          // Standard case: single test
          unitTests.push( unitTest(testName, allUnitTests[testName]) );
        }
      }
       
      return runSelected(unitTests,$(progressBarId),$(statusTextId));
    };  

    // Assign to bezen.testrunner,
    // for backward compatibility
    bezen.testrunner = {
      // public API
      define: define,
      run: run,
       
      _:{ // private section, for unit tests
        updateProgress: updateProgress,
        unitTest: unitTest,
        runSelected: runSelected,
        allUnitTests: allUnitTests
      }
    };

    return bezen.testrunner;
  }
);
