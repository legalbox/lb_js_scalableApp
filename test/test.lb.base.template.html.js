/*
 * test.lb.base.template.html.js - Unit Tests of lb.base.template.html module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-29
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.html.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.html

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.dom.js*/
      element = bezen.dom.element,
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      ATTRIBUTE_NODE = bezen.dom.ATTRIBUTE_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','template','html'),
                            "lb.base.template.html namespace was not found");
  }

  function testTopDownParsing(){
    var ut = lb.base.template.html.topDownParsing;

    var captured = [];
    var catchFilter = function(){
      captured.push(arguments);
    };

    try {
      ut();
      ut(null);
      ut(null,null);
      ut(null,[]);
    } catch (e0) {
      assert.fail("No error expected when required arguments are missing: "+e);
    }

    try {
      assert.equals(
        ut( document.createElement('div'), [catchFilter] ),
        undefined,
                                  "no processing expected on single element");
      assert.equals(
        ut( document.createAttribute('title'), [catchFilter] ),
        undefined,
                                "no processing expected on single attribute");
      assert.equals(
        ut( document.createTextNode('Text'), [catchFilter] ),
        undefined,
                                "no processing expected on single text node");

      assert.equals(
        ut( document.createComment('Text'), [catchFilter] ),
        undefined,
                             "no processing expected on single comment node");

      assert.equals(
        ut( document.createDocumentFragment(), [catchFilter] ),
        undefined,
                   "no processing expected on single document fragment node");

      // Operations not supported in FF,Chrome,Safari,IE:
      //   * document.createCDATASection('Text')
      //   * document.createProcessingInstruction('target','data')
      // Only supported in Opera.

    } catch(e) {
      assert.fail("top down parsing must not fail on any type of node: "+e);
    }
    assert.arrayEquals( captured, [],
                                   "no recursion expected for single nodes");

    var capturedNames = {};
    function catchAttributes(attribute){
      capturedNames[attribute.name] = true;
    }

    var filters = [catchFilter,catchAttributes];
    var elementWithAttributesOnly = element('div',
      {id:'id value',title:'title value',lang:'lang value'}
    );
    var one = {}, two = 2, three = 'three';
    ut(elementWithAttributesOnly, one, two, three, filters);
    assert.equals( captured.length, 3,
                                    "3 attributes expected to be processed");
    for(var i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],      "params and filters expected in each call (attributes only)");
    }
    assert.objectEquals(capturedNames,{id:true,title:true,lang:true},
                    "attributes id, title and lang expected to be processed");

    var capturedTitles = [];
    function captureTitles(element){
      capturedTitles.push(element.title);
    }

    var deepElement =
      element('div',{title:'1'},
        element('div',{title:'1.1'},
          element('div',{title:'1.1.1'})
        )
      );
    captured = [];
    filters = [catchFilter,captureTitles];
    ut(deepElement,one,two,three,filters);
    assert.equals( captured.length, 2,
                                 "2 elements deep expected to be processed");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],   "params and filters expected in each call (elements deep only)");
    }
    assert.arrayEquals(capturedTitles, ['1.1','1.1.1'],
                         "titles of two nodes deep expected to be processed");

    var wideElement =
      element('div',{title:'1'},
        element('div',{title:'1.a'}),
        element('div',{title:'1.b'}),
        element('div',{title:'1.c'})
      );
    captured = [];
    capturedTitles = [];
    ut(wideElement,one,two,three,filters);
    assert.equals( captured.length, 3,
                                 "3 elements wide expected to be processed");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],   "params and filters expected in each call (elements wide only)");
    }
    assert.arrayEquals(capturedTitles, ['1.a','1.b','1.c'],
                      "titles of three nodes wide expected to be processed");

    var wideAndDeepElement =
      element('div',{title:'1'},
        element('div',{title:'1.a'},
          element('div',{title:'1.a.1'}),
          element('div',{title:'1.a.2'}),
          element('div',{title:'1.a.3'})
        ),
        element('div',{id:'1.b'},
          element('div',{title:'1.b.1'}),
          element('div',{title:'1.b.2'}),
          element('div',{title:'1.b.3'})
        ),
        element('div',{id:'1.c'},
          element('div',{title:'1.c.1'}),
          element('div',{title:'1.c.2'}),
          element('div',{title:'1.c.3'})
        )
      );
    captured = [];
    capturedTitles = [];
    ut(wideAndDeepElement,one,two,three,filters);
    assert.equals( captured.length, 12,
                        "12 elements expected to be processed wide and deep");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],
         "params and filters expected in each call (elements wide and deep)");
    }
    assert.arrayEquals(capturedTitles,
      ['1.a',
         '1.a.1','1.a.2','1.a.3',
       '1.b',
         '1.b.1','1.b.2','1.b.3',
       '1.c',
         '1.c.1','1.c.2','1.c.3'
      ],
                 "titles of 12 nodes expected to be processed wide and deep");

    var capturedNodeTypes = [];
    function captureNodeTypes(node){
      capturedNodeTypes.push(node.nodeType);
    }
    filters = [catchFilter,captureNodeTypes];

    var mixedElement =
      element('div',{id:'id',title:'title',lang:'lang'},
          'text1',
          element('div'),
          'text2',
          element('div'),
          'text3',
          element('div')
      );
    captured = [];
    ut(mixedElement,one,two,three,filters);
    assert.equals( captured.length, 9,
                "9 nodes expected to be processed in mixed content element");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],       "params and filters expected in each call (mixed content)");
    }
    assert.arrayEquals(capturedNodeTypes,
      [ATTRIBUTE_NODE,ATTRIBUTE_NODE,ATTRIBUTE_NODE,
       TEXT_NODE,ELEMENT_NODE,
       TEXT_NODE,ELEMENT_NODE,
       TEXT_NODE,ELEMENT_NODE],
           "node types of 9 nodes expected to be processed (mixed content)");
  }

  function testReplaceParams(){
    var ut = lb.base.template.html.replaceParams;

    var htmlNode = element('div',{id:'theOne',title:'#param1#'},'#param2#');
    ut(htmlNode,{param1:'value1',param2:'value2'});
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      '#param1#',
      '#param2#'
    ],                  "no replacement expected at the element node level");

    ut(
      htmlNode.getAttributeNode('id'),
      {param1:'value1',param2:'value2'}
    );
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      'value1',
      '#param2#'
    ],                    "parameter in attribute expected to be replaced");

    ut(
      htmlNode.firstChild,
      {param1:'value1',param2:'value2'}
    );
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      'value1',
      'value2'
    ],                    "parameter in text node expected to be replaced");
  }

  var tests = {
    testNamespace: testNamespace,
    testTopDownParsing: testTopDownParsing,
    testReplaceParams: testReplaceParams
  };

  testrunner.define(tests, "lb.base.template.html");
  return tests;

}());
