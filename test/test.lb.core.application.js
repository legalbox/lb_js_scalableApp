/*
 * test.lb.core.application.js - Unit Tests of Core Application
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.application.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.application

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      array = bezen.array,
      /*requires bezen.string.js */
      last = bezen.array.last,
      startsWith = bezen.string.startsWith,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.core.Module.js */
      Module = lb.core.Module,
      /*requires goog.events.js */
      events = goog.events,
      /*requires lb.base.config.js */
      config = lb.base.config,
      /*requires bezen.js */
      nix = bezen.nix;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','application'), 
                                         "lb.core.application was not found");
  }

  function testSetOptions(){
    var ut = lb.core.application.setOptions;

    var testFactory = {
      create: nix
    };

    ut({lbFactory:testFactory});
    assert.equals( config.getOption('lbFactory'), testFactory,
                                          "test factory expected to be set");

    var myData = {id:42};
    ut({'myOption':myData});
    assert.equals( config.getOption('myOption'), myData,
                                       "custom property expected to be set");
  }

  function testGetModules(){
    var ut = lb.core.application.getModules;

    assert.isTrue( object.exists( ut() ),     "modules must exist initially");
    array.empty( ut() );
    assert.isTrue( object.exists( ut() ),     "modules must exist when empty");
    assert.arrayEquals( ut().length, 0,   "empty list expected after empty()");
  }

  function testAddModule(){
    var ut = lb.core.application.addModule;

    array.empty( lb.core.application.getModules() );

    var module1 = new Module('lb.ui.stub1',nix);
    var module2 = new Module('lb.ui.stub2',nix);
    var module3 = new Module('lb.ui.stub3',nix);

    ut(module1);
    assert.arrayEquals( lb.core.application.getModules(), [module1],
                                                       "one module expected");
    ut(module2);
    assert.arrayEquals( lb.core.application.getModules(), [module1, module2],
                                                  "two new modules expected");
    ut(module3);
    assert.arrayEquals( lb.core.application.getModules(),
                        [module1, module2, module3],
                                                "three new modules expected");

    ut(module2);
    assert.arrayEquals( lb.core.application.getModules(),
                        [module1, module2, module3],
                                  "same module must not be inserted twice");
  }

  function testRemoveModule(){
    var ut = lb.core.application.removeModule;

    var module1 = new Module('lb.ui.stub1',nix);
    var module2 = new Module('lb.ui.stub2',nix);
    var module3 = new Module('lb.ui.stub3',nix);

    var modules = lb.core.application.getModules();
    array.empty(modules);
    lb.core.application.addModule(module1); // once
    lb.core.application.addModule(module2);
    lb.core.application.addModule(module1); // twice
    lb.core.application.addModule(module1); // thrice, subsequent
    lb.core.application.addModule(module3);
    lb.core.application.addModule(module1); // fourth

    ut(module1);
    modules = lb.core.application.getModules();
    assert.arrayEquals(modules, [module2,module3],
                       "all instances of module1 are expected to be removed");
  }

  var startCounter1 = 0;
  var endCounter1 = 0;

  function createStubModule1(sandbox){
    // create a stub module for unit tests purpose

    return {
      start: function(){ startCounter1++; },
      end: function(){ endCounter1++; }
    };
  }

  var startCounter2 = 0;
  var endCounter2 = 0;

  function createStubModule2(sandbox){
    // create a stub module for unit tests purpose

    return {
      start: function(){ startCounter2++; },
      end: function(){ endCounter2++; }
    };
  }

  var startCounter3 = 0;
  var endCounter3 = 0;

  function createStubModule3(sandbox){
    // create a stub module for unit tests purpose

    return {
      start: function(){ startCounter3++; },
      end: function(){ endCounter3++; }
    };
  }

  function testStartAll(){
    var ut = lb.core.application.startAll;

    array.empty( lb.core.application.getModules() );
    ut();

    var module1 = new Module('lb.ui.stub1', createStubModule1);
    var module2 = new Module('lb.ui.stub2', createStubModule2);
    var module3 = new Module('lb.ui.stub3', createStubModule3);
    lb.core.application.addModule(module1);
    lb.core.application.addModule(module2);
    lb.core.application.addModule(module3);

    startCounter1 = 0;
    startCounter2 = 0;
    startCounter3 = 0;
    ut();
    assert.equals(startCounter1, 1,             "module 1 must have started");
    assert.equals(startCounter2, 1,             "module 2 must have started");
    assert.equals(startCounter3, 1,             "module 3 must have started");

  }

  function testEndAll(){
    var ut = lb.core.application.endAll;

    array.empty( lb.core.application.getModules() );
    ut();

    var module1 = new Module('lb.ui.stub1', createStubModule1);
    var module2 = new Module('lb.ui.stub2', createStubModule2);
    var module3 = new Module('lb.ui.stub3', createStubModule3);
    lb.core.application.addModule(module1);
    lb.core.application.addModule(module2);
    lb.core.application.addModule(module3);

    endCounter1 = 0;
    endCounter2 = 0;
    endCounter3 = 0;
    ut();
    assert.equals(endCounter1, 1,                 "module 1 must have ended");
    assert.equals(endCounter2, 1,                 "module 2 must have ended");
    assert.equals(endCounter3, 1,                 "module 3 must have ended");
    assert.arrayEquals( lb.core.application.getModules(), [],
                                                   "no more module expected");
  }

  function testRun(){
    var ut = lb.core.application.run;

    var onloadListeners = events.getListeners(window, 'load', false);
    var onloadListenersCountBefore = onloadListeners.length;

    var unloadListeners = events.getListeners(window, 'unload', false);
    var unloadListenersCountBefore = unloadListeners.length;
    ut();

    onloadListeners = events.getListeners(window, 'load', false);
    assert.equals( onloadListeners.length, onloadListenersCountBefore + 1,
                                        "one more onload listener expected");
    assert.equals( last(onloadListeners).listener,
                   lb.core.application.startAll,
                                  "startAll expected as last onload handler");

    unloadListeners = events.getListeners(window, 'unload', false);
    assert.equals( unloadListeners.length, unloadListenersCountBefore + 1,
                                        "one more onunload listener expected");
    assert.equals( last(unloadListeners).listener,
                   lb.core.application.endAll,
                                   "endAll expected as last unload listener");
  }

  var tests = {
    testNamespace: testNamespace,
    testSetOptions: testSetOptions,
    testGetModules: testGetModules,
    testAddModule: testAddModule,
    testRemoveModule: testRemoveModule,
    testStartAll: testStartAll,
    testEndAll: testEndAll,
    testRun: testRun
  };

  testrunner.define(tests, "lb.core.application");
  return tests;

}());
