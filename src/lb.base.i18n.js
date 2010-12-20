/*
 * Namespace: lb.base.i18n
 * Base Internationalization (i18n) Module
 *
 * This module provides the basis for the adaptation of a web application to
 * different languages in an international context.
 *
 * The issue is addressed in a generic way in this module, which relies on
 * language codes associated with a set of language properties defined by the
 * application:
 * - string properties,
 * - functions for localized behavior, formatting and sorting,
 * - object properties, to group properties within. The groups may be nested.
 *
 * A language code is a string which identifies the language, region and other
 * variations of the language as defined in RFC5646 "Tags for Identifying
 * Languages", for example:
 * - 'en' for English,
 * - 'fr' for French,
 * - 'en-GB' for English/Great Britain,
 * - 'en-US' for English/USA,
 * - 'fr-FR' for French/France,
 * - 'fr-CA' for French/Canada.
 *
 * The lookup of language properties is done from the most specific language
 * to the least specific language, with longer language codes considered more
 * specific than shorter language codes. Only language codes which are
 * substrings of the language selected for the lookup are considered.
 * For example, if the selected language is 'en-GB', 'en-GB' and 'en' are
 * considered in this order, while 'en-US', 'fr-FR', 'fr-CA' and 'fr' are left
 * out. Language codes are compared in a case-insensitive way.
 *
 * The empty string '' is the least specific language code possible, which will
 * always be considered last in the lookup process. Common default properties
 * can be associated with the empty language code '', they will be shared by
 * all languages.
 *
 * Any custom property may be defined in language properties for the needs of
 * your application, and associated with a language code by calling
 * addLanguageProperties(). Calling reset() removes all language properties.
 *
 * The list of language codes associated with language properties is returned
 * by getLanguageCodes(). It is initially empty.
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
 * 2010-12-20
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog, navigator */
// preserve the module, if already loaded
lb.base.i18n = lb.base.i18n || (function() {
  // Builder of
  // Closure for lb.base.i18n module

  // Declare aliases
  var getOption = lb.base.config.getOption,

  // private fields

      // languages - array, the list of language objects, sorted by language
      //             code, from least specific to most specific.
      //             Each language object is in the format:
      //             | {
      //             |    code: 'en-US', // string, language code
      //             |    properties: {...}  // object, properties given
      //             |                       // in addLanguageProperties
      //             | }
      // Note:
      // In current implementation, the same language code may be repeated in
      // several language objects. These duplicates may be merged into a single
      // language object in a future implementation (trading less memory for
      // more computations due to added merging step).
      languages = [];

  function getLanguage(){
    // For internal use - refactoring in progress
    // Return the default language configured with 'lbLanguage' property

    var defaultLanguage = navigator.language ||
                          navigator.browserLanguage ||
                          '';
    return getOption('lbLanguage',defaultLanguage);
  }

  function getLanguageCodes(){
    // Function: getLanguageCodes(): array
    // Get the list of language codes associated with language properties.
    //
    // Returns:
    //   array of strings, the list of unique language codes with associated
    //   language properties, sorted from least specific to most specific.

    var i,
        length,
        languageCode,
        previousLanguageCode = null,
        languageCodes = [];
    for (i=0, length=languages.length; i<length; i++){
      languageCode = languages[i].code;
      if (languageCode !== previousLanguageCode){
        languageCodes.push(languageCode);
      }
      previousLanguageCode = languageCode;
    }
    return languageCodes;
  }

  function addLanguageProperties(languageCode,languageProperties){
    // Function: addLanguageProperties(languageCode,languageProperties)
    // Add or replace language properties associated with given language code.
    //
    // Language properties may be specified in multiple calls with the same
    // language code. In case of duplicate properties, the properties defined
    // last are considered more specific and take precedence over properties
    // defined previously.
    //
    // Parameters:
    //   languageCode - string, the language code identifying the language,
    //                  as defined in RFC5646 "Tags for Identifying Languages"
    //   languageProperties - object, a set of language properties
    //
    // Note:
    //   Nothing happens in case the given language code is not a string.
    if ( typeof languageCode!=='string' ){
      return;
    }

    // Note: array.sort does not guarantee that the order of items with the
    // same value is preserved. This is the case in recent versions of Firefox,
    // Opera and Chrome, but not in IE and Safari.
    //
    // Thus I chose to insert the new item at the highest position where
    // the lexical order of previous language is lesser or equal, instead of
    // adding the item to the array and calling sort().

    var insertionPosition = 0,
        length = languages.length,
        j;

    // find the first suitable position for insertion
    for (j=length-1; j>=0; j--){
      if (languageCode >= languages[j].code){
        insertionPosition = j+1; // insert just after
        break;
      }
    }

    // insert new language at found location (possibly 0)
    languages.splice(insertionPosition,0,{
      code: languageCode,
      properties: languageProperties
    });
  }

  function getProperty(languageCode,path){
    // Function: getProperty(languageCode,path): any
    // Get the most specific property for given language code at given path.
    //
    // The path argument may be a string
    // or an array of strings:
    // - the name of a property defined at top level:
    //   e.g. 'propertyName'
    // - the dotted name of a nested property:
    //   e.g. 'section.subsection.propertyName'
    // - the list of sections and subsections:
    //   e.g. ['section','subsection','propertyName']
    //
    // The last two forms are equivalent, both matching a property
    // 'propertyName' nested in a property 'subsection' within a property
    // 'section' at top level of language properties. The array notation allows
    // to look up a property which would contain a dot in its name, without the
    // substitution to a section and subsection: ['no.substitution.done'].
    //
    // Parameters:
    //   name - string, the name of the looked up property, which may be a
    //          dotted string or an array of strings to represent a property
    //          nested within sections and subsections
    //   languageCode - string, the language code to filter relevant languages
    //
    // Returns:
    //   * any, the value of the property found in the most specific language
    //     object whose language code put in lower case is a substring of the
    //     given language code put in lower case
    //   * or null if the property is not found in suitable languages,
    //     if the given path is null or undefined, or if the given language
    //     code is not a string.
    if (path===null || path===undefined || typeof languageCode!=='string'){
      return null;
    }
    if (typeof path === 'string'){
      path = path.split('.');
    }

    var lowerCaseLanguageCode = languageCode.toLowerCase(),
        language,
        i,
        properties,
        pathElement,
        j,
        length;

    // for each language, from most specific (last) to least specific (first)
    for (i=languages.length-1; i>=0; i--){
      language = languages[i];
      // if the language code is found at the start of given language code
      // (toLowerCase() is used to compare in a case-insensitive way)
      // Note:
      // In case optimization is required, the lower case value of each
      // language code may be stored in a property of the language object.
      if ( lowerCaseLanguageCode.indexOf( language.code.toLowerCase() )===0 ){
        // start at top of language properties
        properties = language.properties;
        // for each path element in the given property path
        for (j=0, length=path.length; j<length && properties; j++){
          pathElement = path[j];
          // if the final path element is found
          if (pathElement in properties && j===length-1){
            return properties[pathElement];
          }
          // go on with next level (may be undefined)
          properties = properties[pathElement];
        }
      }
    }
    return null;
  }

  function reset(){
    // Function: reset()
    // Remove all language properties.

    languages.length = 0;
  }

  return { // public API
    getLanguageCodes: getLanguageCodes,
    addLanguageProperties: addLanguageProperties,
    getProperty: getProperty,
    reset: reset
  };
}());
