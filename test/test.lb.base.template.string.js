/*
 * test.lb.base.template.string.js - Unit Tests of lb.base.template.string
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-22
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.string.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.string

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

    assert.isTrue( object.exists(window,'lb','base','template','string'),
                           "lb.base.template.string namespace was not found");
  }

  function testReplaceParams(){
    var ut = lb.base.template.string.replaceParams;

    assert.fail("Missing tests");
  }

  var tests = {
    testNamespace: testNamespace,
    testReplaceParams: testReplaceParams
  };

  testrunner.define(tests, "lb.base.template.string");
  return tests;

}());
