/*
 * test.lb.base.i18n.js - Unit Tests of lb.base.i18n module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-09-03
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

  function testGetLanguage(){
    var ut = lb.base.i18n.getLanguage;
    setUp();

    var defaultLanguage = navigator.language || navigator.browserLanguage;
    assert.isTrue( object.exists(defaultLanguage),
              "assert: default language must exist, found: "+defaultLanguage);

    assert.equals( ut(), defaultLanguage.toLowerCase(),
    "default language expected when config property is not set, in lowercase");

    setOptions({lbLanguage: 'nor-NO'});
    assert.equals( ut(), 'nor-no',
     "language set in config expected to be returned in lowercase (Norway)");

    setOptions({lbLanguage: 'FIN-fi'});
    assert.equals( ut(), 'fin-fi',
     "language set in config expected to be returned in lowercase (Finland)");
  }

  function testSetLanguage(){
    var ut = lb.base.i18n.setLanguage;
    setUp();

    ut('');
    assert.equals( lb.base.i18n.getLanguage(), '',
                                        "empty language expected to be set");

    ut('fr-FR');
    assert.equals( lb.base.i18n.getLanguage(), 'fr-fr',
                          "French/France expected in lowercase in result");

    setOptions({lbLanguage: 'FIN-fi'});
    assert.equals( lb.base.i18n.getLanguage(), 'fr-fr',
                  "no change expected after setting a new default language");

    ut(null);
    assert.equals( lb.base.i18n.getLanguage(), 'fr-fr',
                            "no change expected when new language is null");

    ut();
    assert.equals( lb.base.i18n.getLanguage(), 'fr-fr',
                        "no change expected when new language is undefined");

    ut({});
    assert.equals( lb.base.i18n.getLanguage(), 'fr-fr',
        "no change expected when new language has no toLowerCase() property");

    ut('en');
    assert.equals( lb.base.i18n.getLanguage(), 'en',
                            "English language in param expected in result");
    ut('en-GB');
    assert.equals( lb.base.i18n.getLanguage(), 'en-gb',
   "English/Great Britain language in param expected in lowercase in result");
  }

  function testGetLanguageVariants(){
    var ut = lb.base.i18n.getLanguageVariants;
    setUp();

    assert.arrayEquals( ut(), [],        "no module expected after reset()");
  }

  function testAddLanguageVariant(){
    var ut = lb.base.i18n.addLanguageVariant;
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
    ut({},{});
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(), [],
            "null, undefined and tag without toLowerCase() must be ignored");

    ut('en',english);
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(), [english],
                                  "1 language variant expected to be added");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN'), [english],
                                      "english expected with filter 'EN'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN-gb'), [english],
                                      "english expected with filter 'EN-gb'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [],
                                    "english must not match filter 'fr'");

    ut('',root);
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(), [root,english],
                                  "2 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(''), [root],
                                              "root expected for filter ''");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN'), [root,english],
                                "root and english expected with filter 'EN'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN-gb'),
                        [root,english],
                             "root and english expected with filter 'EN-gb'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [root],
                                    "only root expected with filter 'fr'");

    ut('fr-FR',frenchFrance);
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,frenchFrance],
                                  "3 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN'), [root,english],
                            "frenchFrance not expected to match filter 'EN'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN-gb'),
                        [root,english],
                         "frenchFrance not expected to match filter 'EN-gb'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'), [root],
                            "frenchFrance not expected to match filter 'fr'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr-FR'),
                        [root,frenchFrance],
                         "root and frenchFrance expected for filter 'fr-FR'");

    ut('fr',french);
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,french,frenchFrance],
                                  "4 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN'), [root,english],
                                  "french not expected to match filter 'EN'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN-gb'),
                        [root,english],
                            "french not expected to match filter 'EN-gb'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'),
                        [root,french],
                                "root and french expected with filter 'fr'");

    ut('fr-CA',frenchCanada);
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [root,english,french,frenchCanada,frenchFrance],
                                  "5 language variants expected sorted");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN'), [root,english],
                            "frenchCanada not expected to match filter 'EN'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('EN-gb'),
                        [root,english],
                         "frenchCanada not expected to match filter 'EN-gb'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr'),
                        [root,french],
                            "frenchCanada not expected to match filter 'fr'");
    assert.arrayEquals( lb.base.i18n.getLanguageVariants('fr-CA'),
                        [root,french,frenchCanada],
                 "root, french and frenchCanada expected for filter 'fr-CA'");

    ut('en-GB',englishGB);
    ut('en-USA',englishUSA);

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
    ut('en-USA2',englishUSA2);
    ut('en-GB2',englishGB2);

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
    assert.equals( ut('section','subsection','test'), null,
                   "null expected for nested 'test' property (no language)");

    lb.base.config.setOptions({lbLanguage: 'fr-FR'});

    lb.base.i18n.addLanguageVariant('',
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
    assert.equals( ut('section','subsection','test'), null,
                       "null expected for nested 'test' property (root)");

    lb.base.i18n.addLanguageVariant('fr',
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
    assert.equals( ut('section','subsection','test'), 'French Value',
                "French Value expected for nested 'test' property (root,fr)");

    lb.base.i18n.addLanguageVariant('fr-FR',
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
    assert.equals( ut('section','subsection','test'), 'Second France Value',
   "Second France Value expected for nested 'test' property (root,fr,fr-FR)");
  }

  function testGetValueOf(){
    var ut = lb.base.i18n.getValueOf;
    setUp();

    var three = {id:3};
    var testArgs = [1,'two',three];

    assert.equals( ut(), null,
          "null expected for undefined function and arguments (no language)");
    assert.equals( ut(testArgs), null,
                 "null expected when one argument is missing (no language)");
    assert.equals( ut('test',testArgs), null,
                          "null expected for 'test' property (no language)");
    assert.equals( ut('section','subsection','test',testArgs), null,
                   "null expected for nested 'test' property (no language)");

    lb.base.config.setOptions({lbLanguage: 'fr-FR'});

    var capturedByRoot = [];
    lb.base.i18n.addLanguageVariant('',
      {
        name: 'root',
        notAFunction: 'not a value',
        test: function(){
          capturedByRoot.push('root');
          for (var i=0; i<arguments.length; i++){
            capturedByRoot.push(arguments[i]);
          }
          return 'Root Value';
        }
      }
    );

    assert.equals( ut(), null,
               "null expected for undefined function and arguments (root)");
    assert.equals( ut(testArgs), null,
                        "null expected when one argument is missing (root)");
    assert.equals( ut('missing',testArgs), null,
                              "null expected for missing property (root)");
    assert.equals( ut('notAFunctions',testArgs), null,
                 "null expected for property which is not a function (root)");

    assert.arrayEquals( capturedByRoot, [], "no call expected in root (root)");
    assert.equals( ut('test',testArgs), 'Root Value',
                          "Root Value expected for 'test' function (root)");
    assert.arrayEquals( capturedByRoot,
                        ['root',1,'two',three],
                                    "args expected in call to root (root)");
    capturedByRoot = [];

    assert.equals( ut('section','subsection','test',testArgs), null,
                       "null expected for nested 'test' function (root)");

    var capturedByFrench = [];
    lb.base.i18n.addLanguageVariant('fr',
      {
        name: 'french',
        section:{
          subsection: {
            test: function(){
              capturedByFrench.push('French');
              for (var i=0; i<arguments.length; i++){
                capturedByFrench.push(arguments[i]);
              }
              return 'French Value';
            }
          }
        }
      }
    );

    assert.equals( ut(), null,
               "null expected for undefined function and arguments (root,fr)");
    assert.equals( ut(testArgs), null,
                       "null expected when one argument is missing (root,fr)");
    assert.equals( ut('missing',testArgs), null,
                              "null expected for missing property (root,fr)");
    assert.equals( ut('notAFunction',testArgs), null,
              "null expected for property which is not a function (root,fr)");

    assert.arrayEquals( capturedByRoot, [],
                                        "no call expected in root (root,fr)");
    assert.equals( ut('test',testArgs), 'Root Value',
                          "Root Value expected for 'test' function (root,fr)");
    assert.arrayEquals( capturedByRoot,
                        ['root',1,'two',three],
                                    "args expected in call to root (root,fr)");
    capturedByRoot = [];

    assert.arrayEquals( capturedByFrench, [],
                                      "no call expected in French (root,fr)");
    assert.equals( ut('section','subsection','test',testArgs), 'French Value',
                "French Value expected for nested 'test' function (root,fr)");
    assert.arrayEquals( capturedByFrench,
                        ['French',1,'two',three],
                                 "args expected in call to French (root,fr)");
    capturedByFrench = [];

    var capturedByFrance = [];
    lb.base.i18n.addLanguageVariant('fr-FR',
      {
        name: 'french-France',
        test: function(){
          capturedByFrance.push('France1');
          for (var i=0; i<arguments.length; i++){
            capturedByFrance.push(arguments[i]);
          }
          return;
        },
        section:{
          subsection:{
            test: function(){
              capturedByFrance.push('France2');
              for (var i=0; i<arguments.length; i++){
                capturedByFrance.push(arguments[i]);
              }
              return null;
            }
          }
        }
      }
    );

    assert.equals( ut(), null,
        "null expected for undefined function and arguments (root,fr,fr-FR)");
    assert.equals( ut(testArgs), null,
                "null expected when one argument is missing (root,fr,fr-FR)");
    assert.equals( ut('missing',testArgs), null,
                        "null expected for missing property (root,fr,fr-FR)");
    assert.equals( ut('notAFunction',testArgs), null,
        "null expected for property which is not a function (root,fr,fr-FR)");

    assert.arrayEquals( capturedByRoot, [],
                                 "no call expected in root (root,fr,fr-FR)");
    assert.arrayEquals( capturedByFrance, [],
                               "no call expected in France (root,fr,fr-FR)");
    assert.equals( ut('test',testArgs), 'Root Value',
                   "Root Value expected for 'test' function (root,fr,fr-FR)");
    assert.arrayEquals( capturedByRoot,
                        ['root',1,'two',three],
                             "args expected in call to root (root,fr,fr-FR)");
    assert.arrayEquals( capturedByRoot,
                        ['root',1,'two',three],
                             "args expected in call to root (root,fr,fr-FR)");
    assert.arrayEquals( capturedByFrance,
                        ['France1',1,'two',three],
                          "args expected in call to France (root,fr,fr-FR)");
    capturedByRoot = [];
    capturedByFrance = [];

    assert.arrayEquals( capturedByFrench, [],
                                 "no call expected in French (root,fr,fr-FR)");
    assert.arrayEquals( capturedByFrance, [],
                                 "no call expected in France (root,fr,fr-FR)");
    assert.equals( ut('section','subsection','test',testArgs), 'French Value',
           "French Value expected for nested 'test' function (root,fr,fr-FR)");
    assert.arrayEquals( capturedByFrench,
                        ['French',1,'two',three],
                           "args expected in call to French (root,fr,fr-FR)");
    assert.arrayEquals( capturedByFrance,
                        ['France2',1,'two',three],
                          "args expected in call to France (root,fr,fr-FR)");
    capturedByFrench = [];
    capturedByFrance = [];
  }

  function testReset(){
    var ut = lb.base.i18n.reset;
    setUp();

    lb.base.i18n.addLanguageVariant('',{});
    lb.base.i18n.addLanguageVariant('fr',{});
    lb.base.i18n.addLanguageVariant('en',{});

    lb.base.config.setOptions({lbLanguage:'en-GB'});
    lb.base.i18n.setLanguage('fr-FR');

    ut();
    assert.arrayEquals( lb.base.i18n.getLanguageVariants(),
                        [],
                        "no more language variant expected after reset");
    assert.equals( lb.base.i18n.getLanguage(), 'en-gb',
                        "language expected to be reset");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetLanguage: testGetLanguage,
    testSetLanguage: testSetLanguage,
    testGetLanguageVariants: testGetLanguageVariants,
    testAddLanguageVariant: testAddLanguageVariant,
    testGetProperty: testGetProperty,
    testGetValueOf: testGetValueOf,
    testReset: testReset
  };

  testrunner.define(tests, "lb.base.i18n");
  return tests;

}());
