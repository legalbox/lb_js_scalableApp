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

  function testLanguageCompare(){
    var ut = lb.base.i18n.languageCompare;

    try {
      ut();
      ut(null,null);
      ut(null,{});
      ut({},null);
    } catch(e) {
      assert.fail("No error expected when comparing non-string values: "+e);
    }

    // simple equality
    assert.equals( ut('',''), 0,                         "Expected: '' = ''");
    assert.equals( ut('abc','abc'), 0,             "Expected: 'abc' = 'abc'");
    assert.equals( ut('abc-def','abc-def'), 0,
                                           "Expected: 'abc-def' = 'abc-def'");

    // case-insensitive equality
    assert.equals( ut('fr','fr'), 0,                 "Expected: 'fr' = 'fr'");
    assert.equals( ut('fr','FR'), 0,                 "Expected: 'fr' = 'FR'");
    assert.equals( ut('Fr','fR'), 0,                 "Expected: 'Fr' = 'fR'");
    assert.equals( ut('en-GB','en-gb'), 0,     "Expected: 'en-GB' = 'en-gb'");
    assert.equals( ut('EN-GB','EN-gb'), 0,     "Expected: 'EN-GB' = 'EN-gb'");

    // lexical order, case-insensitive <2
    assert.equals( ut('','abc'), -2,                 "Expected: '' <2 'abc'");
    assert.equals( ut('','ABC'), -2,                 "Expected: '' <2 'ABC'");
    assert.equals( ut('abc','d'), -2,               "Expected: 'abc' <2 'd'");
    assert.equals( ut('abc','D'), -2,               "Expected: 'abc' <2 'D'");
    assert.equals( ut('ABC','d'), -2,               "Expected: 'ABC' <2 'd'");
    assert.equals( ut('d','def'), -2,               "Expected: 'd' <2 'def'");
    assert.equals( ut('D','def'), -2,               "Expected: 'D' <2 'def'");
    assert.equals( ut('d','DEF'), -2,               "Expected: 'd' <2 'DEF'");

    // transitivity: lexical order, case-insensitive <2
    assert.equals( ut('','d'), -2,                    "Expected: '' <2 'd'");
    assert.equals( ut('','D'), -2,                    "Expected: '' <2 'D'");
    assert.equals( ut('','def'), -2,                "Expected: '' <2 'def'");
    assert.equals( ut('','DEF'), -2,                "Expected: '' <2 'DEF'");
    assert.equals( ut('ABC','def'), -2,          "Expected: 'ABC' <2 'def'");
    assert.equals( ut('abc','DEF'), -2,          "Expected: 'abc' <2 'DEF'");

    // symmetry: lexical order, case-insensitive >2
    assert.equals( ut('abc',''), 2,                 "Expected: 'abc' >2 ''");
    assert.equals( ut('aBC',''), 2,                 "Expected: 'aBC' >2 ''");
    assert.equals( ut('d','abc'), 2,               "Expected: 'd' >2 'abc'");
    assert.equals( ut('D','abc'), 2,               "Expected: 'D' >2 'abc'");
    assert.equals( ut('d','ABC'), 2,               "Expected: 'd' >2 'ABC'");
    assert.equals( ut('def','d'), 2,               "Expected: 'def' >2 'd'");
    assert.equals( ut('DEF','d'), 2,               "Expected: 'DEF' >2 'd'");
    assert.equals( ut('def','D'), 2,               "Expected: 'def' >2 'D'");

    // transitivity: lexical order, case-insensitive >2
    assert.equals( ut('d',''), 2,                    "Expected: 'd' >2 ''");
    assert.equals( ut('D',''), 2,                    "Expected: 'D' >2 ''");
    assert.equals( ut('def',''), 2,                "Expected: 'def' >2 ''");
    assert.equals( ut('DEF',''), 2,                "Expected: 'DEF' >2 ''");
    assert.equals( ut('def','ABC'), 2,          "Expected: 'def' >2 'ABC'");
    assert.equals( ut('DEF','abc'), 2,          "Expected: 'DEF' >2 'abc'");

    // hyphen-separated case-insensitive substrings: <1
    assert.equals( ut('','fr'), -1,                  "Expected: '' <1 'fr'");
    assert.equals( ut('','FR'), -1,                  "Expected: '' <1 'FR'");
    assert.equals( ut('','fR'), -1,                  "Expected: '' <1 'fR'");
    assert.equals( ut('fr','fr-ca'), -1,        "Expected: 'fr' <1 'fr-ca'");
    assert.equals( ut('FR','fr-ca'), -1,        "Expected: 'FR' <1 'fr-ca'");
    assert.equals( ut('fr','fr-CA'), -1,        "Expected: 'fr' <1 'fr-CA'");
    assert.equals( ut('fr-ca','fr-ca-quebec'), -1,
                                      "Expected: 'fr-ca' <1 'fr-ca-quebec'");
    assert.equals( ut('FR-CA','fr-ca-quebec'), -1,
                                      "Expected: 'FR-CA' <1 'fr-ca-quebec'");
    assert.equals( ut('fr-ca','Fr-Ca-Quebec'), -1,
                                      "Expected: 'fr-ca' <1 'Fr-Ca-Quebec'");

    // transitivity: hyphen-separated case-insensitive substrings: <1
    assert.equals( ut('','fr-ca'), -1,            "Expected: '' <1 'fr-ca'");
    assert.equals( ut('','fr-CA'), -1,            "Expected: '' <1 'fr-CA'");
    assert.equals( ut('','FR-ca'), -1,            "Expected: '' <1 'FR-ca'");
    assert.equals( ut('','fr-ca-quebec'), -1,
                                           "Expected: '' <1 'fr-ca-quebec'");
    assert.equals( ut('','FR-ca-quebec'), -1,
                                           "Expected: '' <1 'FR-ca-quebec'");
    assert.equals( ut('','fr-CA-Quebec'), -1,
                                           "Expected: '' <1 'fr-CA-Quebec'");
    assert.equals( ut('FR','fr-ca-quebec'), -1,
                                         "Expected: 'FR' <1 'fr-ca-quebec'");
    assert.equals( ut('fr','FR-ca-quebec'), -1,
                                         "Expected: 'fr' <1 'FR-ca-quebec'");
    assert.equals( ut('fR','fr-CA-Quebec'), -1,
                                           "Expected: '' <1 'fr-CA-Quebec'");

    // hyphen-separated case-insensitive substrings: >1
    assert.equals( ut('fr',''), 1,                  "Expected: 'fr' >1 ''");
    assert.equals( ut('FR',''), 1,                  "Expected: 'FR' >1 ''");
    assert.equals( ut('fR',''), 1,                  "Expected: 'fR' >1 ''");
    assert.equals( ut('fr-ca',''), 1,          "Expected: 'fr-ca' >1 'fr'");
    assert.equals( ut('fr-ca','FR'), 1,        "Expected: 'fr-ca' >1 'FR'");
    assert.equals( ut('fr-CA','fr'), 1,        "Expected: 'fr-CA' >1 'fr'");
    assert.equals( ut('fr-ca-quebec','fr-ca'), 1,
                                     "Expected: 'fr-ca-quebec' >1 'fr-ca'");
    assert.equals( ut('fr-ca-quebec','FR-CA'), 1,
                                     "Expected: 'fr-ca-quebec' >1 'FR-CA'");
    assert.equals( ut('Fr-Ca-Quebec','fr-ca'), 1,
                                     "Expected: 'Fr-Ca-Quebec' >1 'fr-ca'");

    // transitivity: hyphen-separated case-insensitive substrings: >1
    assert.equals( ut('fr-ca',''), 1,            "Expected: 'fr-ca' >1 ''");
    assert.equals( ut('fr-CA',''), 1,            "Expected: 'fr-CA' >1 ''");
    assert.equals( ut('FR-ca',''), 1,            "Expected: 'FR-ca' >1 ''");
    assert.equals( ut('fr-ca-quebec',''), 1,
                                           "Expected: 'fr-ca-quebec' >1 ''");
    assert.equals( ut('FR-ca-quebec',''), 1,
                                           "Expected: 'FR-ca-quebec' >1 ''");
    assert.equals( ut('fr-CA-Quebec',''), 1,
                                           "Expected: 'fr-CA-Quebec' >1 ''");
    assert.equals( ut('fr-ca-quebec','FR'), 1,
                                         "Expected: 'fr-ca-quebec' >1 'FR'");
    assert.equals( ut('FR-ca-quebec','fr'), 1,
                                         "Expected: 'FR-ca-quebec' >1 'fr'");
    assert.equals( ut('fr-CA-Quebec','fR'), 1,
                                         "Expected: 'fr-CA-Quebec' >1 'fR'");
  }

  function testEquals(){
    var ut = lb.base.i18n.equals;

    try {
      ut();
      ut(null,null);
      ut(null,{});
      ut({},null);
    } catch(e) {
      assert.fail("No error expected when comparing non-string values: "+e);
    }

    // string-equality
    assert.isTrue( ut('',''),             "empty string must equal itself");
    assert.isTrue( ut('fr','fr'),         "expected: 'fr' = 'fr'");
    assert.isTrue( ut('fr-fr','fr-fr'),   "expected: 'fr-fr' = 'fr-fr'");
    assert.isTrue( ut('en','en'),         "expected: 'en' = 'en'");
    assert.isTrue( ut('en-gb','en-gb'),   "expected: 'en-gb' = 'en-gb'");

    // case-insensitive equality
    assert.isTrue( ut('fr','FR'),         "expected: 'fr' = 'FR'");
    assert.isTrue( ut('FR','fr'),         "expected: 'FR' = 'fr'");
    assert.isTrue( ut('fR','Fr'),         "expected: 'fR' = 'Fr'");
    assert.isTrue( ut('FR-FR','fr-fr'),   "expected: 'FR-FR' = 'fr-fr'");
    assert.isTrue( ut('fr-fr','FR-FR'),   "expected: 'fr-fr' = 'FR-FR'");
    assert.isTrue( ut('fr-FR','FR-fr'),   "expected: 'fr-FR' = 'FR-fr'");
    assert.isTrue( ut('en','EN'),         "expected: 'en' = 'EN'");
    assert.isTrue( ut('EN','en'),         "expected: 'EN' = 'en'");
    assert.isTrue( ut('eN','En'),         "expected: 'eN' = 'En'");
    assert.isTrue( ut('EN-GB','en-gb'),   "expected: 'EN-GB' = 'en-gb'");
    assert.isTrue( ut('en-gb','EN-GB'),   "expected: 'en-gb' = 'EN-GB'");
    assert.isTrue( ut('eN-gB','En-Gb'),   "expected: 'eN-gB' = 'En-Gb'");

    //  case-insensitive difference
    assert.isFalse( ut('fr','en'),         "expected: 'fr' != 'en'");
    assert.isFalse( ut('fr-fr','fr-ca'),   "expected: 'fr-fr' != 'fr-ca'");
    assert.isFalse( ut('en','FR'),         "expected: 'en' != 'FR'");
    assert.isFalse( ut('en-GB','EN-us'),   "expected: 'en-GB' != 'EN-us'");
  }

  function testContains(){
    var ut = lb.base.i18n.contains;

    try {
      ut();
      ut(null,null);
      ut(null,{});
      ut({},null);
    } catch(e) {
      assert.fail("No error expected when comparing non-string values: "+e);
    }

    assert.isTrue( ut('fr-Ca-Quebec','fr-CA'),
                                          "Expected: Quebec contains Canada");
    assert.isTrue( ut('fr-Ca-Quebec','fr'),
                                          "Expected: Quebec contains French");
    assert.isTrue( ut('fr-Ca-Quebec',''),     "Expected: Quebec contains ''");
    assert.isTrue( ut('FR-ca',''),            "Expected: Canada contains ''");
    assert.isTrue( ut('FR-ca','fr'),      "Expected: Canada contains French");
    assert.isTrue( ut('Fr',''),               "Expected: French contains ''");

    assert.isFalse( ut('test','abcd'),           "same length is not enough");
    assert.isFalse( ut('te-st','test'),         "hyphen must not be ignored");
    assert.isFalse( ut('test','te'),               "substring is not enough");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetBrowserLanguage: testGetBrowserLanguage,
    testGetLanguage: testGetLanguage,
    testSetLanguage: testSetLanguage,
    testLanguageCompare: testLanguageCompare,
    testEquals: testEquals,
    testContains: testContains
  };

  testrunner.define(tests, "lb.base.i18n");
  return tests;

}());
