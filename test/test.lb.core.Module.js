/*
 * test.lb.core.Module.js - Unit Tests of Core Module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-04
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.Module.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of Core Module

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      string = bezen.string,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','Module'),
                                    "lb.core.Module namespace was not found");
  }

  var sandboxCreated;
  var startCounter = 0;
  var endCounter = 0;

  function createStubModule(sandbox){
    // create a new stub module, for Unit Tests purpose,
    // keeping track of calls to start() and end() and provided sandbox

    sandboxCreated = sandbox;
    return {
      start: function(){ startCounter++; },
      end: function(){ endCounter++; }
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

  function createModuleWhichFailsToEnd(sandbox){
    // create a new stub module which fails to end

    return {
      start: function(){},
      end: function(){ throw new Error('Test failure in end'); }
    };
  }

  function testConstructor(){
    var Ut = lb.core.Module;

    sandboxCreated = null;
    var module = new Ut('lb.ui.stub', createStubModule);
    assert.isTrue( object.exists(sandboxCreated),
                  "underlying module must be created with a sandbox instance");

    module = new lb.core.Module('lb.ui.fail', creatorWhichFails);
  }

  function testGetId(){
    // Unit tests for lb.core.Module#getId()

    var id = 'lb.ui.stub';
    var module = new lb.core.Module(id, createStubModule);
    assert.equals( module.getId(), id,
                     "getId expected to return the id given in constructor");
  }

  function testStart(){
    // Unit tests for lb.core.Module#start()

    var module = new lb.core.Module('lb.ui.stub', createStubModule);

    startCounter = 0;
    module.start();
    assert.equals(startCounter, 1, "Underlying module expected to be started");

    module = new lb.core.Module('lb.ui.fail', createModuleWhichFailsToStart);
    module.start();
  }

  function testEnd(){
    // Unit tests for lb.core.Module#end()

    var module = new lb.core.Module('lb.ui.stub', createStubModule);
    module.start();
    stopCounter = 0;
    module.end();
    assert.equals(endCounter, 1, "Underlying module expected to be ended");

    module = new lb.core.Module('lb.ui.stub', createStubModule);
    endCounter = 0;
    module.end();
    assert.equals(endCounter, 1,  "end call expected, even without a start");

    module = new lb.core.Module('lb.ui.fail', createModuleWhichFailsToEnd);
    module.start();
    module.end();
  }

  function testGetStatus(){
    // Unit tests for lb.core.Module#getStatus()

    var module = new lb.core.Module('lb.ui.module', createStubModule);
    assert.equals( module.getStatus(), 'created', "wrong initial status");

    module.start();
    assert.equals( module.getStatus(), 'started',"wrong status after start()");

    module.end();
    assert.equals( module.getStatus(), 'ended', "wrong status after end()");

    module = new lb.core.Module('lb.ui.fail', creatorWhichFails);
    assert.equals( module.getStatus(), 'error',
                                      "wrong status after failure in creator");

    module = new lb.core.Module('lb.ui.fail', createModuleWhichFailsToStart);
    module.start();
    assert.equals( module.getStatus(), 'error',
                                      "wrong status after failure in start");

    module = new lb.core.Module('lb.ui.fail', createModuleWhichFailsToEnd);
    module.start();
    module.end();
    assert.equals( module.getStatus(), 'error',
                                      "wrong status after failure in end");
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetId: testGetId,
    testStart: testStart,
    testEnd: testEnd,
    testGetStatus: testGetStatus
  };

  testrunner.define(tests, "lb.core.Module");
  return tests;

}());
