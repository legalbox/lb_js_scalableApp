/*
 * test.lb.core.dom.factory.js - Unit Tests of Factory of DOM Elements
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-14
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.dom.factory.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of DOM Element Factory

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      string = bezen.string,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','dom', 'factory'),
                               "lb.core.dom.factory namespace was not found");
  }

  function testCreate(){
    var ut = lb.core.dom.factory.create;

    var anchor = ut('a',{href:'#here'},"Here");
    assert.isTrue( object.exists(anchor),   "create must return an object #a");
    assert.equals( anchor.nodeName, 'A',                 "anchor expected #a");
    assert.isTrue( string.endsWith(anchor.href,'#here'),   "href expected #a");
    assert.equals( anchor.innerHTML, "Here",               "text expected #a");

    var extra = ut('extraWidget',{id:'widget'},"Loading...");
    assert.isTrue( object.exists(extra),    "create must return an object #x");
    assert.equals( extra.nodeName, 'EXTRAWIDGET',   "extrawidget expected #x");
    assert.equals( extra.id, 'widget',                       "id expected #x");
    assert.equals( extra.innerHTML, "Loading...",
                                               "placeholder text expected #x");
  }

  var tests = {
    testNamespace: testNamespace,
    testCreate: testCreate
  };

  testrunner.define(tests, "lb.core.dom.factory");
  return tests;

}());
