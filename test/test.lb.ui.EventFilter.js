/*
 * test.lb.ui.EventFilter.js - Unit Tests of User Interface Event Filter
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-21
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.ui.EventFilter.js */
/*requires bezen.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of User Interface Event Filter

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','ui','EventFilter'),
                                  "lb.ui.EventFilter namespace was not found");
  }

  function testConstructor(){
    // Unit tests for new lb.ui.EventFilter()

    var module = new lb.ui.EventFilter({}, bezen.nix);
  }

  function testApply(){
    // Unit tests for lb.ui.EventFilter#apply()

    var event1 = {};
    var event2 = {name:'test'};
    var event3 = {name:'test', id:42};
    var event4 = {name:'test', id:42, other:'value'};

    var subscriptionA = {};
    var subscriptionB = {name:'test'};
    var subscriptionC = {name:'other'};
    var subscriptionD = {name:'test', id:42};

    var notifiedEvents = [];
    var callback = function(event){
      notifiedEvents.push(event);
    };

    var filter = new lb.ui.EventFilter(subscriptionA, callback);
    filter.apply(event1);
    assert.arrayEquals(notifiedEvents, [event1],
                       "With subscription A, event1 expected to be notified");
    filter.apply(event2);
    assert.arrayEquals(notifiedEvents, [event1,event2],
                       "With subscription A, event2 expected to be notified");
    filter.apply(event3);
    assert.arrayEquals(notifiedEvents, [event1,event2,event3],
                       "With subscription A, event3 expected to be notified");
    filter.apply(event4);
    assert.arrayEquals(notifiedEvents, [event1,event2,event3,event4],
                       "With subscription A, event4 expected to be notified");

    notifiedEvents = [];
    filter = new lb.ui.EventFilter(subscriptionB, callback);
    filter.apply(event1);
    filter.apply(event2);
    filter.apply(event3);
    filter.apply(event4);
    assert.arrayEquals(notifiedEvents, [event2,event3,event4],
                  "With subscription B, events 2,3,4 expected to be notified");

    notifiedEvents = [];
    filter = new lb.ui.EventFilter(subscriptionC, callback);
    filter.apply(event1);
    filter.apply(event2);
    filter.apply(event3);
    filter.apply(event4);
    assert.arrayEquals(notifiedEvents, [],
                  "With subscription C, no event expected to be notified");

    notifiedEvents = [];
    filter = new lb.ui.EventFilter(subscriptionD, callback);
    filter.apply(event1);
    filter.apply(event2);
    filter.apply(event3);
    filter.apply(event4);
    assert.arrayEquals(notifiedEvents, [event3,event4],
                  "With subscription D, events 3,4 expected to be notified");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testApply: testApply
  };

  testrunner.define(tests, "lb.ui.EventFilter");
  return tests;

}());
