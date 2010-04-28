/*
 * test.lb.core.log.js - Unit Tests of lb.core.log module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-28
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.log.js */
/*requires goog.debug.Logger.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.log

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','log'),
                                       "lb.core.log namespace was not found");
  }

  function testPrint(){
    var ut = lb.core.log.print;

    var logRecords = [];
    var logHandler = function(logRecord){
      logRecords.push(logRecord);
    };

    var rootLogger = goog.debug.LogManager.getRoot();
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

  testrunner.define(tests, "lb.core.log");
  return tests;

}());
