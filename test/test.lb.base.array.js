/*
 * test.lb.base.array.js - Unit Tests of lb.base.array module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-18
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.array.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.array

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','array'),
                                      "lb.base.array namespace was not found");
  }

  function testAddOne(){
    var ut = lb.base.array.addOne;

    var array = [];
    ut(array,1);
    ut(array,2);
    ut(array,3);
    assert.arrayEquals(array, [1,2,3],             "each item must be added");

    ut(array,1);
    ut(array,2);
    ut(array,3);
    assert.arrayEquals(array, [1,2,3],           "no duplicate may be added");
  }

  function testRemoveOne(){
    var ut = lb.base.array.removeOne;

    var array = [1,2,3,2,1];
    ut(array,2);
    assert.arrayEquals(array, [1,3,2,1],
         "only first item expected to be removed (not duplicate by default)");

    ut(array,2);
    assert.arrayEquals(array, [1,3,1],
                        "second item expected to be removed on second pass");

    ut(array,2);
    assert.arrayEquals(array, [1,3,1],
                               "no changes expected when item is not found");
  }

  function testRemoveAll(){
    var ut = lb.base.array.removeAll;

    var array = ['a',2,/3/];
    ut(array);
    assert.arrayEquals(array, [],           "array now expected to be empty");
  }

  function testCopy(){
    var ut = lb.base.array.copy;

    var object = {id: 42};
    var array = ['a', 2, object];

    assert.arrayEquals( ut(array), ['a', 2, object],
                                                    "copy of array expected");
  }

  function testToArray(){
    var ut = lb.base.array.toArray;

    var three = {id:42};
    (function(a,b,c){
        var args = ut(arguments);
        assert.arrayEquals( args, [1,'two',three],
                 "arguments expected to be converted to an equivalent array");
    }(1,'two',three));
  }

  var tests = {
    testNamespace: testNamespace,
    testAddOne: testAddOne,
    testRemoveOne: testRemoveOne,
    testRemoveAll: testRemoveAll,
    testCopy: testCopy,
    testToArray: testToArray
  };

  testrunner.define(tests, "lb.base.array");
  return tests;

}());
