/*
 * Namespace: lb.core.dom
 * DOM (Document Object Model) Application Core Module
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-04-28
 */
/*requires lb.core.js */
/*requires lb.core.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.core.dom = lb.core.dom || (function() {
  // Builder of
  // Closure for lb.core.dom module

  function $(id){
    // Function: $(id)
    // An alias for document.getElementById(id).
    //
    // Parameter:
    //   id - string, the identifier of an HTML element
    //
    // Returns:
    //   the element with given id, if it is found in the document,
    //   null otherwise
    //
    // Note:
    // "Behavior is not defined if more than one element has this ID"
    //
    // DOM Level 2 Core
    // <http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-getElBId>

    
  }

  function element(){

  }

  function getClasses(){

  }

  function addClass(){

  }

  function removeClass(){

  }

  function addListener(){

  }

  function removeListener(){

  }

  return { // public API
    $:$,
    element: element,
    getClasses: getClasses,
    addClass: addClass,
    removeClass: removeClass,
    addListener: addListener,
    removeListener: removeListener
  };
}());
