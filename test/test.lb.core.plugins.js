/*
 * test.lb.core.plugins.js - Unit Tests of lb.core.plugins namespace
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-07-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*jslint white:false, onevar:false, plusplus:false */
/*global define, window, lb */
define(
  [
    "bezen.org/bezen.assert",
    "bezen.org/bezen.object",
    "bezen.org/bezen.testrunner",
    "lb/lb.core.plugins"
  ],
  function(
    assert,
    object,
    testrunner,
    plugins
  ){

    function testNamespace(){

      assert.isTrue( object.exists(plugins),
                        "plugins namespace module not found in dependencies");

      if ( object.exists(window) ){
        assert.isTrue( object.exists(window,'lb','core','plugins'),
                                    "lb.core.plugins namespace was not found");
        assert.equals( plugins, lb.core.plugins,
         "same module expected in lb.core.plugins for backward compatibility");
      }
    }

    var tests = {
      testNamespace: testNamespace
    };

    testrunner.define(tests, "lb.core.plugins");
    return tests;
  }
);
