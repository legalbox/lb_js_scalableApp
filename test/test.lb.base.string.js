/*
 * test.lb.base.string.js - Unit Tests of lb.base.string module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-03
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.string.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.string

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','string'),
                                    "lb.base.string namespace was not found");
  }

  function testTrim(){
    var ut = lb.base.string.trim;

    assert.equals( ut('abcd'), 'abcd',
                          "no change expected when no whitespace is present");
    assert.equals( ut('a\nb c\td'), 'a\nb c\td',
                                     "internal whitespace must be preserved");
    assert.equals( ut('  \n\t  abcd  \n\t  '), 'abcd',
                                  "whitespace must be removed on both sides");
  }

  var tests = {
    testNamespace: testNamespace,
    testTrim: testTrim
  };

  testrunner.define(tests, "lb.base.string");
  return tests;

}());
