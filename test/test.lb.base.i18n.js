/*
 * test.lb.base.i18n.js - Unit Tests of lb.base.i18n module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-28
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.i18n.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, navigator */
(function() {
  // Builder of
  // Closure object for Test of lb.base.i18n

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.dom.js */
      element = bezen.dom.element,
      hasAttribute = bezen.dom.hasAttribute,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','i18n'),
                                    "lb.base.i18n namespace was not found");
  }

  function setUp(){

    // Unset the root language of the document, if any
    document.documentElement.removeAttribute('lang');
    assert.isFalse( hasAttribute(document.documentElement,'lang'),
                  "assert: no lang attribute expected on root HTML element");
  }

  function testGetBrowserLanguage(){
    var ut = lb.base.i18n.getBrowserLanguage;
    setUp();

    assert.equals( ut(), navigator.language || navigator.browserLanguage,
                                          "browser language expected to be "+
                           "navigator.language or navigator.browserLanguage");
  }

  function testGetLanguage(){
    var ut = lb.base.i18n.getLanguage;
    setUp();

    assert.equals( ut(), '', "document language expected unknown initially");
    assert.equals( ut(null), '',        "Unknown expected for missing node");
    assert.equals( ut(document), '',   "unknown expected for document node");

    var testLanguageCode = 'te-ST';
    document.documentElement.lang = testLanguageCode;
    assert.equals( ut(), testLanguageCode,
                            "document language code expected to be returned");

    var noLanguageElement = element('div',{},'Text');
    assert.equals( ut(noLanguageElement), '',
                              "Unknown expected for element in no language");
    assert.equals( ut(noLanguageElement.firstChild), '',
                              "Unknown expected for text in no language");

    var emptyLangElement =
      element('div',{lang:''},'Text');
    assert.equals( ut(emptyLangElement), '',
                         "Unknown expected for element in unknown language");
    assert.equals( ut(emptyLangElement.firstChild), '',
                            "Unknown expected for text in unknown language");

    var frenchElement =
      element('div',{lang:'fr'},'Texte français');
    assert.equals( ut(frenchElement), 'fr',
                           "French expected for element in French language");
    assert.equals( ut(frenchElement.firstChild), 'fr',
                             "French expected for text in French language");

    var frenchFranceElement =
      element('div',{lang:'fr-FR'},'Texte de France');
    assert.equals( ut(frenchFranceElement), 'fr-FR',
            "French/France expected for element in French/France language");
    assert.equals( ut(frenchFranceElement.firstChild), 'fr-FR',
               "French/France expected for text in French/France language");

    var englishElement = element('div',{lang:'en'},'Text');
    assert.equals( ut(englishElement), 'en',
                        "English expected for element in English language");
    assert.equals( ut(englishElement.firstChild), 'en',
                            "English expected for text in English language");

    // no-lang > no-lang
    var noLanguageEither = element('div',{},'Text');
    noLanguageEither.appendChild(noLanguageElement);
    assert.equals( ut(noLanguageElement), '',
                   "Unknown expected for element in no language (inherited)");
    assert.equals( ut(noLanguageElement.firstChild), '',
                      "Unknown expected for text in no language (inherited)");

    // lang='' > no-lang > no-lang
    emptyLangElement.appendChild(noLanguageEither);
    assert.equals( ut(noLanguageElement), '',
             "Unknown expected for element in unknown language (inherited)");
    assert.equals( ut(noLanguageElement.firstChild), '',
                "Unknown expected for text in unknown language (inherited)");

    // lang='fr' > lang='' > no-lang > no-lang
    frenchElement.appendChild(emptyLangElement);
    assert.equals( ut(noLanguageElement), '',
    "Unknown expected for element in unknown language (French not inherited)");
    assert.equals( ut(noLanguageElement.firstChild), '',
       "Unknown expected for text in unknown language (French not inherited)");

    // lang='fr' > no-lang > no-lang
    frenchElement.appendChild(noLanguageEither);
    assert.equals( ut(noLanguageElement), 'fr',
        "French expected for element in unknown language (French inherited)");
    assert.equals( ut(noLanguageElement.firstChild), 'fr',
           "French expected for text in unknown language (French inherited)");

    // lang='en' > lang='fr' > no-lang > no-lang
    englishElement.appendChild(frenchElement);
    assert.equals( ut(noLanguageElement), 'fr',
    "French expected for element in unknown language (English not inherited)");
    assert.equals( ut(noLanguageElement.firstChild), 'fr',
       "French expected for text in unknown language (English not inherited)");

    assert.equals( ut(frenchElement), 'fr',
    "French expected for element in French language (English not inherited)");
    assert.equals( ut(frenchElement.firstChild), 'fr',
       "French expected for text in French language (English not inherited)");
  }

  function testSetLanguage(){
    var ut = lb.base.i18n.setLanguage;
    setUp();

    ut('en-GB');
    assert.equals( document.documentElement.lang, 'en-GB',
                          "'en-GB' expected to be set to document language");

    ut('other');
    assert.equals( document.documentElement.lang, 'other',
                          "'other' expected to be set to document language");

    var div = element('div');
    ut('fr-FR',div);
    assert.equals( div.lang, 'fr-FR',
                              "'fr-FR' expected to be set to div language");

    ut('ja-JP',div);
    assert.equals( div.lang, 'ja-JP',
                              "'ja-JP' expected to be set to div language");

    try {
      ut('en',div.getAttribute('lang'));
      ut(null,div);
      ut({},div);
    } catch(e){
      assert.fail("No error expected for arguments to ignore: "+e);
    }
    assert.equals( div.lang, 'ja-JP',
      "Non-string language code and non-element node expected to be ignored");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetBrowserLanguage: testGetBrowserLanguage,
    testGetLanguage: testGetLanguage,
    testSetLanguage: testSetLanguage
  };

  testrunner.define(tests, "lb.base.i18n");
  return tests;

}());
