/*
 * test.lb.base.dom.Listener.js - Unit Tests of lb.base.dom.Listener module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-03
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.dom.Listener.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*requires bezen.dom.js */
/*requires goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.dom.Listener

  // Define aliases
  var assert = bezen.assert,
      exists = bezen.object.exists,
      testrunner = bezen.testrunner,
      $ = bezen.$,
      element = bezen.dom.element,
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

    // Note: no accessors defined for element, type, callback - at this point

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
    testDetach: testDetach
  };

  testrunner.define(tests, "lb.base.dom.Listener");
  return tests;

}());
