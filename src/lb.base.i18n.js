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
 * to the less specific language, with longer language codes considered more
 * specific than shorter language codes. Only language codes which are
 * substrings of the language selected for the lookup are considered.
 * For example, if the selected language is 'en-GB', 'en-GB' and 'en' are
 * considered in this order, while 'en-US', 'fr-FR', 'fr-CA' and 'fr' are left
 * out. Note that language codes are compared in a case-sensitive way.
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
 * [Note: changes pending - add getLanguageCodes]
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
 * 2010-12-17
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
      //             code, from less specific to most specific.
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
    //   language properties, sorted from less specific to most specific.

    var i,
        length,
        languageCode,
        previousLanguageCode = null;
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

  function getLanguageVariants(language){
    // Function: getLanguageVariants(language): array
    // Get the language variants for given language, sorted by language tag
    // from less specific to most specific.
    //
    // Parameter:
    //   language - string, an optional language tag, as defined in RFC5646
    //              "Tags for Identifying Languages".
    //              Omitting the language and null or undefined values
    //              act as a wildcard to return all language variants.
    //
    // Returns:
    //   * array, the list of properties objects for all language variants
    //     whose tag is a subset of given language, ordered by language tag,
    //   * or if the optional language argument is omitted,
    //     array, the list of properties objects for all language variants,
    //     sorted by language tag.
    //
    // Note:
    //   In case several language variants were added for the same tag, the
    //   language variant added last is considered more specific and comes
    //   last in this list.

    var isWildcard = language===undefined || language===null,
        languageProperties = [],
        i,
        languageVariant;
    for(i=0; i<languages.length; i++){
      languageVariant = languages[i];
      if ( isWildcard ||
        // selected language starts with the tag of this language variant
        language.indexOf(languageVariant.code)===0 ){
        languageProperties.push(languageVariant.properties);
      }
    }
    return languageProperties;
  }

  function addLanguageProperties(languageCode,languageProperties){
    // Function: addLanguageProperties(languageCode,languageProperties)
    // Add or replace language properties associated with given language code.
    //
    // Language properties may be specified in multiple calls with the same
    // language code. In case of duplicate properties, the ones last are
    // considered more specific and take precedence over properties defined
    // previously.
    //
    // Parameters:
    //   languageCode - string, the language code identifying the language,
    //                  as defined in RFC5646 "Tags for Identifying Languages"
    //   languageProperties - object, a set of language properties
    //
    // Note:
    //   Nothing happens in case the given language code is null or undefined.
    if ( languageCode===undefined || languageCode===null ){
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

  function getProperty(name){
    // Function: getProperty(name): any
    // Lookup the property with given name, optionally nested within
    // other properties, based on language configured in 'lbLanguage' property.
    //
    // The name argument may be a string or an array of strings, allowing to
    // access a property nested within sections and subsections.
    //
    // A dotted notation may be used alternatively, which will be converted to
    // an equivalent array: 'root.parent.property' is converted to
    // ['root','parent','leaf'] which looks for a property 'root', then for a
    // property 'parent' within, then for a property 'leaf' within.
    //
    // Parameters:
    //   name - string, the name of the looked up property,
    //          which may be dotted to represent a nested property, or an
    //          array of strings to represent a nested property
    //
    // Returns:
    //   * any, the value of the property found in the most specific language
    //     variant according to the language currently selected,
    //   * or null if the property is not found in suitable languages.
    if (name===null || name===undefined){
      return null;
    }

    var path,
        properties = getLanguageVariants( getLanguage() ),
        property,
        i,
        j;
    if (typeof name === 'string'){
      path = name.split('.');
    } else {
      path = name;
    }

    // for each language variant, from most specific to less specific
    for (i=properties.length-1; i>=0; i--){
      property = properties[i]; // start at top
      for (j=0; j<path.length && property; j++){
        name = path[j];
        if (name in property && j===path.length-1){
          return property[name];
        }
        property = property[name];
      }
    }
    return null;
  }

  function reset(){
    // Function: reset()
    // Remove all language variants.

    languages.length = 0;
  }

  return { // public API
    getLanguageCodes: getLanguageCodes,
    getLanguageVariants: getLanguageVariants,
    addLanguageProperties: addLanguageProperties,
    getProperty: getProperty,
    reset: reset
  };
}());
