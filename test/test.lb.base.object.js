/*
 * test.lb.base.object.js - Unit Tests of lb.base.object module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-18
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.object.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.object

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','object'),
                                    "lb.base.object namespace was not found");
  }

  function testClone(){
    var ut = lb.base.object.clone;

    var object = {
      bool: true,
      num: 42,
      str: 'abc',
      obj: {id: 'one'},
      arr: [
        true, 42, 'abc', {id:'two'}
      ]
    };

    var shallow = ut(object);
    assert.objectEquals(shallow, object,        "shallow copy must be a copy");
    for (var name in object){
      if ( object.hasOwnProperty(name) ){
        assert.equals( object[name], shallow[name],
                     "property '"+name+"' must be identical in shallow copy");
      }
    }

    var deep = ut(object,true);
    assert.objectEquals(deep, object,             "deep copy must be a copy");
    assert.isFalse( deep.obj === object.obj,
                             "'obj' must be a different object in deep copy");
    assert.isFalse( deep.arr === object.arr,
                             "'arr' must be a different array in deep copy");
  }

  var tests = {
    testNamespace: testNamespace,
    testClone: testClone
  };

  testrunner.define(tests, "lb.base.object");
  return tests;

}());
