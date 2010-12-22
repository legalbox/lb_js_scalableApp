/*
 * test.lb.base.template.html.js - Unit Tests of lb.base.template.html module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-22
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.html.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.html

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.dom.js*/
      element = bezen.dom.element;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','template','html'),
                            "lb.base.template.html namespace was not found");
  }

  function testTopDownParsing(){
    var ut = lb.base.template.html.topDownParsing;

    assert.fail("Missing tests");
  }

  function testFilterByLanguage(){
    var ut = lb.base.template.html.filterByLanguage;

    assert.fail("Missing tests");
  }

  function testReplaceParams(){
    var ut = lb.base.template.html.replaceParams;

    assert.fail("Missing tests");
  }

  var tests = {
    testNamespace: testNamespace,
    testTopDownParsing: testTopDownParsing,
    testFilterByLanguage: testFilterByLanguage,
    testReplaceParams: testReplaceParams
  };

  testrunner.define(tests, "lb.base.template.html");
  return tests;

}());
