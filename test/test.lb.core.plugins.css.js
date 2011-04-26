/*
 * test.lb.core.plugins.css.js - Unit Tests of CSS Core Plugin
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-04-26
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.plugins.css.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.plugins.css

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.js */
      $ = bezen.$,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','plugins','css'),
                               "lb.core.plugins.css namespace was not found");
  }

  function testPlugin(){
    var ut = lb.core.plugins.css;

    var sandbox = new Sandbox('testPlugin');
    ut(sandbox);

    // Cascading Style Sheets (sandbox.css)
    assert.isTrue( object.exists(sandbox,'css','getClasses'),
                             "sandbox.css.getClasses expected to be defined");
    assert.isTrue( object.exists(sandbox,'css','addClass'),
                               "sandbox.css.addClass expected to be defined");
    assert.isTrue( object.exists(sandbox,'css','removeClass'),
                            "sandbox.css.removeClass expected to be defined");
  }

  function testGetClasses(){
    var sandbox = new Sandbox('testGetClasses');
    lb.core.plugins.css(sandbox);
    var ut = sandbox.css.getClasses;

    assert.objectEquals( ut( $('testGetClasses.threeClasses') ),
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");

    assert.objectEquals( ut( $('testGetClasses.outsideBox') ), {},
                            "empty hash expected when element is out of box");
  }

  function testAddClass(){
    var sandbox = new Sandbox('testAddClass');
    lb.core.plugins.css(sandbox);
    var ut = sandbox.css.addClass;

    var div = $('testAddClass.noClass');
    ut(div, 'one');
    ut(div, 'two');
    ut(div, 'three');
    assert.equals(div.className, 'one two three',
                         "'one two three' expected in class after third add");

    div = $('testAddClass.outsideBox');
    ut(div, 'three');
    assert.equals(div.className, 'one two',
                             "no change expected when element is out of box");
  }

  function testRemoveClass(){
    var sandbox = new Sandbox('testRemoveClass');
    lb.core.plugins.css(sandbox);
    var ut = sandbox.css.removeClass;

    var div = $('testRemoveClass.threeClasses');
    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    div = $('testRemoveClass.outsideBox');
    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when element is out of box");
  }

  var tests = {
    testNamespace: testNamespace,
    testPlugin: testPlugin,
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass
  };

  testrunner.define(tests, "lb.core.plugins.css");
  return tests;

}());
