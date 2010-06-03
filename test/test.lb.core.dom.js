/*
 * test.lb.core.dom.js - Unit Tests of Core DOM namespace
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-03
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.dom.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of Core DOM namespace

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      string = bezen.string,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','dom'),
                               "lb.core.dom namespace was not found");
  }

  var tests = {
    testNamespace: testNamespace
  };

  testrunner.define(tests, "lb.core.dom");
  return tests;

}());
