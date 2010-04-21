/*
 * test.lb.ui.Module.js - Unit Tests of User Interface Module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-21
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.ui.Module.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      string = bezen.string,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','ui','Module'),
                                     "lb.ui.Module namespace was not found");
  }

  var sandboxes = [];
  var startCounter = 0;
  var stopCounter = 0;

  function createStubModule(sandbox){
    // create a new stub module, for Unit Tests purpose,
    // keeping track of calls to start() and stop(), as well as events provided
    // to notify().

    sandboxes.push(sandbox);
    return {
      start: function(){ startCounter++; },
      stop: function(){ stopCounter++; }
    };
  }

  function creatorWhichFails(sandbox){
    // a creator function that throws an exception

    throw new Error('Test failure in creator');
  }

  function createModuleWhichFailsToStart(sandbox){
    // create a new stub module which fails to start

    return {
      start: function(){ throw new Error('Test failure in start'); }
    };
  }

  function createFailingModule(sandbox){
    // create a new stub module which fails in every method except start

    return {
      start: function(){},
      stop: function(){ throw new Error('Test failure in stop'); }
    };
  }

  var failingCallback = function(){
    throw new Error('Test failure in notify callback');
  };

  var logMessages = [];
  var stubSandbox = {
    log: function(message){ logMessages.push(message); }
  };

  function testConstructor(){
    // Unit tests for new lb.ui.Module()

    var module = new lb.ui.Module('lb.ui.stub', createStubModule, stubSandbox);
  }

  function testGetName(){
    // Unit tests for lb.ui.Module#getName()

    var name = 'lb.ui.stub';
    var module = new lb.ui.Module(name, createStubModule);
    assert.equals( module.getName(), name,
                  "getName expected to return the name given in constructor");
  }

  function testStart(){
    // Unit tests for lb.core.Module#start()

    var module = new lb.ui.Module('lb.ui.stub', createStubModule);

    startCounter = 0;
    module.start(stubSandbox);
    assert.arrayEquals(sandboxes,[stubSandbox],
             "underlying module expected to be created with provided sandbox");
    assert.equals(startCounter, 1, "Underlying module expected to be started");

    startCounter = 0;
    module.start();
    module.start(undefined);
    module.start(null);
    assert.equals(startCounter, 0,        "No start expected without sandbox");

    logMessages = [];
    module = new lb.ui.Module('lb.ui.fail', creatorWhichFails);
    module.start(stubSandbox);
    assert.equals(logMessages.length, 1,     "one message expected in log #1");
    assert.isTrue(string.startsWith(logMessages[0], 'ERROR: '),
                                           "error message expected in log #1");

    module = new lb.ui.Module('lb.ui.fail', createModuleWhichFailsToStart);
    logMessages = [];
    module.start(stubSandbox);
    assert.equals(logMessages.length, 1,     "one message expected in log #2");
    assert.isTrue(string.startsWith(logMessages[0], 'ERROR: '),
                                           "error message expected in log #2");
  }

  function testSubscribe(){
    // Unit tests for lb.ui.Module#subscribe()

    var module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(stubSandbox);

    var counter = 0;
    module.subscribe({}, function(){ counter++; });
    assert.equals(counter, 0,   "callback must not be triggered at subscribe");
  }

  function testNotify(){
    // Unit tests for lb.ui.Module#notify()

    var event1 = {};
    var event2 = {name:'test'};
    var event3 = {name:'test', id:42};

    var subscriptionA = {};
    var subscriptionB = {name:'test'};

    var notifyEvents = [];
    var callback = function(event){
      notifyEvents.push(event);
    }

    var module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(stubSandbox);
    module.subscribe(subscriptionA,callback);
    module.notify(event1);
    assert.arrayEquals(notifyEvents, [event1],
              "With subscription A, module expected to be notified of event1");
    module.notify(event2);
    assert.arrayEquals(notifyEvents, [event1,event2],
              "With subscription A, module expected to be notified of event2");
    module.notify(event3);
    assert.arrayEquals(notifyEvents, [event1,event2,event3],
              "With subscription A, module expected to be notified of event3");

    notifyEvents = [];
    module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(stubSandbox);
    module.subscribe(subscriptionB,callback);
    module.notify(event1);
    module.notify(event2);
    module.notify(event3);
    assert.arrayEquals(notifyEvents, [event2,event3],
        "With subscription B, module expected to be notified of events 2,3");

    module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(null);
    module.subscribe(subscriptionA,callback);
    notifyEvents = [];
    module.notify(event1);
    assert.arrayEquals(notifyEvents, [], "No notify expected without sandbox");

    module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(stubSandbox);
    module.subscribe(subscriptionA,failingCallback);
    logMessages = [];
    module.notify(event1);
    assert.equals(logMessages.length, 1,     "one message expected in log");
    assert.isTrue(string.startsWith(logMessages[0], 'ERROR: '),
                                             "error message expected in log");
  }

  function testStop(){
    // Unit tests for lb.ui.Module#stop()

    var module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(stubSandbox);
    stopCounter = 0;
    module.stop();
    assert.equals(stopCounter, 1, "Underlying module expected to be stopped");

    module = new lb.ui.Module('lb.ui.stub', createStubModule);
    module.start(null);
    stopCounter = 0;
    module.stop();
    assert.equals(stopCounter, 0,         "No stop expected without sandbox");

    module = new lb.ui.Module('lb.ui.fail', createFailingModule);
    module.start(stubSandbox);
    logMessages = [];
    module.stop();
    assert.equals(logMessages.length, 1,     "one message expected in log");
    assert.isTrue(string.startsWith(logMessages[0], 'ERROR: '),
                                             "error message expected in log");

    var counter = 0;
    var callback = function(){
      counter++;
    };
    module = new lb.ui.Module('lb.ui.module', createStubModule);
    module.start(stubSandbox);
    module.subscribe({},callback);
    module.notify({});
    assert.equals(counter, 1,              "callback expected before stop()");
    module.stop();
    module.notify({});
    assert.equals(counter, 1,        "no new callback expected after stop()");
  }

  function testGetStatus(){
    // Unit tests for lb.ui.Module#isStarted()

    var module = new lb.ui.Module('lb.ui.module', createStubModule);
    assert.equals( module.getStatus(), 'idle', "wrong initial status");

    module.start(stubSandbox);
    assert.equals( module.getStatus(), 'started',"wrong status after start()");

    module.stop();
    assert.equals( module.getStatus(), 'stopped', "wrong status after stop()");

    module = new lb.ui.Module('lb.ui.fail', creatorWhichFails);
    module.start(stubSandbox);
    assert.equals( module.getStatus(), 'failed',
                                      "wrong status after failure in creator");

    module = new lb.ui.Module('lb.ui.fail', createModuleWhichFailsToStart);
    module.start(stubSandbox);
    assert.equals( module.getStatus(), 'failed',
                                      "wrong status after failure in start");

    module = new lb.ui.Module('lb.ui.fail', createFailingModule);
    module.start(stubSandbox);
    module.stop();
    assert.equals( module.getStatus(), 'failed',
                                      "wrong status after failure in stop");

    module = new lb.ui.Module('lb.ui.module', createStubModule);
    module.start(stubSandbox);
    module.subscribe({},failingCallback);
    module.notify({});
    assert.equals( module.getStatus(), 'failed',
                                      "wrong status after failure in notify");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testStart: testStart,
    testSubscribe: testSubscribe,
    testNotify: testNotify,
    testStop: testStop,
    testGetStatus: testGetStatus
  };

  testrunner.define(tests, "lb.ui.Module");
  return tests;

}());
