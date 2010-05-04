/*
 * test.lb.core.Sandbox.js - Unit Tests of Sandbox for Modules
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-04
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.Sandbox.js */
/*requires lb.core.events.publisher.js */
/*requires bezen.js */
/*requires bezen.string.js */
/*requires bezen.dom.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*requires goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, document, goog */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner,
      $ = bezen.$,
      endsWith = bezen.string.endsWith,
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE,
      element = bezen.dom.element,
      events = goog.events;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','Sandbox'),
                                   "lb.core.Sandbox namespace was not found");
  }

  function testConstructor(){
    var Ut = lb.core.Sandbox;

    var sandbox = new Ut('myId');
  }

  function testGetId(){
    // Unit tests for lb.core.Sandbox#getId()

    var testId = 'lb.ui.myModule';
    var sandbox = new lb.core.Sandbox(testId);
    assert.equals( sandbox.getId(), testId,
                                  "id must match value given in constructor");
    assert.isFalse( object.exists( $('lb.ui.myModule') ),
                    "box element must not be created until getBox is called");

    assert.equals( sandbox.getId('testId'), 'lb.ui.myModule.testId',
                    "conversion to full id must add prefix and separator");
  }

  function testGetBox(){
    // Unit tests for lb.core.Sandbox#getBox()

    var sandbox = new lb.core.Sandbox('testGetBox');
    assert.equals( sandbox.getBox(), $('testGetBox'),
                               "box element 'testGetBox' should be returned");

    sandbox = new lb.core.Sandbox('missing');
    var box = sandbox.getBox();
    assert.isTrue( object.exists(box),         "missing box must be created");
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

  function testSubscribe(){
    var ut = new lb.core.Sandbox('testSubscribe').subscribe;

    lb.core.events.publisher.getSubscribers().length = 0;

    var notifiedEvents = [];
    var callback = function(event){
      notifiedEvents.push(event);
    };
    var filter = {};
    ut(filter,callback);

    assert.equals(lb.core.events.publisher.getSubscribers().length, 1,
                                          "one new event Subscriber expected");
    var event1 = {};
    lb.core.events.publisher.publish(event1);
    assert.arrayEquals(notifiedEvents, [event1],
                                "callback expected to be notified of event 1");
  }

  function testTrim(){
    var ut = new lb.core.Sandbox('testTrim').trim;

    assert.equals( ut('abcd'), 'abcd',
                          "no change expected when no whitespace is present");
    assert.equals( ut('a\nb c\td'), 'a\nb c\td',
                                     "internal whitespace must be preserved");
    assert.equals( ut('  \n\t  abcd  \n\t  '), 'abcd',
                                  "whitespace must be removed on both sides");
  }

  function test$(){
    var ut = new lb.core.Sandbox('test$').$;

    assert.equals( ut('testId'), document.getElementById('test$.testId'),
      "$ must return same node as document.getElementById, once prefix added");

    assert.equals( ut('outsideBox'), null,
                                      "$ must not return element outside box");
  }

  function testElement(){
    var ut = new lb.core.Sandbox('testElement').element;

    var a1 = ut('a',{href:"#first"},"first link");
    assert.equals( a1.nodeType, ELEMENT_NODE,
                                                "a1 must have type ELEMENT");
    assert.equals( a1.nodeName, "A",            "a1 must have name A");
    assert.isTrue( endsWith(a1.href,'#first'),  "a1 must have href set");
    assert.equals( a1.childNodes.length, 1,     "a1 must have 1 child");
    var t1 = a1.firstChild;
    assert.equals( t1.nodeType, TEXT_NODE, "t1 must have type TEXT");
    assert.equals( t1.data, "first link",       "t1 data must be set");
  }

  function testGetClasses(){
    var ut = new lb.core.Sandbox('testGetClasses').getClasses;

    assert.objectEquals( ut( $('testGetClasses.threeClasses') ),
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");

    assert.objectEquals( ut( $('testGetClasses.outsideBox') ), {},
                            "empty hash expected when element is out of box");
  }

  function testAddClass(){
    var ut = new lb.core.Sandbox('testAddClass').addClass;

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
    var ut = new lb.core.Sandbox('testRemoveClass').removeClass;

    var div = $('testRemoveClass.threeClasses');
    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    div = $('testRemoveClass.outsideBox');
    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when element is out of box");
  }

  function testAddListener(){
    var ut = new lb.core.Sandbox('testAddListener').addListener;

    var div1 = $('testAddListener.click');
    var events1 = [];
    var callback1 = function(event){
      events1.push(event);
    };
    ut(div1, 'click', callback1, true);
    var listeners1 = events.getListeners(div1, 'click', true);
    assert.equals(listeners1.length, 1,
                                   "one capturing listener expected on div1");
    var event1 = {};
    listeners1[0].handleEvent(event1);
    assert.arrayEquals(events1,[event1],
                            "callback expected to be triggered with event1");

    var div2 = $('testAddListener.outsideBox');
    var events2 = [];
    var callback2 = function(event){
      events2.push(event);
    };
    ut(div2, 'click', callback2, true);
    var listeners2 = events.getListeners(div2, 'click', true);
    assert.equals(listeners2.length, 0,
                           "no listener expected on div2 outside of the box");
  }

  function testRemoveListener(){
    var ut = new lb.core.Sandbox('testRemoveListener').removeListener;

    var div1 = $('testRemoveListener.click');
    var callback1 = function(){};
    events.listen(div1, 'click', callback1);
    assert.equals( events.getListeners(div1,'click',false).length, 1,
                            "assert: non-capturing listener must be set");
    ut(div1, 'click', callback1);
    assert.arrayEquals( events.getListeners(div1,'click',false), [],
                            "non-capturing listener expected to be removed.");

    var div2 = $('testRemoveListener.outsideBox');
    var callback2 = function(){};
    events.listen(div2, 'click', callback2);
    assert.equals( events.getListeners(div2,'click',false).length, 1,
                            "assert: non-capturing listener must be set");
    ut(div2, 'click', callback2);
    assert.arrayEquals( events.getListeners(div2,'click',false).length, 1,
                            "no change expected when element is out of box.");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetId: testGetId,
    testGetBox: testGetBox,
    testIsInBox: testIsInBox,
    testSubscribe: testSubscribe,
    testTrim: testTrim,
    test$: test$,
    testElement: testElement,
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass,
    testaddListener: testAddListener,
    testRemoveListener: testRemoveListener
  };

  testrunner.define(tests, "lb.core.Sandbox");
  return tests;

}());
