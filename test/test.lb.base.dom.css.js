/*
 * test.lb.base.dom.css.js - Unit Tests of lb.base.dom.css module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-18
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.dom.css.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.dom.css

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      exists = bezen.object.exists,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.js */
      $ = bezen.$,
      /*requires bezen.dom.js */
      element = bezen.dom.element;

  function testNamespace(){

    assert.isTrue( exists(window,'lb','base','dom', 'css'),
                               "lb.base.dom.css namespace was not found");
  }

  function testGetClasses(){
    var ut = lb.base.dom.css.getClasses;

    assert.objectEquals( ut( $('noClass') ), {},
                              "empty hash expected when no class is present");
    assert.objectEquals( ut( $('emptyClass') ), {},
                                   "empty hash expected when class is empty");
    assert.objectEquals( ut( $('oneClass') ), {'one':true},
                                                "one class expected in hash");
    assert.objectEquals( ut( $('twoClasses') ), {'one':true, 'two':true},
                                              "two classes expected in hash");
    assert.objectEquals( ut( $('threeClasses') ), 
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");
  }

  function testAddClass(){
    var ut = lb.base.dom.css.addClass;

    var div = element('div');
    ut(div, 'one');
    assert.equals(div.className, 'one',
                                   "'one' expected in class after first add");

    ut(div, 'two');
    assert.equals(div.className, 'one two',
                              "'one two' expected in class after second add");

    ut(div, 'three');
    assert.equals(div.className, 'one two three',
                         "'one two three' expected in class after third add");

    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when adding existign class");
  }

  function testRemoveClass(){
    var ut = lb.base.dom.css.removeClass;

    var div = element('div');
    div.className = 'one two three';

    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    ut(div, 'two');
    assert.equals(div.className, 'one three',
                             "no change expected when removing absent class");

    ut(div, 'one');
    assert.equals(div.className, 'three',
                                        "class 'one' expected to be removed");

    ut(div, 'three');
    assert.equals(div.className, '',
                                      "class 'three' expected to be removed");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass
  };

  testrunner.define(tests, "lb.base.dom.css");
  return tests;

}());
