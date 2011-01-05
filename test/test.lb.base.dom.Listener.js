/*
 * test.lb.base.dom.Listener.js - Unit Tests of lb.base.dom.Listener module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.dom.Listener.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.dom.Listener

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
      element = bezen.dom.element,
      /*requires goog.events.js */
      events = goog.events;

  function testNamespace(){

    assert.isTrue( exists(window,'lb','base','dom', 'Listener'),
                              "lb.base.dom.Listener namespace was not found");
  }

  function testConstructor(){
    var Ut = lb.base.dom.Listener;

    var div1 = element('div');
    var events1 = [];
    var callback1 = function(event){
      events1.push(event);
    };
    var listener1 = new Ut(div1, 'click', callback1, true);
    assert.isTrue( listener1 instanceof Ut,    "instanceof expected to work");

    var listeners1 = events.getListeners(div1, 'click', true);
    assert.equals(listeners1.length, 1,
                                   "one capturing listener expected on div1");
    var event1 = {};
    listeners1[0].handleEvent(event1);
    assert.arrayEquals(events1,[event1],
                            "callback expected to be triggered with event1");

    var div2 = element('div');
    var events2 = [];
    var callback2 = function(event){
      events2.push(event);
    };
    var listener2 = new Ut(div2, 'click', callback2);
    var listeners2 = events.getListeners(div2, 'click', false);
    assert.equals(listeners2.length, 1,
                               "one non-capturing listener expected on div2");
    var event2 = {};
    listeners2[0].handleEvent(event2);
    assert.arrayEquals(events2,[event2],
                            "callback expected to be triggered with event2");
  }

  var testElement = element('div');
  var testType = 'click';
  var testCallback = function(){};

  function testGetElement(){
    // Unit tests for lb.base.dom.Listener#getElement()

    var listener = new lb.base.dom.Listener(testElement,testType,testCallback);
    assert.equals( listener.getElement(), testElement,
                          "same element provided in constructor expected");
  }

  function testGetType(){
    // Unit tests for lb.base.dom.Listener#getType()

    var listener = new lb.base.dom.Listener(testElement,testType,testCallback);
    assert.equals( listener.getType(), testType,
                                "same type provided in constructor expected");
  }

  function testGetCallback(){
    // Unit tests for lb.base.dom.Listener#getCallback()

    var listener = new lb.base.dom.Listener(testElement,testType,testCallback);
    assert.equals( listener.getCallback(), testCallback,
                             "same callback provided in constructor expected");
  }

  function testIsUsingCapture(){
    // Unit tests for lb.base.dom.Listener#isUsingCapture()

    var listener = new lb.base.dom.Listener(testElement,testType,testCallback);
    assert.isFalse( listener.isUsingCapture(),
                                    "capture expected to be false by default");

    listener = new lb.base.dom.Listener(testElement,testType,testCallback,
                                        false);
    assert.isFalse( listener.isUsingCapture(),
                                        "capture expected to be set to false");

    listener = new lb.base.dom.Listener(testElement,testType,testCallback,
                                        true);
    assert.isTrue( listener.isUsingCapture(),
                                        "capture expected to be set to true");
  }

  function testDetach(){
    // Unit tests for lb.base.dom.Listener#detach()

    var div1 = element('div');
    var callback1 = function(){};
    var listener1 = new lb.base.dom.Listener(div1, 'click', callback1);
    assert.equals( events.getListeners(div1,'click',false).length, 1,
                            "non-capturing listener must be set");
    listener1.detach();
    assert.arrayEquals( events.getListeners(div1,'click',false), [],
                            "non-capturing listener expected to be removed.");

    var div2 = element('div');
    var callback2 = function(){};
    var listener2 = new lb.base.dom.Listener(div2, 'click', callback2, true);
    assert.equals( events.getListeners(div2,'click',true).length, 1,
                                            "capturing listener must be set");
    listener2.detach();
    assert.arrayEquals( events.getListeners(div2,'click',false), [],
                               "capturing listener expected to be removed.");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetElement: testGetElement,
    testGetType: testGetType,
    testGetCallback: testGetCallback,
    testIsUsingCapture: testIsUsingCapture,
    testDetach: testDetach
  };

  testrunner.define(tests, "lb.base.dom.Listener");
  return tests;

}());
