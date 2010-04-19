/*
 * test.lb.js - Unit Tests of lb root namespace
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-19
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of Legal Box Web Application
 
  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  var testNamespace = function(){
    
    assert.isTrue( object.exists(window,'lb'),
                                                "lb namespace was not found");
  };

  var tests = {
    testNamespace: testNamespace
  };
   
  testrunner.define(tests, "lb");
  return tests;
   
}());
