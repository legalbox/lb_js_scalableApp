/*
 * test.lb.core.plugins.i18n.js - Unit Tests of I18n Core Plugin
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-04-22
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.plugins.i18n.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, document, navigator */
(function() {
  // Builder of
  // Closure object for Test of lb.core.plugins.i18n

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.dom.js */
      element = bezen.dom.element,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.base.i18n.data.js*/
      i18nData = lb.base.i18n.data,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','plugins','i18n'),
                              "lb.core.plugins.i18n namespace was not found");
  }

  function testPlugin(){
    var ut = lb.core.plugins.i18n;

    try {
      ut();
      ut(null);
    } catch(e) {
      assert.fail("No failure expected when argument is missing/null: "+e);
    }

    var sandbox = new Sandbox('testPlugin');
    ut(sandbox);

    // Internationalization through language properties (sandbox.i18n)
    assert.isTrue( object.exists(sandbox,'i18n','getLanguageList'),
                       "sandbox.i18n.getLanguageList expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','getSelectedLanguage'),
                   "sandbox.i18n.getSelectedLanguage expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','selectLanguage'),
                        "sandbox.i18n.selectLanguage expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','addLanguageProperties'),
                 "sandbox.i18n.addLanguageProperties expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','get'),
                                   "sandbox.i18n.get expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','getString'),
                             "sandbox.i18n.getString expected to be defined");
    assert.isTrue( object.exists(sandbox,'i18n','filterHtml'),
                            "sandbox.i18n.filterHtml expected to be defined");
  }

  function setUp(){
    // Set up to restore a neutral state before each unit test

    // reset document language
    document.documentElement.removeAttribute('lang');
    // remove all language properties
    i18nData.reset();
  }

  function testGetLanguageList(){
    var ut = new lb.core.Sandbox('testGetLanguageList').i18n.getLanguageList;

    setUp();
    assert.arrayEquals( ut(), [],   "language list expected empty initially");
  }

  function testGetSelectedLanguage(){
    var sandbox = new Sandbox('testGetSelectedLanguage');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.getSelectedLanguage;

    setUp();
    assert.equals( ut(), navigator.language || navigator.browserLanguage,
                  "selected language expected to default to browser language");

    var testLanguageCode = 'TESTlanguageCODE';
    document.documentElement.lang = testLanguageCode;
    assert.equals( ut(), testLanguageCode,
     "value of 'lang' attribute of root HTML element expected to be returned");
  }

  function testSelectLanguage(){
    var sandbox = new Sandbox('testSelectLanguage');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.selectLanguage;

    setUp();
    var testLanguageCode = 'TestLANGUAGEcode';
    ut(testLanguageCode);
    assert.equals( document.documentElement.lang, testLanguageCode,
                  "selected language expected to be set to 'lang' attribute "+
                                                      "of root HTML element");
  }

  function testAddLanguageProperties(){
    var sandbox = new Sandbox('testAddLanguageProperties');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.addLanguageProperties;

    setUp();
    ut();
    ut(undefined);
    ut(null,{});
    ut({},{});
    assert.arrayEquals( sandbox.i18n.getLanguageList(), [],
       "null, undefined and non-string language code expected to be ignored");

    var firstLanguageCode = 'TEST-language-CODE-01';
    sandbox.i18n.selectLanguage(firstLanguageCode);
    var aValue = function(){},
        cValue = 'C Value';
    ut(firstLanguageCode,{
      a: aValue,
      b: {
        c: cValue
      }
    });
    assert.arrayEquals( sandbox.i18n.getLanguageList(), [firstLanguageCode],
                    "first language code expected to be added to the list");
    assert.equals( sandbox.i18n.get('a',firstLanguageCode), aValue,
                                            "'a' expected in first language");
    assert.equals( sandbox.i18n.get('b.c',firstLanguageCode), cValue,
                                          "'b.c' expected in first language");

    var secondLanguageCode = '';
    sandbox.i18n.selectLanguage(secondLanguageCode);
    var dValue = {};
    ut(secondLanguageCode,{
      d: dValue
    });
    assert.arrayEquals( sandbox.i18n.getLanguageList(),
                        [secondLanguageCode, firstLanguageCode],
                  "second language code expected to be added, in sort order");
    assert.equals( sandbox.i18n.get('d',secondLanguageCode),dValue,
                                           "'d' expected in second language");
  }

  function testGet(){
    var sandbox = new Sandbox('testGet');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.get;

    setUp();
    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);
    assert.equals( ut(), null,             "null expected for missing key");

    var testSandbox = new lb.core.Sandbox('testGet.testSandbox');
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
    testSandbox.i18n.addLanguageProperties(testLanguageCode,{
      a: aValue,
      b: bValue
    });

    assert.equals( ut(), null,                "null expected for missing key");
    assert.equals( ut('a'), aValue,     "a value expected (default language)");
    assert.equals( ut('b'), bValue,     "b value expected (default language)");
    assert.equals( ut('b.c'), cValue,   "c value expected (default language)");
    assert.equals( ut('b.c.d'), dValue, "d value expected (default language)");

    sandbox.i18n.selectLanguage('OTHER-LANGUAGE-CODE');
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
    var sandbox = new Sandbox('testGetString');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.getString;

    setUp();

    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);

    var testSandbox = new lb.core.Sandbox('testGetString.testSandbox');
    testSandbox.i18n.addLanguageProperties(testLanguageCode,{
      complexParam: 'Complex #param-to-replace#, #missing#'
    });

    assert.equals( ut('complexParam',{'param-to-replace':'value'}),
                   'Complex value, #missing#',
                 "one of two params expected in complex value (no language)");

    sandbox.i18n.selectLanguage('OTHER-LANGUAGE-CODE');

    assert.equals( ut('complexParam',
                      {'param-to-replace':'value2'},
                      testLanguageCode),
                   'Complex value2, #missing#',
           "one of two params expected in complex value (explicit language)");
  }

  function testFilterHtml(){
    var sandbox = new Sandbox('testFilterHtml');
    lb.core.plugins.i18n(sandbox);
    var ut = sandbox.i18n.filterHtml;

    setUp();
    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);

    var complexNode = element('div',{},
          'Complex ',
          element('span',{id:'#attributeParam#'},'#text-to-replace#'),
          ' #missing#'
        );

    ut(complexNode,{
      attributeParam: 'attribute value',
      'text-to-replace':'text value'
    });
    assert.arrayEquals(
      [
        complexNode.nodeName,
        complexNode.childNodes.length,
          complexNode.childNodes[0].nodeValue,
          complexNode.childNodes[1].nodeName,
          complexNode.childNodes[1].getAttribute('id'),
          complexNode.childNodes[1].innerHTML,
          complexNode.childNodes[2].nodeValue
      ],
      [
        'DIV',
        3,
          'Complex ',
          'SPAN',
            'attribute value',
            'text value',
          ' #missing#'
      ],          "two replacements expected in complex value (no language)");

    var listNode = element('ul',{},
      element('li',{},'No Language'),
      element('li',{lang:''},'Root'),
      element('li',{lang:'en'},'English'),
      element('li',{lang:'en-GB'},'English/United Kingdom'),
      element('li',{lang:'en-US'},'English/USA'),
      element('li',{lang:'fr'},'French'),
      element('li',{lang:'fr-CA'},'French/Canada'),
      element('li',{lang:'fr-FR'},'French/France')
    );
    ut(listNode,{},'en-GB');
    assert.equals( listNode.childNodes.length, 4,
                                          "4 child nodes expected to remain");
    assert.arrayEquals(
      [
        listNode.childNodes[0].nodeName,
        listNode.childNodes[0].getAttribute('lang'),
        listNode.childNodes[0].innerHTML,

        listNode.childNodes[1].nodeName,
        listNode.childNodes[1].getAttribute('lang'),
        listNode.childNodes[1].innerHTML,

        listNode.childNodes[2].nodeName,
        listNode.childNodes[2].getAttribute('lang'),
        listNode.childNodes[2].innerHTML,

        listNode.childNodes[3].nodeName,
        listNode.childNodes[3].getAttribute('lang'),
        listNode.childNodes[3].innerHTML
      ],
      [
        'LI', '',      'No Language',
        'LI', '',      'Root',
        'LI', 'en',    'English',
        'LI', 'en-GB', 'English/United Kingdom'
      ],             "only child nodes with no lang, lang '', 'en', 'en-GB' "+
                                   "expected to remain for language 'en-GB'");
  }

  var tests = {
    testNamespace: testNamespace,
    testPlugin: testPlugin,
    testGetLanguageList: testGetLanguageList,
    testGetSelectedLanguage: testGetSelectedLanguage,
    testSelectLanguage: testSelectLanguage,
    testAddLanguageProperties: testAddLanguageProperties,
    testGet: testGet,
    testGetString: testGetString,
    testFilterHtml: testFilterHtml
  };

  testrunner.define(tests, "lb.core.plugins.i18n");
  return tests;

}());
