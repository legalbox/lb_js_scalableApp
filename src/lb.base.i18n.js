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
 * [Note: changes pending - rename addLanguageVariant to addLanguageProperties]
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

      // languageVariants - array, the list of language variant objects,
      //                    sorted by language tag, from less specific to
      //                    most specific.
      //                    Each object is in the format:
      //                    | {
      //                    |    language: 'en-US', // string, language tag
      //                    |    properties: {...}  // object, properties given
      //                    |                       // in addLanguageVariant()
      //                    | }
      languageVariants = [];

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
    for(i=0; i<languageVariants.length; i++){
      languageVariant = languageVariants[i];
      if ( isWildcard ||
        // selected language starts with the tag of this language variant
        language.indexOf(languageVariant.language)===0 ){
        languageProperties.push(languageVariant.properties);
      }
    }
    return languageProperties;
  }

  function addLanguageVariant(language,properties){
    // Function: addLanguageVariant(language,properties)
    // Add a new language variant.
    //
    // Properties for a language variant may be specified in multiple calls
    // with the same language tag. In case of duplicate properties, the ones
    // added last are considered more specific and take precedence.
    //
    // Parameters:
    //   language - string, the language tag identifying the language variant,
    //              as defined in RFC5646 "Tags for Identifying Languages"
    //   properties - object, a set of properties for the language variant
    //
    // Note:
    //   Nothing happens in case the given language string is null, undefined,
    //   or misses the toLowerCase method.
    if (language===undefined || language===null || !language.toLowerCase){
      return;
    }

    // Note: array.sort does not guarantee that the order of items with the
    // same value is preserved. This is the case in recent versions of Firefox,
    // Opera and Chrome, but not in IE and Safari.
    //
    // Thus I chose to insert the new item at the highest position where
    // the lexical order of previous language is lesser or equal, instead of
    // adding the item to the array and calling sort().

    var lowerCaseLanguage = language.toLowerCase(),
        newLanguageVariant = {
          language: lowerCaseLanguage,
          properties: properties
        },
        length = languageVariants.length,
        i = 0,
        j;

    // find the first suitable position for insertion
    for (j=length-1; j>=0; j--){
      if (lowerCaseLanguage >= languageVariants[j].language){
        i = j+1; // insert just after
        break;
      }
    }

    // insert at found location (possibly 0)
    languageVariants.splice(i,0,newLanguageVariant);
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

    languageVariants.length = 0;
  }

  return { // public API
    getLanguageVariants: getLanguageVariants,
    addLanguageVariant: addLanguageVariant,
    getProperty: getProperty,
    getValueOf: getValueOf,
    reset: reset
  };
}());
