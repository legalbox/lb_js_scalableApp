/*
 * test.lb.core.facade.js - Unit Tests of Application Core Facade
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-27
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.log.js */
/*requires lb.core.facade.js */
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
  // Closure object for Test of lb.core

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      array = bezen.array,
      string = bezen.string,
      log = lb.core.log,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','facade'), 
                                             "lb.core.facade was not found");
  }

  function testGetApi(){
    var ut = lb.core.facade.getApi;

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
  var stopCounter = 0;
  var notifiedEvents = [];

  function createStubModule(sandbox){
    // create a stub module for unit tests purpose

    return {
      start: function(){ startCounter++; },
      stop: function(){ stopCounter++; },
      notify: function(event){ notifiedEvents.push(event); }
    };
  }

  function testGetModules(){
    var ut = lb.core.facade.getModules;

    assert.isTrue( object.exists( ut() ),     "modules must exist initially");
    array.empty( ut() );
    assert.isTrue( object.exists( ut() ),     "modules must exist when empty");
    assert.arrayEquals( ut().length, 0,   "empty list expected after empty()");

    lb.core.facade.register('div1', 'lb.ui.stub1', bezen.nix);
    lb.core.facade.register('div2', 'lb.ui.stub2', bezen.nix);
    lb.core.facade.register('div3', 'lb.ui.stub3', bezen.nix);
    assert.isTrue( object.exists( ut() ), "modules expected after registers");
    assert.equals( ut().length, 3,                 "wrong number of modules");
  }

  function testRegister(){
    // var ut = lb.core.facade.register;
    // This method must be called on the Facade

    var modules = lb.core.facade.getModules();
    array.empty(modules);

    var name = 'lb.ui.stub';
    var id = 'testDiv';
    lb.core.facade.register(id, name, createStubModule);
    assert.equals( modules.length, 1,              "one new module expected");
    assert.equals( modules[0].getName(), name,     "wrong module name");
    assert.equals( modules[0].getSandbox().getBox(), bezen.$(id),
                                        "wrong HTML element as sandbox root");

    log.clear();
    lb.core.facade.register('notFound', name, createStubModule);
    var logs = log.list();
    assert.equals(logs.length, 1,   "one log expected when HTML id not found");
    assert.isTrue( startsWith(logs[0], "ERROR: "),
                                        "error expected for missing HTML id");
  }

  var sandboxes1 = [];
  var startCounter1 = 0;
  var stopCounter1 = 0;

  function createStubModule1(sandbox){
    // create a stub module for unit tests purpose

    sandboxes1.push(sandbox);
    return {
      start: function(){ startCounter1++; },
      stop: function(){ stopCounter1++; }
    };
  }

  var sandboxes2 = [];
  var startCounter2 = 0;
  var stopCounter2 = 0;

  function createStubModule2(sandbox){
    // create a stub module for unit tests purpose

    sandboxes2.push(sandbox);
    return {
      start: function(){ startCounter2++; },
      stop: function(){ stopCounter2++; }
    };
  }

  var sandboxes3 = [];
  var startCounter3 = 0;
  var stopCounter3 = 0;

  function createStubModule3(sandbox){
    // create a stub module for unit tests purpose

    sandboxes3.push(sandbox);
    return {
      start: function(){ startCounter3++; },
      stop: function(){ stopCounter3++; }
    };
  }

  function testStartAll(){
    var ut = lb.core.facade.startAll;

    array.empty( lb.core.facade.getModules() );
    ut();

    sandboxes1 = [], sandboxes2 = [], sandboxes3 = [];
    startCounter1 = 0, startCounter2 = 0, startCounter3 = 0;

    lb.core.facade.register('div1', 'lb.ui.stub1', createStubModule1);
    lb.core.facade.register('div2', 'lb.ui.stub2', createStubModule2);
    lb.core.facade.register('div3', 'lb.ui.stub3', createStubModule3);

    ut();
    assert.equals(sandboxes1.length, 1,    "module 1 must have been created");
    assert.equals(sandboxes2.length, 1,    "module 2 must have been created");
    assert.equals(sandboxes3.length, 1,    "module 3 must have been created");
    assert.equals(startCounter1, 1,             "module 1 must have started");
    assert.equals(startCounter2, 1,             "module 2 must have started");
    assert.equals(startCounter3, 1,             "module 3 must have started");
  }

  function testStopAll(){
    var ut = lb.core.facade.stopAll;

    array.empty( lb.core.facade.getModules() );
    ut();

    lb.core.facade.register('div1', 'lb.ui.stub1', createStubModule1);
    lb.core.facade.register('div2', 'lb.ui.stub2', createStubModule2);
    lb.core.facade.register('div3', 'lb.ui.stub3', createStubModule3);
    lb.core.facade.startAll();

    stopCounter1 = 0, stopCounter2 = 0, stopCounter3 = 0;
    ut();
    assert.equals(stopCounter1, 1,             "module 1 must have stopped");
    assert.equals(stopCounter2, 1,             "module 2 must have stopped");
    assert.equals(stopCounter3, 1,             "module 3 must have stopped");
  }

  function testSubscribe(){
    var ut = lb.core.facade.subscribe;

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
    lb.core.facade.notifyAll(event1);
    assert.equals(notifCounter1, 1, "first module must be notified of event1");

    ut(module1);
    ut(module2);
    ut(module2);
    var event2 = {};
    lb.core.facade.notifyAll(event2);
    assert.equals(notifCounter1, 2, "first module must be notified of event2");
    assert.equals(notifCounter2, 1,
                         "second module must be notified of event2 only once");
  }

  function testNotifyAll(){
    var ut = lb.core.facade.notifyAll;

    lb.core.facade.stopAll();
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

    lb.core.facade.subscribe(module1);
    lb.core.facade.subscribe(module2);

    var event = {};
    ut(event);
    assert.arrayEquals(events1, [event], "first module must get notified");
    assert.arrayEquals(events2, [event], "second module must get notified");

    events1 = [], events2 = [];
    lb.core.facade.stopAll();
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

  testrunner.define(tests, "lb.core.facade");
  return tests;

}());
