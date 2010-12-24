/*
 * test.lb.base.template.js - Unit Tests of lb.base.template module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-24
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.dom.js*/
      element = bezen.dom.element;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','template'),
                                  "lb.base.template namespace was not found");
  }

  function testApplyFilters(){
    var ut = lb.base.template.applyFilters;

    try {
      ut();
    }catch(noFilters){
      assert.fail("No error expected without filter argument: "+noFilters);
    }

    try {
      ut([]);
    }catch(emptyFilters){
      assert.fail("No error expected with empty filters array: "+emptyFilters);
    }

    var captured = [];
    function catchFilter(){
      captured.push.apply(captured,arguments);
    }

    var arg1 = {}, arg2 = 'XYZ', arg3 = /abc/g;
    var filters = [catchFilter];
    ut(arg1,arg2,arg3,filters);
    assert.arrayEquals(captured, [arg1,arg2,arg3,filters],
                                     "3 arguments expected to be captured");

    captured = [];
    filters = [catchFilter];
    ut(arg1,arg2,arg3, arg1,arg2,arg3, arg1,arg2,arg3, filters);
    assert.arrayEquals(captured, [arg1,arg2,arg3,
                                  arg1,arg2,arg3,
                                  arg1,arg2,arg3,
                                  filters],
                                     "9 arguments expected to be captured");

    function returnFalse(){
      return false;
    }
    function returnTrue(){
      return true;
    }
    function returnUndefined(){
      return;
    }

    captured = [];
    filters = [catchFilter, returnTrue];
    ut(filters);
    assert.arrayEquals(captured,[],
            "processing expected to stop when previous filter returns true");

    captured = [];
    filters = [catchFilter, returnFalse];
    ut(filters);
    assert.equals(captured.length, 1,
         "processing expected to continue when previous filter returns false");

    captured = [];
    filters = [catchFilter, returnUndefined];
    ut(filters);
    assert.equals(captured.length, 1,
     "processing expected to continue when previous filter returns undefined");

    captured = [];
    filters = [
                 catchFilter,
                 returnTrue,
                 catchFilter,
                 returnFalse,
                 catchFilter,
                 returnUndefined,
                 catchFilter
              ];
    ut(filters);
    assert.equals(captured.length, 3,
                   "filters expected to be triggered until one returns true");

    // Test functions defined in documentation of the method
    var applyFilters = ut;
    var ELEMENT_NODE = 1;
    function topDownParsing(node,context,filters){
      if (!node || node.nodeType!==ELEMENT_NODE){
        return;
      }
      var i, length, attribute, child;
      for (i=0, length=node.attributes.length; i<length; i++){
        attribute = node.attributes[i];
        applyFilters(attribute,context,filters);
      }
      for (i=0, length=node.childNodes.length; i<length; i++){
        child = node.childNodes[i];
        applyFilters(child,context,filters);
      }
    }

    var PARAM_REGEXP = /#([a-zA-Z0-9\-]+)#/g;
    function replaceParams(node,context){
      if ( !node || !node.nodeValue || !node.nodeValue.replace ||
           !context || !context.data){
        return;
      }

      node.nodeValue = node.nodeValue.replace(
        PARAM_REGEXP,
        function(match,param){
          return context.data[param];
        }
      );
    }

    var node = element('span',{},'Welcome #name#');
bezen.log.info( node.innerHTML, true);

    ut(
      node,
      {data:
        {name:'John Doe'}
      },
      [ topDownParsing, replaceParams]
    );
bezen.log.info( node.innerHTML, true);

    var TEXT_NODE = 3;
    assert.arrayEquals(
      [
        node.nodeType,
        node.nodeName,
        node.childNodes.length,
        node.childNodes[0].nodeType,
        node.childNodes[0].nodeValue
      ],
      [
        ELEMENT_NODE,
        'SPAN',
        1,
        TEXT_NODE,
        'Welcome John Doe'
      ],      "input node expected to be updated with param value replaced");

    function replaceParamsInString(string, data){
      return string.replace(PARAM_REGEXP, function(match,param){
        return data[param];
      });
    }

    var greeting = ut(
      'Welcome #name#',
      {name: 'John Doe'},
      [replaceParamsInString]
    );
    assert.equals( greeting, 'Welcome John Doe',
                         "value expected to be replaced in string greeting");
  }

  var tests = {
    testNamespace: testNamespace,
    testApplyFilters: testApplyFilters
  };

  testrunner.define(tests, "lb.base.template");
  return tests;

}());
