/*
 * test.lb.core.dom.js - Unit Tests of lb.core.dom module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-04-28
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.dom.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.string.js */
/*requires bezen.dom.js */
/*requires bezen.testrunner.js */
/*requires goog.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, document */
(function() {
  // Builder of
  // Closure object for Test of lb.core.dom

  // Define aliases
  var assert = bezen.assert,
      exists = bezen.object.exists,
      testrunner = bezen.testrunner,
      endsWith = bezen.string.endsWith,
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE,
      $ = bezen.$,
      element = bezen.dom.element,
      events = goog.events;

  function testNamespace(){

    assert.isTrue( exists(window,'lb','core','dom'),
                                        "lb.core.dom namespace was not found");
  }

  function test$(){
    var ut = lb.core.dom.$;

    assert.equals( ut('testId'), document.getElementById('testId'),
                        "$ must return same node as document.getElementById");

    assert.equals( ut('missing'), null,  "$ must return null for missing id");
  }

  function testElement(){
    var ut = lb.core.dom.element;

    // Unit tests below taken from testElement in bezen.dom.test.js
    // part of bezen.org Javascript Library, CC-BY Eric Bréchemier

    var div =
      ut('div',{id:'newDiv'},
        ut('ul',{'title':'my list'},
           ut('li',{},
             ut('a',{href:"#first"},"first link")
           ),
           ut('li',{},
             ut('a',{href:"#second"},"second link")
           ),
           ut('li',{},
             ut('a',{href:"#third"},"third link")
           )
        )
      );

    assert.isTrue( exists(div),                 "div must exist");
    assert.equals( div.nodeType, ELEMENT_NODE,
                                                "div must have type ELEMENT");
    assert.equals( div.nodeName, "DIV",         "div must have name DIV");
    assert.equals( div.id, 'newDiv',            "div.id must be set");
    assert.equals( div.childNodes.length, 1,    "div must have 1 child"); 

    var ul = div.firstChild;
    assert.equals( ul.nodeType, ELEMENT_NODE,
                                               "ul must have type ELEMENT");
    assert.equals( ul.nodeName, "UL",          "ul must have name UL");
    assert.equals( ul.getAttribute('title'), "my list",
                                               "ul must have title 'my list'");
    assert.equals( ul.childNodes.length, 3,    "ul must have 3 children"); 

    var li1 = ul.firstChild;
    assert.equals( li1.nodeType, ELEMENT_NODE,
                                                "li1 must have type ELEMENT");
    assert.equals( li1.nodeName, "LI",          "li1 must have name LI");
    assert.equals( li1.childNodes.length, 1,    "li1 must have 1 child");
    var a1 = li1.firstChild;
    assert.equals( a1.nodeType, ELEMENT_NODE,
                                                "a1 must have type ELEMENT");
    assert.equals( a1.nodeName, "A",            "a1 must have name A");
    assert.isTrue( endsWith(a1.href,'#first'),  "a1 must have href set");
    assert.equals( a1.childNodes.length, 1,     "a1 must have 1 child");
    var t1 = a1.firstChild;
    assert.equals( t1.nodeType, TEXT_NODE, "t1 must have type TEXT");
    assert.equals( t1.data, "first link",       "t1 data must be set");

    var li2 = li1.nextSibling;
    assert.equals( li2.nodeType, ELEMENT_NODE,
                                                "li2 must have type ELEMENT");
    assert.equals( li2.nodeName, "LI",          "li2 must have name LI");
    assert.equals( li2.childNodes.length, 1,    "li2 must have 1 child");
    var a2 = li2.firstChild;
    assert.equals( a2.nodeType, ELEMENT_NODE,
                                                "a2 must have type ELEMENT");
    assert.equals( a2.nodeName, "A",            "a2 must have name A");
    assert.isTrue( endsWith(a2.href,'#second'), "a2 must have href set");
    assert.equals( a2.childNodes.length, 1,     "a2 must have 1 child");
    var t2 = a2.firstChild;
    assert.equals( t2.nodeType, TEXT_NODE, "t2 must have type TEXT");
    assert.equals( t2.data, "second link",      "t2 data must be set");

    var li3 = li2.nextSibling;
    assert.equals( li3.nodeType, ELEMENT_NODE,
                                                "li3 must have type ELEMENT");
    assert.equals( li3.nodeName, "LI",          "li3 must have name LI");
    assert.equals( li3.childNodes.length, 1,    "li3 must have 1 child");
    var a3 = li3.firstChild;
    assert.equals( a3.nodeType, ELEMENT_NODE,
                                                "a3 must have type ELEMENT");
    assert.equals( a3.nodeName, "A",            "a3 must have name A");
    assert.isTrue( endsWith(a3.href,'#third'),  "a3 must have href set");
    assert.equals( a3.childNodes.length, 1,     "a3 must have 1 child");
    var t3 = a3.firstChild;
    assert.equals( t3.nodeType, TEXT_NODE, "t3 must have type TEXT");
    assert.equals( t3.data, "third link",       "t3 data must be set");

    var mix = ut('div',{},
      "text before",
      ut('p',{},
        "text inside"
      ),
      "text after"
    );

    assert.isTrue( exists(mix),                 "mix must exist");
    assert.equals( mix.nodeType, ELEMENT_NODE,
                                                "mix must have type ELEMENT");
    assert.equals( mix.nodeName, "DIV",         "mix must have name DIV");
    assert.equals( mix.childNodes.length, 3,    "mix must have 3 children");

    var before = mix.firstChild;
    var p = before.nextSibling;
    var after = p.nextSibling;

    assert.equals( before.nodeType, TEXT_NODE,
                                                "before must have type TEXT");
    assert.equals( before.data, "text before",  "before data must be set");

    assert.equals( p.nodeType, ELEMENT_NODE,
                                                "p must have type ELEMENT");
    assert.equals( p.nodeName, "P",             "p must have name P");
    assert.equals( p.childNodes.length, 1,      "p must have 1 child");
    var inside = p.firstChild;
    assert.equals( inside.nodeType, TEXT_NODE,
                                                "inside must have type TEXT");
    assert.equals( inside.data, "text inside",  "inside data must be set");

    assert.equals( after.nodeType, TEXT_NODE,
                                                "after must have type TEXT");
    assert.equals( after.data, "text after",    "after data must be set");
  }

  function testGetClasses(){
    var ut = lb.core.dom.getClasses;

    assert.objectEquals( ut( $('noClass') ), {},
                              "empty hash expected when no class is present");
    assert.objectEquals( ut( $('emptyClass') ), {},
                                   "empty hash expected when class is empty");
    assert.objectEquals( ut( $('oneClass') ), {'one':true},
                                                "one class expected in hash");
    assert.objectEquals( ut( $('twoClasses') ), {'one':true, 'two':true},
                                              "two classes expected in hash");
    assert.objectEquals( ut( $('threeClasses') ), 
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");
  }

  function testAddClass(){
    var ut = lb.core.dom.addClass;

    var div = element('div');
    ut(div, 'one');
    assert.equals(div.className, 'one',
                                   "'one' expected in class after first add");

    ut(div, 'two');
    assert.equals(div.className, 'one two',
                              "'one two' expected in class after second add");

    ut(div, 'three');
    assert.equals(div.className, 'one two three',
                         "'one two three' expected in class after third add");

    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when adding existign class");
  }

  function testRemoveClass(){
    var ut = lb.core.dom.removeClass;

    var div = element('div');
    div.className = 'one two three';

    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    ut(div, 'two');
    assert.equals(div.className, 'one three',
                             "no change expected when removing absent class");

    ut(div, 'one');
    assert.equals(div.className, 'three',
                                        "class 'one' expected to be removed");

    ut(div, 'three');
    assert.equals(div.className, '',
                                      "class 'three' expected to be removed");
  }

  function testAddListener(){
    var ut = lb.core.dom.addListener;

    var div1 = element('div');
    var events1 = [];
    var callback1 = function(event){
      events1.push(event);
    };
    ut(div1, 'click', callback1, true);
    var listeners1 = events.getListeners(div1, 'click', true);
    assert.equals(listeners1.length, 1,
                                   "one capturing listener expected on div1");
    var event1 = {};
    listeners1[0].handleEvent(event1);
    assert.arrayEquals(events1,[event1],
                            "callback expected to be triggered with event1");

    var div2 = element('div');
    var events2 = [];
    var callback2 = function(event){
      events2.push(event);
    };
    ut(div2, 'click', callback2);
    var listeners2 = events.getListeners(div2, 'click', false);
    assert.equals(listeners2.length, 1,
                               "one non-capturing listener expected on div2");
    var event2 = {};
    listeners2[0].handleEvent(event2);
    assert.arrayEquals(events2,[event2],
                            "callback expected to be triggered with event2");
  }

  function testRemoveListener(){
    var ut = lb.core.dom.removeListener;

    var div1 = element('div');
    var callback1 = function(){};
    events.listen(div1, 'click', callback1);
    assert.equals( events.getListeners(div1,'click',false).length, 1,
                            "assert: non-capturing listener must be set");
    ut(div1, 'click', callback1);
    assert.arrayEquals( events.getListeners(div1,'click',false), [],
                            "non-capturing listener expected to be removed.");

    var div2 = element('div');
    var callback2 = function(){};
    events.listen(div2, 'click', callback2, true);
    assert.equals( events.getListeners(div2,'click',true).length, 1,
                                   "assert: capturing listener must be set");
    ut(div2, 'click', callback2);
    assert.arrayEquals( events.getListeners(div2,'click',false), [],
                               "capturing listener expected to be removed.");
  }

  var tests = {
    testNamespace: testNamespace,
    test$: test$,
    testElement: testElement,
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass,
    testAddListener: testAddListener,
    testRemoveListener: testRemoveListener
  };

  testrunner.define(tests, "lb.core.dom");
  return tests;

}());
