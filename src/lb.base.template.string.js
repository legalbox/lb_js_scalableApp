/*
 * Namespace: lb.base.template.string
 * Base String Template Module
 *
 * This module provides the basis for String templates using a set of functions
 * as filters to modify the input.
 * See <lb.base.template.applyFilters(input...,filters):any> for details.
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
 * 2011-01-05
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.template.string = lb.base.template.string || (function() {
  // Builder of
  // Closure for lb.base.template.string module

  // Private fields
  var PARAM_REGEXP = /#([a-zA-Z0-9\_\-\.]+)#/g;

  function replaceParams(string, data){
    // Function: replaceParams(string,data): string
    // Replace parameters in given string with values from given data.
    //
    // The parameters to replace are surrounded by '#' characters, and
    // allow the folowing characters in the name:
    // - letters in the ranges a-z and A-Z
    // - numbers 0-9
    // - symbols '_' and '-', intended as word separators
    // - dot character '.' for properties nested in sections and subsections,
    //   e.g. 'section.subsection.name' which reference the property at the
    //   following location in the data object:
    //   | {
    //   |   section: {
    //   |     subsection: {
    //   |       name: 'value'
    //   |     }
    //   |   }
    //   | }
    //
    // Parameters for which no value is found are left unreplaced.
    //
    // Parameters:
    //   string - string, the template string with parameters to replace
    //   data - object, properties for parameter replacement, which may be
    //          nested in sections and subsections
    //
    // Returns:
    //   string, a string computed from the template string by replacing
    //   named parameters with corresponding values found in data object

    return string.replace(PARAM_REGEXP, function(match,param){
      var properties = data,
          path = param.split('.'),
          pathElement,
          i,
          length;
      for (i=0,length=path.length; i<length && properties; i++){
        pathElement = path[i];
        if ( pathElement in properties && i===length-1 ){
          return properties[pathElement];
        }
        properties = properties[pathElement];
      }
      // no replacement found - return unreplaced param
      return match;
    });
  }

  return { // public API
    replaceParams: replaceParams
  };
}());
