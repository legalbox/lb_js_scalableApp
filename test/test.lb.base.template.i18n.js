/*
 * test.lb.base.template.i18n.js - Unit Tests of lb.base.template.i18n module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-03
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.i18n.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.i18n

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

    assert.isTrue( object.exists(window,'lb','base','template','i18n'),
                            "lb.base.template.i18n namespace was not found");
  }

  function testFilterByLanguage(){
    var ut = lb.base.template.i18n.filterByLanguage;

    assert.equals( ut(), null, "no function expected for undefined language");
    assert.equals( ut(null), null,
                                    "no function expected for null language");
    assert.equals( ut({}), null,
                   "no function expected for language which is not a string");

    var noLanguageElement = element('div');
    var emptyLangElement = element('div',{lang:''});
    var frenchElement = element('div',{lang:'fr'});
    var frenchFranceElement = element('div',{lang:'fr-FR'});
    var englishElement = element('div',{lang:'en'});
    var englishUKElement = element('div',{lang:'en-GB'});

    var parent = element('div');
    function setChild(parent,node){
      // set the given node as only child of given parent

      // remove previous child nodes
      parent.innerHTML = '';
      parent.appendChild(node);
      assert.equals( parent.firstChild, node,
                      "assert: target node expected to be set to first child");
    }

    function assertFilterPreserves(filterLanguage,filter,node){
      // assert that given filter function preserves the node in test parent

      setParent(parent,node);
      filter(node);
      assert.equals(node.parentNode,parent,
                                              "filter for '"+filterLanguage+
                                  "' expected to preserve node with lang '"+
                                                              node.lang+"'");
    }

    function assertFilterRemoves(filterLanguage,filter,node){
      // assert that given filter function removes the node from test parent

      setParent(parent,node);
      filter(node);
      assert.isFalse( node.parentNode===parent,
                                               "filter for '"+filterLanguage+
                                     "' expected to remove node with lang '"+
                                                              node.lang+"'");
    }

    function assertDoesNotFail(filterLanguage,filter){
      // assert that the filter does not fail on null/undefined, other
      // data types, other kinds of nodes, nor on element without parent.

      try {
        filter();
        filter(null);
      } catch(e1){
        assert.fail(
            "Filter for '"+filterLanguage+"' failed on null/undefined: "+e1);
      }

      try {
        filter({});
        filter(new Date());
      } catch(e2){
        assert.fail(
           "Filter for '"+filterLanguage+"' failed on other data types: "+e2);
      }

      try {
        filter(document.createAttributeNode('test'));
        filter(document.createTextNode('Text'));
        filter(document.createDocumentFragment());
        filter(document.createCommentNode('Text'));
      } catch(e3){
        assert.fail(
           "Filter for '"+filterLanguage+"' failed on other data types: "+e3);
      }

      try {
        filter( element('div',{lang:'other'}) );
      } catch(e4){
        assert.fail(
           "Filter for '"+filterLanguage+"' failed on missing parent: "+e4);
      }
    }
  }

  function testSetLanguage(){
    var ut = lb.base.template.i18n.setLanguage;

    assert.fail("Missing tests");
  }

  var tests = {
    testNamespace: testNamespace,
    testFilterByLanguage: testFilterByLanguage,
    testSetLanguage: testSetLanguage
  };

  testrunner.define(tests, "lb.base.template.i18n");
  return tests;

}());
