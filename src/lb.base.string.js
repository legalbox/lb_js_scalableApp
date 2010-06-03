/*
 * Namespace: lb.base.string
 * String Adapter Module for Base Library
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
/*requires lb.base.js */
/*requires closure/goog.string.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.string = lb.base.string || (function() {
  // Builder of
  // Closure for lb.base.string module

  // Declare alias
  var gTrim = goog.string.trim;

  function trim(string){
    // Function: trim(string): string
    // Remove white space from the start and end of the string.
    //
    // Parameter:
    //   string - string, a string
    //
    // Returns:
    //   a string with whitespace removed from start and end.
    //   The whitespace within is neither removed nor normalized.

    return gTrim(string);
  }

  return { // public API
    trim: trim
  };
}());
