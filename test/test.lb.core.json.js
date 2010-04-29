/*
 * test.lb.core.json.js - Unit Tests of lb.core.json module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-29
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.json.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.json

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','json'),
                                      "lb.core.json namespace was not found");
  }

  function testSerialize(){
    var ut = lb.core.json.serialize;

    var object = {
      string: 'one',
      number: 2,
      object: {
        id: 3
      },
      array: [
        'one',
        2,
        {id: 3},
        true,
        false,
        null
      ]
    };
    var jsonString = ut(object);
    assert.isTrue( typeof jsonString === 'string',
                        "serialization of JSON object must produce a string");

    // Use unsafe parsing with eval to check result
    assert.objectEquals( eval('('+jsonString+')'), object,
 "object begot from unsafe parsing of JSON string must equal original object");

    var array = [ {id:1}, {id:2}, {id:3} ];
    assert.equals( ut(array), '[{"id":1},{"id":2},{"id":3}]',
                                    "unexpected serialization of json array");
  }

  function testParse(){
    var ut = lb.core.json.parse;

    var string = '{'+
      '"string": "one",'+
      '"number": 2,'+
      '"object": {'+
        '"id": 3'+
      '},'+
      '"array": ['+
        '"one",'+
        '2,'+
        '{"id": 3},'+
        'true,'+
        'false,'+
        'null'+
      ']'+
    '}';

    var object = {
      string: 'one',
      number: 2,
      object: {
        id: 3
      },
      array: [
        'one',
        2,
        {id: 3},
        true,
        false,
        null
      ]
    };

    assert.objectEquals( ut(string), object,
                    "parsed JSON string expected to equal reference object");

    string = '[{"id":1},{"id":2},{"id":3}]';
    assert.objectEquals( ut(string), [{id:1},{id:2},{id:3}],
                     "parsed JSON string expected to equal reference array");
  }

  var tests = {
    testNamespace: testNamespace,
    testSerialize: testSerialize,
    testParse: testParse
  };

  testrunner.define(tests, "lb.core.json");
  return tests;

}());
