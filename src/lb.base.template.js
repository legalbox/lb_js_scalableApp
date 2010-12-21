/*
 * Namespace: lb.base.template
 * Base Template Module
 *
 * This module provides the basis for HTML templates using a set of functions
 * as filters to modify the input. See applyFilters() for details.
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
 * 2010-12-21
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.template = lb.base.template || (function() {
  // Builder of
  // Closure for lb.base.template module

  function applyFilters(filters,input){
    // Function: applyFilters(filters,input...): any
    // Apply filters successively to input made of following arguments.
    //
    // This method may be applied to several types of input, e.g. strings or
    // DOM nodes, using different sets of filters according to expected types.
    //
    // Design of HTML Templates:
    // Here is a proposed solution for HTML Templates using this method.
    // The input would be a DOM node and an optional context object.
    // | var node = element('span',{},'Welcome #name#');
    // | applyFilters(
    // |   filters,
    // |   node,
    // |   {
    // |     language:'en-US',
    // |     data:
    // |     {
    // |       name:'John Doe'
    // |     }
    // |   }
    // | );
    // The first filter may implement top-down parsing in the following way:
    // | var ELEMENT_NODE = 1;
    // | function topDownParsing(filters,node,context){
    // |   if (!node || node.nodeType!==ELEMENT_NODE){
    // |     return;
    // |   }
    // |   var i, length, attribute, child;
    // |   for (i=0, length=node.attributes.length; i<length; i++){
    // |     attribute = node.attributes[i];
    // |     applyFilters(filters,attribute,context);
    // |   }
    // |   for (i=0, length=node.childNodes.length; i<length; i++){
    // |     child = node.childNodes[i];
    // |     applyFilters(filters,child,context);
    // |   }
    // | }
    // A more specific filter may operate the replacement of parameter values:
    // | var PARAM_REGEXP = /#([a-zA-Z0-9\-]+)#/g;
    // | function replaceParams(filters,node,context){
    // |   if ( !node || !node.nodeValue || !node.nodeValue.replace ||
    // |        !context || !context.data){
    // |     return;
    // |   }
    // |   node.nodeValue = node.nodeValue.replace(
    // |     PARAM_REGEXP,
    // |     function(match,param){
    // |       return context.data[param];
    // |     }
    // |   );
    // | }
    //
    // Design of String Templates:
    // This is an alternate template system, using as input a string and an
    // optional object for values of parameters to replace in the string.
    // | var greeting = applyFilters(
    // |                  filters,
    // |                  'Welcome #name#',
    // |                  {name: 'John Doe'}
    // |                );
    //
    // A single filter may be provided here to operate the replacement,
    // rewriting replaceParams from the previous example to adapt it to the new
    // input types:
    // | function replaceParamsInString(filters, string, data){
    // |   return string.replace(PARAM_REGEXP, function(match,param){
    // |     return data[param];
    // |   });
    // | }
    //
    // Parameters:
    //   filters - array, list of function filters, ordered from least specific
    //             to most specific. Each filter will be provided the same
    //             arguments present in the call to applyFilters(). Its return
    //             value is interpreted in the following way:
    //             o true or any truthy value to stop the processing
    //             o undefined or any falsy value to continue with next filter
    //   input... - variable number of arguments for input or context
    //
    // Returns:
    //   undefined or any value returned by the last filter run.
    //
    // Note:
    // Filters are applied from last (most specific) to first (least specific).
    // Unless processing is interrupted by a filter returning a truthy value,
    // all filters will be applied in turn, in this order.

    if (!filters){
      return;
    }
    var i, result;
    for (i=filters.length-1; i>=0; i--){
      result = filters[i].apply(this,arguments);
      if (result){
        return result;
      }
    }
  }

  return { // public API
    applyFilters: applyFilters
  };
}());
