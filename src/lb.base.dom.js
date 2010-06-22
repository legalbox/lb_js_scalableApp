/*
 * Namespace: lb.base.dom
 * DOM (Document Object Model) Adapter Module for Base Library
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
/*jslint nomen:false, white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom = lb.base.dom || (function() {
  // Builder of
  // Closure for lb.base.dom module

  // Declare aliases
      /*requires closure/goog.dom.js */
  var dom = goog.dom;

  function $(id){
    // Function: $(id): DOM Element
    // An alias for document.getElementById(id).
    //
    // Parameter:
    //   id - string, the identifier of an HTML element
    //
    // Returns:
    //   DOM Element, the element with given id, if present in the document,
    //   null otherwise
    //
    // Note:
    // "Behavior is not defined if more than one element has this ID"
    //
    // DOM Level 2 Core
    // <http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-getElBId>

    //
    return dom.$(id);
  }

  return { // public API
    $:$
  };
}());
