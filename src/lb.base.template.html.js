/*
 * Namespace: lb.base.template.html
 * Base Module for HTML Templates
 *
 * This module defines filter functions for HTML templates, for use with
 * <lb.base.template.applyFilters(input...,filters):any> in the base template
 * module.
 *
 * HTML filters are applied to DOM nodes, which get modified in place. In order
 * to keep the original template for reuse with a different set of values, the
 * node should be cloned before HTML filters are applied.
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
 * 2011-01-11
 */
/*requires lb.base.template.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.template.html = lb.base.template.html || (function() {
  // Builder of
  // Closure for lb.base.template.html module

  // Declare aliases
      /*requires lb.base.array.js */
  var toArray = lb.base.array.toArray,
      /*requires lb.base.dom.js */
      dom = lb.base.dom,
      ELEMENT_NODE = dom.ELEMENT_NODE,
      ATTRIBUTE_NODE = dom.ATTRIBUTE_NODE,
      TEXT_NODE = dom.TEXT_NODE,
      applyFilters = lb.base.template.applyFilters,
      /*requires lb.base.template.string.js */
      stringTemplates = lb.base.template.string,
      withValuesFrom = stringTemplates.withValuesFrom,
      replaceParamsInString = stringTemplates.replaceParams;

  function topDownParsing(node){
    // Function: topDownParsing(node[,context...],filters)
    // Apply filters recursively to attributes and child nodes.
    //
    // The attributes are processed first (the order is browser-dependent),
    // then child nodes are processed in a depth-first recursion.
    //
    // Parameters:
    //   node - DOM Node, a DOM node. Only elements are processed by this
    //          filter, other nodes are left untouched.
    //   context... - any, optional, variable number of parameters providing
    //             context to the transformation. All context arguments are
    //             forwarded in recursive calls to applyFilters().
    //   filters - array of functions, the list of filter functions to be
    //             applied recursively. This argument is required and always
    //             last, which allows filter functions applied to any number
    //             of context arguments to omit it in their declaration.
    //
    // Note:
    // In Internet Explorer, lots of attribute nodes are present with a default
    // value. Only attributes explicitly defined in the document or through
    // JavaScript are processed: attributes that do not have 'specified'
    // property set to true are ignored.
    //
    // Reference:
    //   specified - Interface Attr
    //   http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-637646024
    if ( !node || node.nodeType !== ELEMENT_NODE ){
      return;
    }

    var args = toArray(arguments),
        attributes = toArray(node.attributes),
        childNodes = toArray(node.childNodes),
        i,
        length,
        attribute;

    for (i=0,length=attributes.length; i<length; i++){
      attribute = attributes[i];
      if ( attribute.specified ) {
        args[0] = attribute;
        applyFilters.apply(null,args);
      }
    }
    for (i=0,length=childNodes.length; i<length; i++){
      args[0] = childNodes[i];
      applyFilters.apply(null,args);
    }
  }

  function replaceParams(getValue){
    // Function: replaceParams(getValue): function
    // Get a filter function to replace parameters in attribute and text nodes.
    //
    // This method applies replaceParams() from the base string templates
    // module, and follows the same conventions:
    // - parameters to replace are surrounded by '#' characters
    // - getValue() is called for replacement values
    //
    // See details of parameter format in
    // <lb.base.template.string.replaceParams(getValue): function>.
    //
    // Parameter:
    //   getValue - function, a getter function returning values for the
    //              replacement of parameters:
    //              | function(name): any
    //              The name argument is the name of the parameter to replace.
    //              The getter value should return string values when a
    //              matching property is found, and null otherwise.
    //
    // Returns:
    //   * function, a closure wrapped around the given getter function, with
    //     the following signature:
    //     | Function: filter(htmlNode)
    //     | Replace parameters in attribute and text nodes
    //     | with corresponding values returned by getValue().
    //     |
    //     | The replacements are operated in place in given node.
    //     |
    //     | Parameters:
    //     |   htmlNode - DOM Node, a DOM node. Only attribute and text nodes
    //     |              are considered for parameter replacement.
    //     |              Other nodes are left untouched.
    //   * null when the required getter argument is missing or not a function
    if ( typeof getValue !== 'function' ){
      return null;
    }
    var replaceParamsWithValues = replaceParamsInString(getValue);
    return function(htmlNode){
      if (  !htmlNode ||
            ( htmlNode.nodeType!==ATTRIBUTE_NODE &&
              htmlNode.nodeType!==TEXT_NODE )  ){
        return;
      }
      htmlNode.nodeValue = replaceParamsWithValues(htmlNode.nodeValue);
    };
  }

  return { // public API
    topDownParsing: topDownParsing,
    replaceParams: replaceParams
  };
}());
