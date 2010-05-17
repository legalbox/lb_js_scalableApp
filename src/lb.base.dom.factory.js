/*
 * Namespace: lb.base.dom.factory
 * DOM (Document Object Model) Factory, Adapter Module for Base Library
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
/*requires lb.base.dom.js */
/*requires closure/goog.dom.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.dom.factory = lb.base.dom.factory || (function() {
  // Builder of
  // Closure for lb.base.dom module

  // Declare aliases
  var createElement = goog.dom.createDom;

  function create(name,attributes){
    // Function: create(name[,attributes[,childNodes]]): Element
    // Create a new element with given name, attributes and child nodes.
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

    // clone arguments before modifying - avoid changing function arguments
    // http://tech.groups.yahoo.com/group/jslint_com/message/11
    var args = Array.prototype.slice.call(arguments);

    // convert name to uppercase to ensure cross-browser consistency
    // (IE keeps original case for unknown nodeName/tagName)
    if (args[0] && args[0].toUpperCase){
      args[0] = args[0].toUpperCase();
    }

    return createElement.apply(this,args);
  }

  return { // public API
    create: create
  };
}());
