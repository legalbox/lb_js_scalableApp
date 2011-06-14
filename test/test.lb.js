/*
 * test.lb.js - Unit Tests of lb root namespace
 *
 * Authors:
 *   o Eric Bréchemier <legalbox@eric.brechemier.name>
 *   o Marc Delhommeau <marc.delhommeau@legalbox.com>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-06-14
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*jslint white:false, onevar:false, plusplus:false */
/*global window */
define(
  [
    "bezen.org/bezen.assert",
    "bezen.org/bezen.object",
    "bezen.org/bezen.testrunner"
  ],
  function(assert,object,testrunner) {
  // Builder of
  // Closure object for Test of Legal-Box Web Application

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb'),
                                                "lb namespace was not found");
  }

  var tests = {
    testNamespace: testNamespace
  };

  testrunner.define(tests, "lb");
  return tests;

});
