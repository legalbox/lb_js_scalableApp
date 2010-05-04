/*
 * test.lb.core.application.js - Unit Tests of Core Application
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-04
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.application.js */
/*requires bezen.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.array.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.application

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      array = bezen.array,
      startsWith = bezen.string.startsWith,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','application'), 
                                         "lb.core.application was not found");
  }

  // TODO: move to Sandbox unit tests
  function testGetApi(){
    var ut = lb.core.application.getApi;

    var api = ut();
    assert.isTrue( object.exists(api),                  "api object expected");
    assert.isTrue( object.exists(api,'log'),   "log function expected in api");
    for (var name in api){
      if ( api.hasOwnProperty(name) ){
        assert.equals( typeof api[name], 'function', 
                                     "api."+name+" expected to be a function");
      }
    }
  }

  var startCounter = 0;
  var endCounter = 0;
  var notifiedEvents = [];

  function createStubModule(sandbox){
    // create a stub module for unit tests purpose

    return {
      start: function(){ startCounter++; },
      end: function(){ endCounter++; },
      notify: function(event){ notifiedEvents.push(event); }
    };
  }

  function testGetModules(){
    var ut = lb.core.application.getModules;

    assert.isTrue( object.exists( ut() ),     "modules must exist initially");
    array.empty( ut() );
    assert.isTrue( object.exists( ut() ),     "modules must exist when empty");
    assert.arrayEquals( ut().length, 0,   "empty list expected after empty()");

    lb.core.application.register('div1', 'lb.ui.stub1', bezen.nix);
    lb.core.application.register('div2', 'lb.ui.stub2', bezen.nix);
    lb.core.application.register('div3', 'lb.ui.stub3', bezen.nix);
    assert.isTrue( object.exists( ut() ), "modules expected after registers");
    assert.equals( ut().length, 3,                 "wrong number of modules");
  }

  function testRegister(){
    // var ut = lb.core.facade.register;
    // This method must be called on the Facade

    var modules = lb.core.application.getModules();
    array.empty(modules);

    var name = 'lb.ui.stub';
    var id = 'testDiv';
    lb.core.application.register(id, name, createStubModule);
    assert.equals( modules.length, 1,              "one new module expected");
    assert.equals( modules[0].getId(), id,                "wrong module id");
  }

  var sandboxes1 = [];
  var startCounter1 = 0;
  var endCounter1 = 0;

  function createStubModule1(sandbox){
    // create a stub module for unit tests purpose

    sandboxes1.push(sandbox);
    return {
      start: function(){ startCounter1++; },
      end: function(){ endCounter1++; }
    };
  }

  var sandboxes2 = [];
  var startCounter2 = 0;
  var endCounter2 = 0;

  function createStubModule2(sandbox){
    // create a stub module for unit tests purpose

    sandboxes2.push(sandbox);
    return {
      start: function(){ startCounter2++; },
      end: function(){ endCounter2++; }
    };
  }

  var sandboxes3 = [];
  var startCounter3 = 0;
  var endCounter3 = 0;

  function createStubModule3(sandbox){
    // create a stub module for unit tests purpose

    sandboxes3.push(sandbox);
    return {
      start: function(){ startCounter3++; },
      end: function(){ endCounter3++; }
    };
  }

  function testStartAll(){
    var ut = lb.core.application.startAll;

    array.empty( lb.core.application.getModules() );
    ut();

    sandboxes1 = [];
    sandboxes2 = [];
    sandboxes3 = [];
    startCounter1 = 0;
    startCounter2 = 0;
    startCounter3 = 0;

    lb.core.application.register('div1', 'lb.ui.stub1', createStubModule1);
    lb.core.application.register('div2', 'lb.ui.stub2', createStubModule2);
    lb.core.application.register('div3', 'lb.ui.stub3', createStubModule3);

    ut();
    assert.equals(sandboxes1.length, 1,    "module 1 must have been created");
    assert.equals(sandboxes2.length, 1,    "module 2 must have been created");
    assert.equals(sandboxes3.length, 1,    "module 3 must have been created");
    assert.equals(startCounter1, 1,             "module 1 must have started");
    assert.equals(startCounter2, 1,             "module 2 must have started");
    assert.equals(startCounter3, 1,             "module 3 must have started");
  }

  function testStopAll(){
    var ut = lb.core.application.stopAll;

    array.empty( lb.core.application.getModules() );
    ut();

    lb.core.application.register('div1', 'lb.ui.stub1', createStubModule1);
    lb.core.application.register('div2', 'lb.ui.stub2', createStubModule2);
    lb.core.application.register('div3', 'lb.ui.stub3', createStubModule3);
    lb.core.application.startAll();

    endCounter1 = 0;
    endCounter2 = 0;
    endCounter3 = 0;
    ut();
    assert.equals(endCounter1, 1,             "module 1 must have stopped");
    assert.equals(endCounter2, 1,             "module 2 must have stopped");
    assert.equals(endCounter3, 1,             "module 3 must have stopped");
  }

  function testSubscribe(){
    var ut = lb.core.application.subscribe;

    var notifCounter1 = 0;
    var module1 = {
      notify: function(event){ notifCounter1++; }
    };

    var notifCounter2 = 0;
    var module2 = {
      notify: function(event){ notifCounter2++; }
    };

    ut(module1);
    var event1 = {};
    lb.core.application.notifyAll(event1);
    assert.equals(notifCounter1, 1, "first module must be notified of event1");

    ut(module1);
    ut(module2);
    ut(module2);
    var event2 = {};
    lb.core.application.notifyAll(event2);
    assert.equals(notifCounter1, 2, "first module must be notified of event2");
    assert.equals(notifCounter2, 1,
                         "second module must be notified of event2 only once");
  }

  function testNotifyAll(){
    var ut = lb.core.application.notifyAll;

    lb.core.application.stopAll();
    ut();

    var events1 = [];
    var module1 = {
      notify: function(event){ events1.push(event); }
    };

    var events2 = [];
    var module2 = {
      notify: function(event){ events2.push(event); }
    };

    ut();

    lb.core.application.subscribe(module1);
    lb.core.application.subscribe(module2);

    var event = {};
    ut(event);
    assert.arrayEquals(events1, [event], "first module must get notified");
    assert.arrayEquals(events2, [event], "second module must get notified");

    events1 = [];
    events2 = [];
    lb.core.application.stopAll();
    ut(event);
    assert.arrayEquals(events1, [],
                        "no notification expected after stopAll for module 1");
    assert.arrayEquals(events2, [],
                        "no notification expected after stopAll for module 2");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetApi: testGetApi,
    testGetModules: testGetModules,
    testRegister: testRegister,
    testStartAll: testStartAll,
    testStopAll: testStopAll,
    testSubscribe: testSubscribe,
    testNotifyAll: testNotifyAll
  };

  testrunner.define(tests, "lb.core.application");
  return tests;

}());
