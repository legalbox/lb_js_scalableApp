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
 * out.
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
    return getOption('lbLanguage',defaultLanguage).toLowerCase();
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
    //              (or any value without the toLowerCase() property) act as a
    //              wildcard to return all language variants.
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

    var isWildcard = language===undefined ||
                     language===null ||
                     !language.toLowerCase,
        languageProperties = [],
        i,
        languageVariant;
    if (!isWildcard){
      language = language.toLowerCase();
    }
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
    //   Nothing happens in case the given language code is null, undefined,
    //   or misses the toLowerCase method.
    if ( languageCode===undefined ||
         languageCode===null ||
         !languageCode.toLowerCase ){
      return;
    }

    // Note: array.sort does not guarantee that the order of items with the
    // same value is preserved. This is the case in recent versions of Firefox,
    // Opera and Chrome, but not in IE and Safari.
    //
    // Thus I chose to insert the new item at the highest position where
    // the lexical order of previous language is lesser or equal, instead of
    // adding the item to the array and calling sort().

    var lowerCaseLanguageCode = languageCode.toLowerCase(),
        insertionPosition = 0,
        length = languages.length,
        j;

    // find the first suitable position for insertion
    for (j=length-1; j>=0; j--){
      if (lowerCaseLanguageCode >= languages[j].code){
        insertionPosition = j+1; // insert just after
        break;
      }
    }

    // insert new language at found location (possibly 0)
    languages.splice(insertionPosition,0,{
      code: lowerCaseLanguageCode,
      properties: languageProperties
    });
  }

  function getProperty(){
    // Function: getProperty(...,name): any
    // Lookup the property with given name, optionally nested within
    // other properties, based on language configured in 'lbLanguage' property.
    //
    // The last argument is the name of the property. Preceding arguments
    // are the names of parent properties, allowing to nest a property
    // within sections and subsections. In any case, the first property is
    // always looked for at the top of language variants.
    //
    // Parameters:
    //   ... - string, the name of parent properties, starting at the top level
    //   name - string, the name of the looked up property
    //
    // Returns:
    //   * any, the value of the property found in the most specific language
    //     variant according to the language currently selected,
    //   * or null if the property is not found in suitable languages.

    var name,
        properties = getLanguageVariants( getLanguage() ),
        property,
        i,
        j;
    // for each language variant, from most specific to less specific
    for (i=properties.length-1; i>=0; i--){
      property = properties[i]; // start at top
      for (j=0; j<arguments.length && property; j++){
        name = arguments[j];
        if (name in property && j===arguments.length-1){
          return property[name];
        }
        property = property[name];
      }
    }
    return null;
  }

  function getValueOf(){
    // Function: getValueOf(...,name,args): any
    //
    // Lookup the function with given name, optionally nested within
    // other properties, based on selected language, and return the first
    // defined result value of such a function.
    //
    // The last two arguments are the name of the function and arguments to be
    // provided in calls to the function. Preceding arguments, if any, are the
    // names of parent properties, allowing to nest the function within
    // sections and subsections. The first property, or the function name in
    // case no parent property is provided, is looked for at the top of
    // language variants for the current language.
    //
    // Parameters:
    //   ... - string, the name of parent properties, starting at the top level
    //   name - string, the name of the looked up function
    //   args - array, the list of arguments for the function
    //
    // Returns:
    //   * any, the value of the most specific function found in given position
    //     which returns a value different from null,
    //   * or null if there is no such function found in suitable languages.

    var namePosition = arguments.length-2,
        name,
        argsPosition = namePosition+1,
        args = arguments[argsPosition],
        properties = getLanguageVariants( getLanguage() ),
        property,
        i,
        j,
        func,
        value;

    // for each language variant, from most specific to less specific
    for (i=properties.length-1; i>=0; i--){
      property = properties[i]; // start at top
      for (j=0; j<=namePosition && property; j++){
        name = arguments[j];
        if (name in property && j===namePosition){
          func = property[name];
          if (typeof func === 'function'){
            value = func.apply(null,args);
            if (value!==undefined && value!==null){
              return value;
            }
          }
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
    getLanguageVariants: getLanguageVariants,
    addLanguageProperties: addLanguageProperties,
    getProperty: getProperty,
    getValueOf: getValueOf,
    reset: reset
  };
}());
