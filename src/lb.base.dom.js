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
 * 2010-12-28
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
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

    return dom.$(id);
  }

  function hasAttribute(element, attributeName){
    // Function: hasAttribute(element, attributeName): boolean
    // Check whether an attribute with given name has been specified on
    // given element.
    //
    // The native hasAttribute() function is used when available. When missing,
    // it is emulated by checking DOM level 2 property 'specified' of the
    // attribute node.
    //
    // Parameters:
    //   element - DOM Element, the element to check for given attribute
    //   attributeName - string, an attribute name
    //
    // Returns:
    //   * true if the attribute has been defined on the element,
    //   * false otherwise
    //
    // Note:
    // When the behavior is emulated, in IE, the attribute may not have been
    // defined in the original document or through JavaScript, but may be an
    // optional attribute set to its default value.
    //
    // Source:
    // Adapted from bezen.dom.hasAttribute() in bezen.org JavaScript library,
    // CC-BY: Eric Bréchemier - http://bezen.org/javascript/
    //
    // References:
    //   hasAttribute - introduced in DOM Level 2
    //   http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-ElHasAttr
    //
    //   specified - Interface Attr
    //   http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-637646024
    if (!element || !element.getAttributeNode){
      return false;
    }

    if (element.hasAttribute) {
      return element.hasAttribute(attributeName);
    }

    var attributeNode = element.getAttributeNode(attributeName);
    if (attributeNode === null) {
      return false;
    }
    return attributeNode.specified;
  }

  return {
    // public constants

    // constant: ELEMENT_NODE
    // The nodeType value of element nodes: 1.
    ELEMENT_NODE: 1,
    // constant: ATTRIBUTE_NODE
    // The nodeType value of attribute nodes: 2.
    ATTRIBUTE_NODE: 2,
    // constant: TEXT_NODE
    // The nodeType value of text nodes: 3.
    TEXT_NODE: 3,

    // public API
    $:$,
    hasAttribute: hasAttribute
  };
}());
