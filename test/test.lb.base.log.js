/*
 * test.lb.base.log.js - Unit Tests of lb.base.log module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-18
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.log.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.log

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires goog.debug.Logger.js */
      LogManager = goog.debug.LogManager;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','log'),
                                       "lb.base.log namespace was not found");
  }

  function testPrint(){
    var ut = lb.base.log.print;

    var logRecords = [];
    var logHandler = function(logRecord){
      logRecords.push(logRecord);
    };

    var rootLogger = LogManager.getRoot();
    rootLogger.addHandler(logHandler);

    var testMessage = 'Test message for log.print';
    ut(testMessage);

    assert.equals(logRecords.length, 1,             "1 log record expected");
    assert.equals(logRecords[0].getMessage(), testMessage, 
                                      "test message expected in log record");
  }

  var tests = {
    testNamespace: testNamespace,
    testPrint: testPrint
  };

  testrunner.define(tests, "lb.base.log");
  return tests;

}());
