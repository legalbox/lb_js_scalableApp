/*
 * test.lb.base.dom.js - Unit Tests of lb.base.dom module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.dom.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.dom

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      exists = bezen.object.exists,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.js */
      $ = bezen.$;

  function testNamespace(){

    assert.isTrue( exists(window,'lb','base','dom'),
                                        "lb.base.dom namespace was not found");
  }

  function testConstants(){

    assert.equals( lb.base.dom.ELEMENT_NODE, 1,
                                            "ELEMENT_NODE constant expected");
    assert.equals( lb.base.dom.ATTRIBUTE_NODE, 2,
        "ATTRIBUTE_NODE constant expected");
    assert.equals( lb.base.dom.TEXT_NODE, 3,   "TEXT_NODE constant expected");
  }

  function test$(){
    var ut = lb.base.dom.$;

    assert.equals( ut('testId'), document.getElementById('testId'),
        "$ must return same node as document.getElementById");

    assert.equals( ut('missing'), null,  "$ must return null for missing id");
  }

  function testHasAttribute(){
    var ut = lb.base.dom.hasAttribute;

    try {
      ut(null);
      ut({});
      ut( document.createTextNode('Text') );
    } catch(e) {
      assert.fail("No error expected on null or non-element node: "+e);
    }

    // Unit tests extracted from bezen.org JavaScript library
    // CC-BY: Eric Bréchemier - http://bezen.org/javascript/
    var element = $('testHasAttribute');
    assert.isFalse( ut(element,'dir'),       "no dir attribute expected");
    assert.isFalse( ut(element,'class'),     "no class attribute expected");
    assert.isFalse( ut(element,'style'),     "no style attribute expected");

    assert.isTrue( ut(element,'id'),         "id attribute expected");
    assert.isTrue( ut(element, 'title'),     "title attribute expected");
    assert.isTrue( ut(element, 'lang'),      "lang attribute expected");
    assert.isTrue( ut(element, 'xml:lang'),  "xml:lang attribute expected");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstants: testConstants,
    test$: test$,
    testHasAttribute: testHasAttribute
  };

  testrunner.define(tests, "lb.base.dom");
  return tests;

}());
