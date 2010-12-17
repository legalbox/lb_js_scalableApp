/*
 * test.lb.base.i18n.js - Unit Tests of lb.base.i18n module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-17
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
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.base.config.js */
      resetConfig = lb.base.config.reset,
      setOptions = lb.base.config.setOptions;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','i18n'),
                                    "lb.base.i18n namespace was not found");
  }

  function setUp(){

    // reset configuration to delete 'lbLanguage' property
    resetConfig();

    // Note:
    // all language variants are removed before each test, to make sure that
    // the behavior is consistent when these tests are run as part of all tests
    lb.base.i18n.reset();
  }

  function testGetLanguageCodes(){
    var ut = lb.base.i18n.getLanguageCodes;
    setUp();

    assert.arrayEquals( ut(), [],     "no language codes expected initially");
  }

  function testGetLanguageVariants(){
    var ut = lb.base.i18n.getLanguageVariants;
    setUp();

    assert.arrayEquals( ut(), [],        "no module expected after reset()");
  }

  function testAddLanguageProperties(){
    var ut = lb.base.i18n.addLanguageProperties;
    setUp();

    var root = {name:'root'};
    var english = {name:'english'};
    var englishUSA = {name:'englishUSA'};
    var englishGB = {name:'englishGB'};
    var french = {name:'french'};
    var frenchFrance = {name:'frenchFrance'};
    var frenchCanada = {name:'frenchCanada'};

    ut(undefined,{});
    ut(null,{});
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(), [],
                                        "null and undefined must be ignored");

    ut('en',english);
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(), ['en'],
                                        "language 'en' expected to be added");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(), [english],
                                  "1 language variant expected to be added");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en-GB'), [english],
                                      "english expected with filter 'en-GB'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [],
                                    "english must not match filter 'fr'");

    ut('',root);
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(), ['','en'],
                                  "language codes '','en' expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(), [root,english],
                                  "2 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(''), [root],
                                              "root expected for filter ''");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en'), [root,english],
                                "root and english expected with filter 'en'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en-GB'),
                        [root,english],
                             "root and english expected with filter 'en-GB'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [root],
                                    "only root expected with filter 'fr'");

    ut('fr-FR',frenchFrance);
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(), ['','en','fr-FR'],
                          "3 language codes '','en','fr-FR' expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,frenchFrance],
                                  "3 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en'), [root,english],
                            "frenchFrance not expected to match filter 'en'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en-GB'),
                        [root,english],
                         "frenchFrance not expected to match filter 'en-GB'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [root],
                            "frenchFrance not expected to match filter 'fr'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr-FR'),
                        [root,frenchFrance],
                         "root and frenchFrance expected for filter 'fr-FR'");

    ut('fr',french);
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(),
                        ['','en','fr','fr-FR'],
                                          "4 language codes expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,french,frenchFrance],
                                  "4 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en'), [root,english],
                                  "french not expected to match filter 'en'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en-GB'),
                        [root,english],
                            "french not expected to match filter 'en-GB'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'),
                        [root,french],
                                "root and french expected with filter 'fr'");

    ut('fr-CA',frenchCanada);
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(),
                        ['','en','fr','fr-CA','fr-FR'],
                                  "5 language codes expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,french,frenchCanada,frenchFrance],
                                  "5 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en'), [root,english],
                            "frenchCanada not expected to match filter 'en'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('en-GB'),
                        [root,english],
                         "frenchCanada not expected to match filter 'en-GB'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'),
                        [root,french],
                            "frenchCanada not expected to match filter 'fr'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr-CA'),
                        [root,french,frenchCanada],
                 "root, french and frenchCanada expected for filter 'fr-CA'");

    ut('en-GB',englishGB);
    ut('en-US',englishUSA);

    var root2 = {name:'root2'};
    var french2 = {name:'french2'};
    var frenchFrance2 = {name:'frenchFrance2'};
    var frenchCanada2 = {name:'frenchCanada2'};
    var english2 = {name:'english2'};
    var englishUSA2 = {name:'englishUSA2'};
    var englishGB2 = {name:'englishGB2'};

    ut('',root2);
    ut('fr',french2);
    ut('fr-CA',frenchCanada2);
    ut('fr-FR',frenchFrance2);
    ut('en',english2);
    ut('en-US',englishUSA2);
    ut('en-GB',englishGB2);

    assert.arrayEquals( lb.base.i18n.getLanguageCodes(),
                        ['','en','en-GB','en-US','fr','fr-CA','fr-FR'],
                   "7 language variants expected sorted, without duplicates");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [
                         root,         root2,
                         english,      english2,
                         englishGB,    englishGB2,
                         englishUSA,   englishUSA2,
                         french,       french2,
                         frenchCanada, frenchCanada2,
                         frenchFrance, frenchFrance2
                        ],
      "14 language variants expected sorted, last added last for duplicates");
  }

  function testGetProperty(){
    var ut = lb.base.i18n.getProperty;
    setUp();

    assert.equals( ut(), null,
                        "null expected for undefined property (no language)");
    assert.equals( ut('test'), null,
                        "null expected for 'test' property (no language)");
    assert.equals( ut('section.subsection.test'), null,
                   "null expected for dotted property (no language)");
    assert.equals( ut('section','subsection','test'), null,
                   "null expected for nested 'test' property (no language)");

    lb.base.config.setOptions({lbLanguage: 'fr-FR'});

    lb.base.i18n.addLanguageProperties('',
      {
        name: 'root',
        empty: '',
        test: 'Root Value'
      }
    );

    assert.equals( ut(), null,
                            "null expected for undefined property (root)");
    assert.equals( ut('missing'), null,
                              "null expected for missing property (root)");
    assert.equals( ut('empty'), '',
                         "empty string expected for empty property (root)");
    assert.equals( ut('test'), 'Root Value',
                          "Root Value expected for 'test' property (root)");
    assert.equals( ut('section.subsection.test'), null,
                       "null expected for dotted nested property (root)");
    assert.equals( ut('section','subsection','test'), null,
                       "null expected for nested 'test' property (root)");

    lb.base.i18n.addLanguageProperties('fr',
      {
        name: 'french',
        section:{
          subsection: {
            test: 'French Value'
          }
        }
      }
    );

    assert.equals( ut(), null,
                            "null expected for undefined property (root,fr)");
    assert.equals( ut('missing'), null,
                              "null expected for missing property (root,fr)");
    assert.equals( ut('empty'), '',
                         "empty string expected for empty property (root,fr)");
    assert.equals( ut('test'), 'Root Value',
                          "Root Value expected for 'test' property (root,fr)");
    assert.equals( ut('section.subsection.test'), 'French Value',
                "French Value expected for dotted nested property (root,fr)");
    assert.equals( ut(['section','subsection','test']), 'French Value',
                "French Value expected for nested 'test' property (root,fr)");

    lb.base.i18n.addLanguageProperties('fr-FR',
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

    assert.equals( ut(), null,
                      "null expected for undefined property (root,fr,fr-FR)");
    assert.equals( ut('missing'), null,
                        "null expected for missing property (root,fr,fr-FR)");
    assert.equals( ut('empty'), '',
                  "empty string expected for empty property (root,fr,fr-FR)");
    assert.equals( ut('test'), 'First France Value',
           "First France Value expected for 'test' property (root,fr,fr-FR)");
    assert.equals( ut('section.subsection.test'), 'Second France Value',
   "Second France Value expected for dotted nested property (root,fr,fr-FR)");
    assert.equals( ut(['section','subsection','test']), 'Second France Value',
   "Second France Value expected for nested 'test' property (root,fr,fr-FR)");
  }

  function testReset(){
    var ut = lb.base.i18n.reset;
    setUp();

    lb.base.i18n.addLanguageProperties('',{});
    lb.base.i18n.addLanguageProperties('fr',{});
    lb.base.i18n.addLanguageProperties('en',{});

    ut();
    assert.arrayEquals( lb.base.i18n.getLanguageCodes(), [],
                               "no more language codes expected after reset");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetLanguageCodes: testGetLanguageCodes,
    testGetLanguageVariants: testGetLanguageVariants,
    testAddLanguageProperties: testAddLanguageProperties,
    testGetProperty: testGetProperty,
    testReset: testReset
  };

  testrunner.define(tests, "lb.base.i18n");
  return tests;

}());
