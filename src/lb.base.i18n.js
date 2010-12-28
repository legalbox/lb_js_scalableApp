/*
 * Namespace: lb.base.i18n
 * Base Internationalization (i18n) Module
 *
 * This module provides the basis for the adaptation of a web application to
 * different languages in an international context.
 *
 * This module collects utility methods related to the language of the browser,
 * the language of DOM elements, and comparison of language codes.
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
 * The definition and lookup of language properties associated with language
 * codes is managed in <lb.base.i18n.data>.
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
/*global lb, goog, navigator */
// preserve the module, if already loaded
lb.base.i18n = lb.base.i18n || (function() {
  // Builder of
  // Closure for lb.base.i18n module

  // Define aliases

      /*requires lb.base.dom.js */
  var dom = lb.base.dom,
      hasAttribute = dom.hasAttribute,
      ELEMENT_NODE = dom.ELEMENT_NODE;

  function getBrowserLanguage(){
    // Function: getBrowserLanguage(): string
    // Get the browser's language.
    //
    // Returns:
    //   string, the language code of the browser's language, as retrieved in
    //   navigator.language or navigator.browserLanguage.
    //
    // References:
    //   window.navigator.language - MDC Doc Center
    //   https://developer.mozilla.org/En/Navigator.language
    //
    //   navigator Object - MSDN
    //   http://msdn.microsoft.com/en-us/library/ms535867%28VS.85%29.aspx

    return navigator.language || navigator.browserLanguage;
  }

  function getLanguage(htmlElement){
    // Function: getLanguage([htmlElement]): string
    // Get the language of given HTML element.
    //
    // The language is computed by looking at the value of the 'lang' attribute
    // of the node itself, then looking for a value inherited from the closest
    // ancestor defining a 'lang' attribute. The value '' (empty string) is
    // returned either when no language matched or when a 'lang' attribute is
    // found set to the explicit value ''.
    //
    // In this implementation, only the 'lang' attribute is considered. A
    // future version may take the 'xml:lang' attribute into account as well.
    //
    // This method can be called without argument to return the language of the
    // document element.
    //
    // Parameter:
    //   htmlElement - DOM Node, optional, defaults to the root HTML element,
    //                 a DOM element.
    //
    // Returns:
    //   string, the value of the first 'lang' attribute found on the node or
    //   its closest ancestor element, or the empty string '' by default.
    htmlElement = htmlElement || document.documentElement;

    var ancestorOrSelf = htmlElement;
    while(ancestorOrSelf){
      // IE returns '' by default even when no lang attribute was set.
      // hasAttribute() checks whether the attribute 'lang' was set explicitly.
      if ( hasAttribute(ancestorOrSelf,'lang') ){
        return ancestorOrSelf.lang;
      }

      // Note: this implementation cannot offer getLanguage() cross-browser
      // on any kind of node due to the lack of ownerElement property in IE:
      // there is no link back from attribute nodes to their parent element.
      ancestorOrSelf = ancestorOrSelf.parentNode;
    }
    return '';
  }

  function setLanguage(languageCode,htmlElement){
    // Function: setLanguage(languageCode[,htmlElement])
    // Set the language of given HTML element.
    //
    // The method can be called with a single argument to set the language
    // of the document element.
    //
    // In current implementation, the language is set to the 'lang' attribute
    // of given node only. It may also be set to the 'xml:lang' attribute in a
    // future version.
    //
    // Parameters:
    //   languageCode - string, the language code identifying the language,
    //                  as defined in RFC5646 "Tags for Identifying Languages"
    //   htmlElement - DOM Element, optional, defaults to root HTML element,
    //                 the DOM element to set the language to.
    //
    // Note:
    // Nothing happens in case the language code is not a string or the given
    // html node is not an element.
    htmlElement = htmlElement || document.documentElement;

    if ( typeof languageCode !== 'string' ||
         htmlElement.nodeType !== ELEMENT_NODE ){
      return '';
    }
    htmlElement.lang = languageCode;
  }

  return { // public API
    getBrowserLanguage: getBrowserLanguage,
    getLanguage: getLanguage,
    setLanguage: setLanguage
  };
}());
