/*
 * test.lb.core.Sandbox.js - Unit Tests of Sandbox for Modules
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-04-26
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.Sandbox.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, setTimeout, document */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.js */
      $ = bezen.$,
      /*requires bezen.dom.js */
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      element = bezen.dom.element;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','Sandbox'),
                                   "lb.core.Sandbox namespace was not found");
  }

  function testConstructor(){
    var Ut = lb.core.Sandbox;

    var sandbox = new Ut('myId');
    assert.isTrue( sandbox instanceof Ut,      "instanceof expected to work");
  }

  function testGetId(){
    // Unit tests for lb.core.Sandbox#getId()
    var testId = 'lb.ui.myModule';
    var sandbox = new lb.core.Sandbox(testId);
    var ut = sandbox.getId;

    assert.equals( ut(), testId,
                                  "id must match value given in constructor");
    assert.isFalse( object.exists( $('lb.ui.myModule') ),
                    "box element must not be created until getBox is called");

    assert.equals( ut('testId'), 'lb.ui.myModule.testId',
                    "conversion to full id must add prefix and separator");
  }

  function testGetBox(){
    // Unit tests for lb.core.Sandbox#getBox()
    var sandbox = new lb.core.Sandbox('testGetBox');
    var ut = sandbox.getBox;

    assert.equals( ut(), $('testGetBox'),
                               "box element 'testGetBox' should be returned");

    sandbox = new lb.core.Sandbox('missing');
    ut = sandbox.getBox;

    assert.equals( ut(false), null,
            "null expected when box element is missing and !createIfMissing");
    assert.equals( $('missing'), null,
             "missing box element must not be created when !createIfMissing");

    var box = ut();
    assert.isTrue( object.exists(box),
                                    "missing box must be created by default");
    assert.equals(box, $('missing'),   "new element must be created with id");
    assert.equals(box.nodeType,ELEMENT_NODE,
                                       "new element must be an element node");
    assert.equals(box.nodeName, 'DIV',           "new element must be a DIV");
    assert.equals(box.parentNode, document.body,
                              "new element must be created in document.body");
    assert.isFalse( object.exists(box.nextSibling),
                              "new element must be last in document.body");
  }

  function testIsInBox(){
    var ut = new lb.core.Sandbox('testIsInBox').isInBox;

    assert.isFalse( ut(null),                      "false expected for null");
    assert.isFalse( ut(undefined),            "false expected for undefined");
    assert.isTrue( ut( $('testIsInBox.inBox') ),
                                           "true expected for element in box");
    assert.isFalse( ut( $('testIsInBox.outsideBox') ),
                                     "false expected for element outside box");
    assert.isFalse( ut(document.body),  "false expected for ancestor element");
    assert.isFalse( ut( element('div') ),
                                     "false expected for element outside DOM");
  }

  testrunner.define({
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetId: testGetId,
    testGetBox: testGetBox,
    testIsInBox: testIsInBox
  },"lb.core.Sandbox");

}());
