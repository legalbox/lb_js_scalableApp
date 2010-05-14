/*
 * Namespace: lb.core.dom.factory
 * Factory of DOM Elements for Legal Web Application
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-14
 */
/*requires lb.core.dom.js */
/*requires lb.base.dom.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.dom.factory = lb.core.dom.factory || (function() {
  // Builder of
  // Closure for DOM Factory

  // Define aliases
  var createElement = lb.base.dom.element;

  function create(name,attributes){
    // Function: create(name[,attributes[,childNodes]]): Element
    // Create a new DOM element with given name, attributes and child nodes.
    //
    // Parameters:
    //   name - string, the name of the element, e.g. 'div'
    //   attributes - object, the set of attributes, 
    //                e.g. {id:'myDiv', 'class':'big box'}
    //   childNodes - array or list, the list of child nodes.
    //                The child nodes may be provided as an array,
    //                or as a list of arguments (after name and attributes).
    //
    // Returns:
    //   Element, the newly created DOM element

    //
    return createElement.apply(this,arguments);
  }

  return { // public API
    create: create
  };
}());
