/*
 * test.lb.base.template.string.js - Unit Tests of lb.base.template.string
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.string.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.string

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

    assert.isTrue( object.exists(window,'lb','base','template','string'),
                           "lb.base.template.string namespace was not found");
  }

  function testReplaceParams(){
    var ut = lb.base.template.string.replaceParams;

    var noParam = 'No param to replace';
    assert.equals( ut(noParam,{}), noParam,
                              "no change expected without params to replace");

    var noParamReally = 'No #param, #here!#really$#';
    assert.equals( ut(noParamReally,{}), noParamReally,
                      "no change expected without params to replace, really");

    var rangeParam = '#abc-xyz_ABC-XYZ_0-9#';
    assert.equals( ut(rangeParam,{'abc-xyz_ABC-XYZ_0-9':'value'}), 'value',
                       "replacement expected for parameter with large range "+
                                    "with large range of characters in name");

    var nestedParam = '#a.b.c.d#';
    assert.equals( ut(nestedParam,{a:{b:{c:{d:'value'}}}}),'value',
                              "replacement expected for nested param value");

    var paramInText = 'Before #param# after';
    assert.equals( ut(paramInText,{param:'value'}), 'Before value after',
                               "parameter in text expectec to be replaced");

    var missingParam = '#missing#';
    assert.equals( ut(missingParam,{}), missingParam,
                          "missing parameter expected to be left unreplaced");

    var multipleParams = 'Before#param1##param2##param3#After';
    assert.equals( ut(multipleParams,{
                     param1: ';value1;',
                     param2: '',
                     param3: ';value3;'
                   }), 'Before;value1;;value3;After',
        "multiple parameters expected to be replaced, including empty string");
  }

  var tests = {
    testNamespace: testNamespace,
    testReplaceParams: testReplaceParams
  };

  testrunner.define(tests, "lb.base.template.string");
  return tests;

}());
