/*
 * test.lb.ui.js - Unit Tests of lb.ui namespace
 *
 * Author:    Eric Bréchemier <contact@legalbox.com>
 * Copyright: Legalbox (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-07-12
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*jslint vars:true */
/*global define, window, lb */
define(
  [
    "bezen.org/bezen.assert",
    "bezen.org/bezen.object",
    "bezen.org/bezen.testrunner",
    "lb/lb.ui"
  ],
  function(
    assert,
    object,
    testrunner,
    ui
  ){

    function testNamespace(){

      assert.isTrue( object.exists(ui),
                             "ui namespace module not found in dependencies");

      if ( object.exists(window) ){
        assert.isTrue( object.exists(window,'lb','ui'),
                                             "lb.ui namespace was not found");
        assert.equals( ui, lb.ui,
                 "same module expected in lb.ui for backward compatibility");
      }
    }

    var tests = {
      testNamespace: testNamespace
    };

    testrunner.define(tests, "lb.ui");
    return tests;
  }
);
