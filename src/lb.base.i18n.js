/*
 * Namespace: lb.base.i18n
 * Base Internationalization (i18n) Module
 *
 * This module provides the basis for the adaptation of a web application to
 * different languages in an international context.
 *
 * The issue is addressed in a generic way in this module, which relies on a
 * set of language variants to provide properties including translation strings
 * and behaviors (formatting functions and collators) for each language.
 *
 * When a language variant is added, it is associated with a language string
 * which identifies the language, region and other variations of the language
 * as defined in RFC5646 "Tags for Identifying Languages":
 * - 'en' for English,
 * - 'fr' for French,
 * - 'en-GB' for English/Great Britain,
 * - 'en-US' for English/USA,
 * - 'fr-FR' for French/France,
 * - 'fr-CA' for French/Canada.
 *
 * This module performs lookups in language variants based on the language
 * currently selected for the application. Through the Sandbox, any module can
 * access and modify the language selected for the whole application. Although
 * it was once considered to allow several languages in parallel for different
 * modules, or to perform lookups in a language different from the one selected
 * for the whole application, these features were left out because they made
 * the API more complex and were not supported by intended use cases:
 * - a module may be responsible for displaying and selecting the language for
 * the whole application, resulting in new texts displayed in all modules
 * - a module may be responsible for retrieving selected language from the
 * server through an AJAX call
 * - a module may be responsible for saving the selected language to the server
 * through an AJAX call
 *
 * By default, before a language is selected by a module, the current language
 * is set to the language of the user's browser as returned by:
 * | var defaultLanguage = navigator.language || navigator.browserLanguage;
 * A different default language may be configured on the application core by
 * setting the property 'lbLanguage'. For example, to configure English as the
 * default language of the application:
 * | lb.core.application.setConfig({lbLanguage:'en'});
 *
 * For the lookup of a property or behavior, the selected language is compared
 * to the language tag of each language variants in a case-insensitive manner.
 * Only language variants whose tag is a substring of the selected language are
 * considered. For example, if the selected language is 'en-GB', both 'en' and
 * 'en-GB' are considered, while 'fr' and 'en-US' are left out. The variants
 * are then sorted based on the length of their language tag: longuer language
 * tags correspond to more specific language variants.
 *
 * Based on this simple algorithm, the empty string '' is considered as the
 * language tag of the root language variant, which will always be considered
 * last in the process. Initially, a single language variant is added to this
 * module, <lb.base.i18n.rootLanguageVariant>, associated to the empty
 * language tag '' to provide a default implementation of i18n behaviors.
 *
 * Additional language variants may be added by calling addLanguageVariant().
 * Calling reset() removes all language variants and restores the selected
 * language to its default value.
 *
 * There are two different types of lookup supported in this module,
 * getProperty() and getValueOf(). The former searches for any property and
 * stops as soon as the property is found; the latter searches only for
 * functions, and goes on until the function found returns a defined and not
 * null value.
 *
 * Both getProperty() and getValueOf() consider nested properties: while
 * calling getProperty('tab1') searches for 'tab1' property at the top of
 * language variants, calling getProperty('labels','mainNav','tab1') searches
 * for a 'tab1' property nested in a 'mainNav' property nested in a 'labels'
 * property at the top of language variants.
 *
 * Any custom property may be defined in language variants for the needs of
 * your application. In order the avoid potential name clashes, the name 'lb'
 * is reserved at the top level of language variants:
 * o 'lb' - object, properties and methods defined by Legal-Box
 *
 * Following the above convention, all properties and methods used in the
 * root language variant are located in the 'lb' object. You can refer to
 * <lb.base.i18n.rootLanguageVariant> for a full description. You may override
 * some of the default behaviors by adding a new language variant associated
 * with the empty language tag '', and defining your own methods, with the same
 * name as the ones you wish to override, in the 'lb' object.
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
 * 2010-09-03
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

      // applicationLanguage - string, tag of current language, selected for
      //                       the whole application
      applicationLanguage = null,

      // languageVariants - array, the list of language variant objects,
      //                    sorted by language tag.
      //                    Each object is in the format:
      //                    | {
      //                    |    language: 'en-US', // string, language tag
      //                    |    properties: {...}  // object, properties given
      //                    |                       // in addLanguageVariant()
      //                    | }
      languageVariants = [];

  function getLanguage(){
    // Function: getLanguage(): string
    // Get the current language of the application.
    //
    // This method returns a language tag, in lowercase.
    //
    // Returns:
    //   string, the language tag of current language, in lower case.
    //   In this order:
    //   * the language last selected in setLanguage()
    //   * or the value of configuration property 'lbLanguage'
    //   * or the language of the browser

    if (typeof applicationLanguage==='string'){
      return applicationLanguage;
    }
    var defaultLanguage = navigator.language ||
                          navigator.browserLanguage ||
                          '';
    return getOption('lbLanguage',defaultLanguage).toLowerCase();
  }

  function setLanguage(language){
    // Function: setLanguage(language)
    // Set the current language for the application.
    //
    // Parameter:
    //   language - string, the language tag, as defined in RFC5646
    //              "Tags for Identifying Languages"
    //
    // Note:
    // The language is converted to lower case. Nothing happens if the given
    // argument has no toLowerCase() property.
    if (language===null || language===undefined || !language.toLowerCase){
      return;
    }

    applicationLanguage = language.toLowerCase();
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
    languageVariants.push({
      language: language.toLowerCase(),
      properties: properties
    });
    languageVariants.sort(function(a,b){
      if (a.language <= b.language){
        return -1;
      } else {
        return 1;
      }
    });
  }

  function getProperty(){
    // Function: getProperty(...,name): any
    // Lookup the property with given name, optionally nested within
    // other properties, based on selected language.
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

    applicationLanguage = null;
    languageVariants.length = 0;
  }

  return { // public API
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    getLanguageVariants: getLanguageVariants,
    addLanguageVariant: addLanguageVariant,
    getProperty: getProperty,
    getValueOf: getValueOf,
    reset: reset
  };
}());
