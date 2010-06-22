/*
 * test.lb.base.dom.js - Unit Tests of lb.base.dom module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-22
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

  function test$(){
    var ut = lb.base.dom.$;

    assert.equals( ut('testId'), document.getElementById('testId'),
                        "$ must return same node as document.getElementById");

    assert.equals( ut('missing'), null,  "$ must return null for missing id");
  }

  var tests = {
    testNamespace: testNamespace,
    test$: test$
  };

  testrunner.define(tests, "lb.base.dom");
  return tests;

}());
