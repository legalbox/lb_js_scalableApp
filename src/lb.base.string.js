/*
 * Namespace: lb.base.string
 * String Adapter Module for Base Library
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
 * 2010-06-22
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.string = lb.base.string || (function() {
  // Builder of
  // Closure for lb.base.string module

  // Declare alias
      /*requires closure/goog.string.js */
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
