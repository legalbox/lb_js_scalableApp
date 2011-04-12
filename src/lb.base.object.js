/*
 * Namespace: lb.base.object
 * Object Adapter Module for Base Library
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
 * 2011-04-12
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.object = lb.base.object || (function() {
  // Builder of
  // Closure for lb.base.object module

  // Declare aliases
      /*requires lb.base.type.js */
  var is = lb.base.type.is,
      /*requires closure/goog.js */
      deepCopy = goog.cloneObject,
      /*requires closure/goog.object.js */
      shallowCopy = goog.object.clone;

  function has(object, property){
    // Function: has(object,property[,...]): boolean
    // Check whether an object property is present and not null nor undefined.
    //
    // A chain of nested properties may be checked by providing more than two
    // arguments. Only own properties are considered, properties inherited from
    // the constructor's prototype are ignored.
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
    // |   options = has(options) ? options : {}; // no type coercion
    // |   if (!has(event,'data','value'){
    // |     // safe check: only null/undefined values are rejected;
    // |     // besides, inherited properties are ignored.
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
    //   * true if the object owns the full chain of nested properties for all
    //     arguments provided, and the corresponding value is neither null nor
    //     undefined
    //   * false otherwise
    if ( !is(object) ){
      return false;
    }
    var i,
        length;
    for (i=1, length=arguments.length; i<length; i++){
      property = arguments[i];
      if ( !object.hasOwnProperty(property) ){
        return false;
      }
      object = object[property];
      if ( !is(object) ){
        return false;
      }
    }
    return true;
  }

  function clone(object, deep){
    // Function: clone(object[,deep]): object
    // Get a shallow or a deep copy of an object.
    //
    // Parameter:
    //   object - object, an object or array
    //   deep - boolean, optional, defaults to false, whether to make a deep
    //          copy (true) or a shallow copy (false)
    //
    // Returns:
    //   * a deep copy of given object, when deep is true,
    //   * a shallow copy of given object, wheen deep is false.
    //
    // Notes:
    //   In the case of a deep copy, there must be no cyclic references in the
    //   given object.
    deep = has(deep)? deep : false;

    if (deep) {
      return deepCopy(object);
    } else {
      return shallowCopy(object);
    }
  }

  return { // public API
    has: has,
    clone: clone
  };
}());
