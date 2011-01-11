/*
 * test.lb.base.i18n.data.js - Unit Tests of lb.base.i18n.data module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-11
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.i18n.data.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.i18n.data

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','i18n','data'),
                                 "lb.base.i18n.data namespace was not found");
  }

  function setUp(){

    // Unset the root language of the document, if any
    document.documentElement.removeAttribute('lang');

    // Note:
    // all language variants are removed before each test, to make sure that
    // the behavior is consistent when these tests are run as part of all tests
    lb.base.i18n.data.reset();
  }

  function testGetLanguageCodes(){
    var ut = lb.base.i18n.data.getLanguageCodes;
    setUp();

    assert.arrayEquals( ut(), [],     "no language codes expected initially");

    lb.base.i18n.data.addLanguageProperties('fr-Fr',{});
    lb.base.i18n.data.addLanguageProperties('en',{});
    lb.base.i18n.data.addLanguageProperties('fr-fr',{});
    lb.base.i18n.data.addLanguageProperties('fr',{});
    lb.base.i18n.data.addLanguageProperties('en-us',{});
    lb.base.i18n.data.addLanguageProperties('en-GB',{});
    lb.base.i18n.data.addLanguageProperties('',{});
    lb.base.i18n.data.addLanguageProperties('en-US',{});
    lb.base.i18n.data.addLanguageProperties('EN',{});
    assert.arrayEquals( ut(), ['','en','en-GB','en-us','fr','fr-Fr'],
                                  "unique list of language codes expected, "+
              " duplicates in a case-insensitive comparison must be ignored");
  }

  function testAddLanguageProperties(){
    var ut = lb.base.i18n.data.addLanguageProperties;
    setUp();

    var root = {name:'Root'};
    var english = {name:'English'};
    var englishUSA = {name:'EnglishUSA'};
    var englishGB = {name:'EnglishGB'};
    var french = {name:'French'};
    var frenchFrance = {name:'FrenchFrance'};
    var frenchCanada = {name:'FrenchCanada'};

    ut(undefined,{});
    ut(null,{});
    ut({},{});
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(), [],
               "null, undefined and other non-string values must be ignored");

    ut('en',english);
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(), ['en'],
                                        "language 'en' expected to be added");
    assert.equals( lb.base.i18n.data.get('name','en'), 'English',
                             "English property expected to be defined in en");
    assert.equals( lb.base.i18n.data.get('name','en-GB'), 'English',
                          "English property expected to be defined in en-GB");
    assert.equals( lb.base.i18n.data.get('name','fr'), null,
                         "English property not expected to be defined in fr");

    ut('',root);
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(), ['','en'],
                                   "language codes '','en' expected sorted");
    assert.equals( lb.base.i18n.data.get('name',''), 'Root',
                               "Root property expected to be defined in ''");
    assert.equals( lb.base.i18n.data.get('name','en'), 'English',
                               "Root property expected to be hidden in en");
    assert.equals( lb.base.i18n.data.get('name','en-GB'), 'English',
                            "Root property expected to be hidden in en-GB");
    assert.equals( lb.base.i18n.data.get('name','fr'), 'Root',
                              "Root property expected to be defined in fr");

    ut('fr-FR',frenchFrance);
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(), ['','en','fr-FR'],
                          "3 language codes '','en','fr-FR' expected sorted");
    assert.equals( lb.base.i18n.data.get('name','fr-FR'), 'FrenchFrance',
                     "FrenchFrance property expected to be defined in fr-FR");
    assert.equals( lb.base.i18n.data.get('name',''), 'Root',
                    "FrenchFrance property not expected to be defined in ''");
    assert.equals( lb.base.i18n.data.get('name','en'), 'English',
                    "FrenchFrance property not expected to be defined in en");
    assert.equals( lb.base.i18n.data.get('name','en-GB'), 'English',
                 "FrenchFrance property not expected to be defined in en-GB");

    ut('fr',french);
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(),
                        ['','en','fr','fr-FR'],
                                          "4 language codes expected sorted");
    assert.equals( lb.base.i18n.data.get('name','fr'), 'French',
                              "French property expected to be defined in fr");
    assert.equals( lb.base.i18n.data.get('name','en'), 'English',
                              "French property expected to be defined in en");
    assert.equals( lb.base.i18n.data.get('name','en-GB'), 'English',
                           "French property expected to be defined in en-GB");
    assert.equals( lb.base.i18n.data.get('name','fr-FR'), 'FrenchFrance',
                           "French property expected to be hidden in fr-FR");

    ut('fr-CA',frenchCanada);
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(),
                        ['','en','fr','fr-CA','fr-FR'],
                                  "5 language codes expected sorted");
    assert.equals( lb.base.i18n.data.get('name','fr-CA'), 'FrenchCanada',
                     "FrenchCanada property expected to be defined in fr-CA");
    assert.equals( lb.base.i18n.data.get('name','en'), 'English',
                    "FrenchCanada property not expected to be defined in en");
    assert.equals( lb.base.i18n.data.get('name','en-GB'), 'English',
                 "FrenchCanada property not expected to be defined in en-GB");
    assert.equals( lb.base.i18n.data.get('name','fr'), 'French',
                    "FrenchCanada property not expected to be defined in fr");

    ut('en-GB',englishGB);
    ut('en-US',englishUSA);

    var root2 = {name:'Root2'};
    var french2 = {name:'French2'};
    var frenchFrance2 = {name:'FrenchFrance2'};
    var frenchCanada2 = {name:'FrenchCanada2'};
    var english2 = {name:'English2'};
    var englishUSA2 = {name:'EnglishUSA2'};
    var englishGB2 = {name:'EnglishGB2'};

    ut('',root2);
    ut('FR',french2);
    ut('FR-ca',frenchCanada2);
    ut('fr-fr',frenchFrance2);
    ut('EN',english2);
    ut('en-us',englishUSA2);
    ut('En-Gb',englishGB2);

    try {
      assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(),
                        ['','en','en-GB','en-US','fr','fr-CA','fr-FR'],
                   "7 language variants expected sorted, without duplicates");
      assert.equals( lb.base.i18n.data.get('name',''), 'Root2',
                               "Root2 property expected to be defined in ''");
      assert.equals( lb.base.i18n.data.get('name','fr'), 'French2',
                             "French2 property expected to be defined in fr");
      assert.equals( lb.base.i18n.data.get('name','fr-CA'), 'FrenchCanada2',
                    "FrenchCanada2 property expected to be defined in fr-CA");
      assert.equals( lb.base.i18n.data.get('name','fr-FR'), 'FrenchFrance2',
                    "FrenchFrance2 property expected to be defined in fr-FR");
      assert.equals( lb.base.i18n.data.get('name','en'), 'English2',
                             "English2 property expected to be defined in en");
      assert.equals( lb.base.i18n.data.get('name','en-US'), 'EnglishUSA2',
                      "EnglishUSA2 property expected to be defined in en-US");
      assert.equals( lb.base.i18n.data.get('name','en-GB'), 'EnglishGB2',
                      "EnglishGB2 property expected to be defined in en-GB");
    } catch(e) {
      assert.fail("Property defined last shall hide/replace previous: "+e);
    }
  }

  function testGetDefaultLanguageCode(){
    var ut = lb.base.i18n.data.getDefaultLanguageCode;

    setUp();
    assert.equals( ut(), navigator.language || navigator.browserLanguage,
                   "default language expected to be the browser's language");

    var testLanguageCode = 'TESTlanguageCODE';
    document.documentElement.lang = testLanguageCode;
    assert.equals( ut(), testLanguageCode,
     "value of 'lang' attribute of root HTML element expected to be returned");
  }

  function testGet(){
    var ut = lb.base.i18n.data.get;

    setUp();

    assert.equals( ut(), null,
   "null expected for undefined property in undefined language (no language)");
    assert.equals( ut(''), null,
                  "null expected for undefined property in '' (no language)");
    assert.equals( ut('test',''), null,
                     "null expected for 'test' property in '' (no language)");
    assert.equals( ut('test',{}), null,
                     "null expected for 'test' property in {} (no language)");
    assert.equals( ut('section.subsection.test',''), null,
                     "null expected for dotted property in '' (no language)");
    assert.equals( ut(['section','subsection','test'],''), null,
              "null expected for nested 'test' property in '' (no language)");

    lb.base.i18n.data.addLanguageProperties('',
      {
        name: 'root',
        empty: '',
        test: 'Root Value'
      }
    );

    assert.equals( ut('fr-FR'), null,
                      "null expected for undefined property in fr-FR (root)");
    assert.equals( ut('missing',{}), null,
                        "null expected for missing property in {} (root)");
    assert.equals( ut('missing','fr-FR'), null,
                        "null expected for missing property in fr-FR (root)");
    assert.equals( ut('empty','fr-FR'), '',
                  "empty string expected for empty property in fr-FR (root)");
    assert.equals( ut('test','fr-FR'), 'Root Value',
                   "Root Value expected for 'test' property in fr-FR (root)");
    assert.equals( ut('section.subsection.test','fr-FR'), null,
                  "null expected for dotted nested property in fr-FR (root)");
    assert.equals( ut(['section','subsection','test'],'fr-FR'), null,
                  "null expected for nested 'test' property in fr-FR (root)");

    lb.base.i18n.data.addLanguageProperties('fr',
      {
        name: 'french',
        section:{
          subsection: {
            test: 'French Value'
          }
        }
      }
    );

    assert.equals( ut('fr-FR'), null,
                   "null expected for undefined property in fr-FR (root,fr)");
    assert.equals( ut('missing','fr-FR'), null,
                     "null expected for missing property in fr-FR (root,fr)");
    assert.equals( ut('empty','fr-FR'), '',
               "empty string expected for empty property in fr-FR (root,fr)");
    assert.equals( ut('test','fr-FR'), 'Root Value',
                "Root Value expected for 'test' property in fr-FR (root,fr)");
    assert.equals( ut('section.subsection.test','fr-FR'), 'French Value',
       "French Value expected for dotted nested property in fr-FR (root,fr)");
    assert.equals( ut(['section','subsection','test'],'fr-FR'), 'French Value',
       "French Value expected for nested 'test' property in fr-FR (root,fr)");

    lb.base.i18n.data.addLanguageProperties('frog',
      {
      }
    );
    assert.equals( ut('name','frog'), 'root',
           "'frog' must not inherit 'name' property from 'fr' (root,fr,frog)");

    lb.base.i18n.data.addLanguageProperties('fr-FR',
      {
        name: 'french-France',
        test: 'First France Value',
        section:{
          subsection: {
            test: 'Second France Value'
          }
        }
      }
    );

    assert.equals( ut('fr-FR'), null,
             "null expected for undefined property in fr-FR (root,fr,fr-FR)");
    assert.equals( ut('missing','fr-FR'), null,
               "null expected for missing property in fr-FR (root,fr,fr-FR)");
    assert.equals( ut('empty','fr-FR'), '',
         "empty string expected for empty property in fr-FR (root,fr,fr-FR)");
    assert.equals( ut('test','fr-FR'), 'First France Value',
  "First France Value expected for 'test' property in fr-FR (root,fr,fr-FR)");
    assert.equals( ut('section.subsection.test','fr-FR'),
                   'Second France Value',
                    "Second France Value expected for dotted nested property"+
                                                  "in fr-FR (root,fr,fr-FR)");
    assert.equals( ut(['section','subsection','test'],'fr-FR'),
                   'Second France Value',
                    "Second France Value expected for nested 'test' property"+
                                                  "in fr-FR (root,fr,fr-FR)");

    try {
      assert.equals( ut('FR-fr'), null,
             "null expected for undefined property in FR-FR (root,fr,fr-FR)");
      assert.equals( ut('missing','FR-fr'), null,
               "null expected for missing property in FR-fr (root,fr,fr-FR)");
      assert.equals( ut('empty','FR-fr'), '',
         "empty string expected for empty property in FR-fr (root,fr,fr-FR)");
      assert.equals( ut('test','FR-fr'), 'First France Value',
  "First France Value expected for 'test' property in FR-fr (root,fr,fr-FR)");
      assert.equals( ut('section.subsection.test','FR-fr'),
                   'Second France Value',
                    "Second France Value expected for dotted nested property"+
                                                  "in FR-fr (root,fr,fr-FR)");
      assert.equals( ut(['section','subsection','test'],'FR-fr'),
                   'Second France Value',
                    "Second France Value expected for nested 'test' property"+
                                                  "in FR-fr (root,fr,fr-FR)");
    } catch(e) {
      assert.fail("Case-insensitive comparison on language code expected: "+e);
    }

    assert.equals( ut('fr'), null,
                "nullt.lb.base.i18n.jsexpected for undefined property in fr (root,fr,fr-FR)");
    assert.equals( ut('missing','fr'), null,
                  "null expected for missing property in fr (root,fr,fr-FR)");
    assert.equals( ut('empty','fr'), '',
            "empty string expected for empty property in fr (root,fr,fr-FR)");
    assert.equals( ut('test','fr'), 'Root Value',
             "Root Value expected for 'test' property in fr (root,fr,fr-FR)");
    assert.equals( ut('section.subsection.test','fr'), 'French Value',
    "French Value expected for dotted nested property in fr (root,fr,fr-FR)");
    assert.equals( ut(['section','subsection','test'],'fr'), 'French Value',
    "French Value expected for nested 'test' property in fr (root,fr,fr-FR)");

    assert.equals( ut(''), null,
                 "null expected for undefined property in '' (root,fr,fr-FR)");
    assert.equals( ut('missing',''), null,
                   "null expected for missing property in '' (root,fr,fr-FR)");
    assert.equals( ut('empty',''), '',
             "empty string expected for empty property in '' (root,fr,fr-FR)");
    assert.equals( ut('test',''), 'Root Value',
              "Root Value expected for 'test' property in '' (root,fr,fr-FR)");
    assert.equals( ut('section.subsection.test',''), null,
             "null expected for dotted nested property in '' (root,fr,fr-FR)");
    assert.equals( ut(['section','subsection','test'],''), null,
             "null expected for nested 'test' property in '' (root,fr,fr-FR)");

    var testLanguageCode = 'te-ST';
    document.documentElement.lang = testLanguageCode;
    assert.equals( ut(), null,             "null expected for missing key");

    var dValue = function(){
          return 'D VALUE';
        },
        cValue = {
          d: dValue
        },
        bValue = {
          c: cValue
        },
        aValue = 'A VALUE';
    lb.base.i18n.data.addLanguageProperties(testLanguageCode,{
      a: aValue,
      b: bValue
    });

    assert.equals( ut(), null,                "null expected for missing key");
    assert.equals( ut('a'), aValue,     "a value expected (default language)");
    assert.equals( ut('b'), bValue,     "b value expected (default language)");
    assert.equals( ut('b.c'), cValue,   "c value expected (default language)");
    assert.equals( ut('b.c.d'), dValue, "d value expected (default language)");

    document.documentElement.lang = "OTHER-LANGUAGE-CODE";
    assert.equals( ut('a',testLanguageCode), aValue,
                                      "a value expected (explicit language)");
    assert.equals( ut('b',testLanguageCode), bValue,
                                      "b value expected (explicit language)");
    assert.equals( ut('b.c',testLanguageCode), cValue,
                                      "c value expected (explicit language)");
    assert.equals( ut('b.c.d',testLanguageCode), dValue,
                                      "d value expected (explicit language)");

    assert.equals( ut(['a'],testLanguageCode), aValue,
                      "a value expected (array notation, explicit language)");
    assert.equals( ut(['b'],testLanguageCode), bValue,
                      "b value expected (array notation, explicit language)");
    assert.equals( ut(['b','c'],testLanguageCode), cValue,
                      "c value expected (array notation, explicit language)");
    assert.equals( ut(['b','c','d'],testLanguageCode), dValue,
                      "d value expected (array notation, explicit language)");
  }

  function testGetString(){
    var ut = lb.base.i18n.data.getString;

    setUp();
    assert.equals( ut(), null,              "null expected for missing key");
    assert.equals( ut('missing'), null,   "null expected for key 'missing'");

    var testLanguageCode = 'te-ST';
    document.documentElement.lang = testLanguageCode;

    var noParamValue = 'No Param Value',
        simpleParamValue = '#simple#',
        dottedParamValue = '#dotted.param#',
        complexParamValue = 'Complex #param-to-replace#, #missing#';
    lb.base.i18n.data.addLanguageProperties(testLanguageCode,{
      noParam: noParamValue,
      simpleParam: simpleParamValue,
      dottedParam: dottedParamValue,
      complexParam: complexParamValue
    });

    assert.equals( ut('noParam'), noParamValue,
                          "value without param expected AS IS (no language)");
    assert.equals( ut('simpleParam',{simple:'replacement'}), 'replacement',
                           "simple value replacement expected (no language)");
    assert.equals( ut('dottedParam',
                   {
                     dotted:{
                       param:'replacement'
                     }
                   }), 'replacement',
                           "dotted value replacement expected (no language)");
    assert.equals( ut('complexParam',{'param-to-replace':'value'}),
                   'Complex value, #missing#',
                 "one of two params expected in complex value (no language)");

    document.documentElement.lang = "OTHER-LANGUAGE-CODE";

    assert.equals( ut('noParam',null,testLanguageCode), noParamValue,
                    "value without param expected AS IS (explicit language)");
    assert.equals( ut('simpleParam',{simple:'replacement'},testLanguageCode),
                   'replacement',
                     "simple value replacement expected (explicit language)");
    assert.equals( ut('dottedParam',
                   {
                     dotted:{
                       param:'replacement'
                     }
                   }, testLanguageCode), 'replacement',
                    "dotted value replacement expected (explicit language)");
    assert.equals( ut('complexParam',
                      {'param-to-replace':'value'},
                      testLanguageCode),
                   'Complex value, #missing#',
           "one of two params expected in complex value (explicit language)");
  }

  function testReset(){
    var ut = lb.base.i18n.data.reset;
    setUp();

    lb.base.i18n.data.addLanguageProperties('',{});
    lb.base.i18n.data.addLanguageProperties('fr',{});
    lb.base.i18n.data.addLanguageProperties('en',{});

    ut();
    assert.arrayEquals( lb.base.i18n.data.getLanguageCodes(), [],
                               "no more language codes expected after reset");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetLanguageCodes: testGetLanguageCodes,
    testAddLanguageProperties: testAddLanguageProperties,
    testGetDefaultLanguageCode: testGetDefaultLanguageCode,
    testGet: testGet,
    testGetString: testGetString,
    testReset: testReset
  };

  testrunner.define(tests, "lb.base.i18n.data");
  return tests;

}());
