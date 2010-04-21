/*
 * test.lb.ui.Sandbox.js - Unit Tests of Sandbox for User Interface Modules
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-21
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.ui.Sandbox.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','ui','Sandbox'),
                                     "lb.ui.Sandbox namespace was not found");
  }

  var subscribedModules = [];

  function stubFunc1(){ // stub function #1
  }
  function stubFunc2(){ // stub function #2
  }
  function stubFunc3(){ // stub function #3
  }

  // stub Facade object, for unit tests
  var stubFacade = {
    subscribe: function(module){
      subscribedModules.push(module);
    },
    getApi: function(){
      return {
        func1: stubFunc1,
        func2: stubFunc2,
        func3: stubFunc3
      };
    }
  };

  var eventFilters = [];

  // stub Module object, for unit tests
  var stubModule = {
    addFilter: function(event){
      eventFilters.push(event);
    }
  };

  function testConstructor(){
    // Unit tests for lb.ui.Sandbox#Sandbox()

    var sandbox = new lb.ui.Sandbox('testId', stubModule, stubFacade);

    // Note:
    // in current implementation, it is expected that the proxified functions
    // are simply copied to the sandbox object. An more complex intermediation
    // may be put in place in the future, e.g. to have this reference the
    // facade during the call.
    assert.equals( sandbox.func1, stubFunc1,
                                         "function #1 expected to be copied");
    assert.equals( sandbox.func2, stubFunc2,
                                         "function #2 expected to be copied");
    assert.equals( sandbox.func3, stubFunc3,
                                         "function #3 expected to be copied");
  }

  function testGetBox(){
    // Unit tests for lb.ui.Sandbox#getBox()

    var box = {};
    var sandbox = new lb.ui.Sandbox(box, stubModule, stubFacade);
    assert.equals( sandbox.getBox(), box,
                                      "box provided in constructor expected");
  }

  function testSubscribe(){
    // Unit tests for lb.ui.Sandbox#notify()

    var sandbox = new lb.ui.Sandbox('testId', stubModule, stubFacade);

    subscribedModules = [];
    subscribedEvents = [];
    var event = {};
    sandbox.subscribe(event);
    assert.arrayEquals(eventFilters, [event],
                                "event filter expected on module");
    assert.arrayEquals(subscribedModules,[stubModule],
                                "module expected to be subscribed on facade");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetBox: testGetBox,
    testSubscribe: testSubscribe
  };

  testrunner.define(tests, "lb.ui.Sandbox");
  return tests;

}());
