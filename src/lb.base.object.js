/*
 * Namespace: lb.base.object
 * Object Adapter Module for Base Library
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
/*requires closure/goog.js */
/*requires closure/goog.object.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.object = lb.base.object || (function() {
  // Builder of
  // Closure for lb.base.object module

  // Declare alias
  var deepCopy = goog.cloneObject,
      shallowCopy = goog.object.clone;

  function clone(object, deep){
    // Function: clone(object[,deep]): object
    // Get a shallow or a deep copy of an object.
    //
    // Parameter:
    //   object - object, an object or array
    //   deep - boolean, optional, whether to make a deep copy (true) or a
    //          shallow copy (false)
    //
    // Returns:
    //   * a deep copy of given object, when deep is true,
    //   * a shallow copy of given object, wheen deep is false.
    //
    // Notes:
    //   In the case of a deep copy, there must be no cyclic references in the
    //   given object.
    deep = deep || false;

    if (deep) {
      return deepCopy(object);
    } else {
      return shallowCopy(object);
    }
  }

  return { // public API
    clone: clone
  };
}());
