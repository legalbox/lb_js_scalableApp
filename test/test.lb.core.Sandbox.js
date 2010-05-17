/*
 * test.lb.core.Sandbox.js - Unit Tests of Sandbox for Modules
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-05-17
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.Sandbox.js */
/*requires lb.core.application.js */
/*requires lb.core.events.publisher.js */
/*requires lb.core.events.Subscriber.js */
/*requires bezen.js */
/*requires bezen.string.js */
/*requires bezen.dom.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*requires goog.events.js */
/*requires goog.net.MockXmlHttp */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, document, goog */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner,
      $ = bezen.$,
      endsWith = bezen.string.endsWith,
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE,
      element = bezen.dom.element,
      events = goog.events,
      MockXmlHttp = goog.net.MockXmlHttp;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','Sandbox'),
                                   "lb.core.Sandbox namespace was not found");
  }

  function testConstructor(){
    var Ut = lb.core.Sandbox;

    var sandbox = new Ut('myId');
  }

  function testGetId(){
    // Unit tests for lb.core.Sandbox#getId()

    var testId = 'lb.ui.myModule';
    var sandbox = new lb.core.Sandbox(testId);
    assert.equals( sandbox.getId(), testId,
                                  "id must match value given in constructor");
    assert.isFalse( object.exists( $('lb.ui.myModule') ),
                    "box element must not be created until getBox is called");

    assert.equals( sandbox.getId('testId'), 'lb.ui.myModule.testId',
                    "conversion to full id must add prefix and separator");
  }

  function testGetBox(){
    // Unit tests for lb.core.Sandbox#getBox()

    var sandbox = new lb.core.Sandbox('testGetBox');
    assert.equals( sandbox.getBox(), $('testGetBox'),
                               "box element 'testGetBox' should be returned");

    sandbox = new lb.core.Sandbox('missing');
    var box = sandbox.getBox();
    assert.isTrue( object.exists(box),         "missing box must be created");
    assert.equals(box, $('missing'),   "new element must be created with id");
    assert.equals(box.nodeType,ELEMENT_NODE,
                                       "new element must be an element node");
    assert.equals(box.nodeName, 'DIV',           "new element must be a DIV");
    assert.equals(box.parentNode, document.body,
                              "new element must be created in document.body");
    assert.isFalse( object.exists(box.nextSibling),
                              "new element must be last in document.body");
  }

  function testIsInBox(){
    var ut = new lb.core.Sandbox('testIsInBox').isInBox;

    assert.isFalse( ut(null),                      "false expected for null");
    assert.isFalse( ut(undefined),            "false expected for undefined");
    assert.isTrue( ut( $('testIsInBox.inBox') ),
                                           "true expected for element in box");
    assert.isFalse( ut( $('testIsInBox.outsideBox') ),
                                     "false expected for element outside box");
    assert.isFalse( ut(document.body),  "false expected for ancestor element");
    assert.isFalse( ut( element('div') ),
                                     "false expected for element outside DOM");
  }

  function testSubscribe(){
    var ut = new lb.core.Sandbox('testSubscribe').subscribe;

    lb.core.events.publisher.getSubscribers().length = 0;

    var notifiedEvents = [];
    var callback = function(event){
      notifiedEvents.push(event);
    };
    var filter = {};
    ut(filter,callback);

    assert.equals(lb.core.events.publisher.getSubscribers().length, 1,
                                          "one new event Subscriber expected");
    var event1 = {};
    lb.core.events.publisher.publish(event1);
    assert.objectEquals(notifiedEvents, [event1],
                                "callback expected to be notified of event 1");
  }

  function testUnsubscribe(){
    var sandbox = new lb.core.Sandbox('testUnsubscribe');
    var ut = sandbox.unsubscribe;

    lb.core.events.publisher.getSubscribers().length = 0;

    var counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0;
    function func1(){ counter1++; }
    function func2(){ counter2++; }
    function func3(){ counter3++; }
    function func4(){ counter4++; }
    sandbox.subscribe({},func1);
    sandbox.subscribe({topic: 'abc'},func2);
    sandbox.subscribe({topic: 'abc'},func3);
    sandbox.subscribe({topic: 'abc', type: 'new'}, func4);

    assert.equals(lb.core.events.publisher.getSubscribers().length, 4,
                                  "assert: 4 subscribers expected initially");
    lb.core.events.publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,1,1,1],
                           "assert: all initial subscribers expected to run");

    ut({});
    assert.equals(lb.core.events.publisher.getSubscribers().length, 3,
                                         "3 subscribers expected: remove {}");
    lb.core.events.publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,2],
                                         "subscriber for {} must be removed");

    ut({topic:'abc'});
    assert.equals(lb.core.events.publisher.getSubscribers().length, 1,
                                "1 subscriber expected: remove {topic:'abc'}");
    lb.core.events.publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,3],
                               "subscriber for {topic:'abc'} must be removed");

    ut({topic:'abc',type:'new'});
    assert.equals(lb.core.events.publisher.getSubscribers().length, 0,
                    "0 subscriber expected: remove {topic:'abc',type:'new'}");
    lb.core.events.publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,3],
                   "subscriber for {topic:'abc',type:'new'} must be removed");
  }

  function testPublish(){
    var ut = new lb.core.Sandbox('testPublish').publish;

    lb.core.events.publisher.getSubscribers().length = 0;
    var events1 = [];
    var subscriber1 = new lb.core.events.Subscriber(
      {topic:'abc'},
      function(event){
        events1.push(event);
      }
    );
    lb.core.events.publisher.addSubscriber(subscriber1);

    var event1 = {topic:'abc',type:'new'};
    ut(event1);
    assert.objectEquals(events1,[event1],          "event1 must be published");
  }

  function testSend(){
    var ut = new lb.core.Sandbox('testSend').send;

    var url = '/events/';
    var data = {name: 'message', data: [{id:1, title:'Test'}]};
    var responses = [];
    var callback = function(response){
      responses.push(response);
    };
    ut(url, data, callback);

    assert.equals( MockXmlHttp.all.length, 1, "one instance of XHR expected");
    var xhr = MockXmlHttp.all[0];
    assert.equals( xhr._.url, url,   "same url expected in XHR call");
    assert.equals( xhr._.method, 'POST',      "POST method expected");
    assert.equals( xhr._.async, true, "  asynchronous call expected");

    // trigger asynchronous response
    xhr.complete();
    assert.objectEquals(responses, [data],      "echo of given data expected");
  }

  function testSetTimeout(){
    var ut = new lb.core.Sandbox('testSetTimeout').setTimeout;

    var originalSetTimeout = window.setTimeout;
    var funcs = [];
    var delays = [];
    window.setTimeout = function(func,delay){
      funcs.push(func);
      delays.push(delay);
    };

    var count = 0;
    function callback(){
      count++;
    }

    ut(callback, 500);
    assert.equals(funcs.length, 1,              "callback function expected");
    funcs[0]();
    assert.equals(count, 1,
        "callback expected to be wrapped in function provided to setTimeout");
    assert.arrayEquals(delays, [500],                       "delay expected");

    funcs = [];
    function failingCallback(){
      throw new Error('Test error in setTimeout');
    }
    ut(failingCallback, 0);
    assert.equals(funcs.length, 1,              "callback function expected");
    funcs[0](); // must not fail

    window.setTimeout = originalSetTimeout;
  }

  function testTrim(){
    var ut = new lb.core.Sandbox('testTrim').trim;

    assert.equals( ut('abcd'), 'abcd',
                          "no change expected when no whitespace is present");
    assert.equals( ut('a\nb c\td'), 'a\nb c\td',
                                     "internal whitespace must be preserved");
    assert.equals( ut('  \n\t  abcd  \n\t  '), 'abcd',
                                  "whitespace must be removed on both sides");
  }

  function test$(){
    var ut = new lb.core.Sandbox('test$').$;

    assert.equals( ut('testId'), document.getElementById('test$.testId'),
      "$ must return same node as document.getElementById, once prefix added");

    assert.equals( ut('outsideBox'), null,
                                      "$ must not return element outside box");
  }

  function testElement(){
    // Unit tests for lb.core.Sandbox#element()

    // test factory must be configured beforehand
    var capturedNames = [], capturedParams = [], capturedChildNodes = [];
    var testFactory = {
      create: function(name, params, childNodes){
        capturedNames.push(name);
        capturedParams.push(params);
        capturedChildNodes.push(childNodes);
      }
    };
    lb.core.application.setElementFactory(testFactory);
    assert.equals( lb.core.application.getElementFactory(), testFactory,
                            "assert: test factory expected to be configured");

    var ut = new lb.core.Sandbox('testElement').element;

    var testName = 'a';
    var testParams = {href:"#first"};
    var testChildNodes = ["first link"];
    ut(testName, testParams, testChildNodes);
    assert.arrayEquals( capturedNames, [testName],       "tag name expected");
    assert.arrayEquals( capturedParams, [testParams],      "params expected");
    assert.arrayEquals( capturedChildNodes, [testChildNodes],
                                                       "childNodes expected");
  }

  function testGetClasses(){
    var ut = new lb.core.Sandbox('testGetClasses').getClasses;

    assert.objectEquals( ut( $('testGetClasses.threeClasses') ),
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");

    assert.objectEquals( ut( $('testGetClasses.outsideBox') ), {},
                            "empty hash expected when element is out of box");
  }

  function testAddClass(){
    var ut = new lb.core.Sandbox('testAddClass').addClass;

    var div = $('testAddClass.noClass');
    ut(div, 'one');
    ut(div, 'two');
    ut(div, 'three');
    assert.equals(div.className, 'one two three',
                         "'one two three' expected in class after third add");

    div = $('testAddClass.outsideBox');
    ut(div, 'three');
    assert.equals(div.className, 'one two',
                             "no change expected when element is out of box");
  }

  function testRemoveClass(){
    var ut = new lb.core.Sandbox('testRemoveClass').removeClass;

    var div = $('testRemoveClass.threeClasses');
    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    div = $('testRemoveClass.outsideBox');
    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when element is out of box");
  }

  function testGetListeners(){
    var ut = new lb.core.Sandbox('testGetListeners').getListeners;

    assert.arrayEquals( ut(), [],          "empty array expected initially");
  }

  function testAddListener(){
    // Unit tests for lb.core.Sandbox#addListener

    var sandbox = new lb.core.Sandbox('testAddListener');
    var ut = sandbox.addListener;

    var div1 = $('testAddListener.click');
    var events1 = [];
    var callback1 = function(event){
      events1.push(event);
    };
    var listener1 = ut(div1, 'click', callback1);
    assert.isTrue( object.exists(listener1),
                             "listener object expected for div inside box");
    var listeners1 = events.getListeners(div1, 'click', false);
    assert.arrayEquals( sandbox.getListeners(), [listener1],
                                "first listener expected in getListeners()");
    assert.equals(listeners1.length, 1,
                                            "one listener expected on div1");
    var event1 = {};
    listeners1[0].handleEvent(event1);
    assert.arrayEquals(events1,[event1],
                            "callback expected to be triggered with event1");

    var listener2 = ut(div1, 'click', callback1);
    assert.arrayEquals( sandbox.getListeners(), [listener1, listener2],
                              "two listeners expected in getListeners()");

    var div2 = $('testAddListener.outsideBox');
    var events2 = [];
    var callback2 = function(event){
      events2.push(event);
    };
    assert.isFalse( object.exists( ut(div2, 'click', callback2) ),
                           "no listener object expected for div outside box");
    var listeners2 = events.getListeners(div2, 'click', false);
    assert.equals(listeners2.length, 0,
                           "no listener expected on div2 outside of the box");
  }

  function testRemoveListener(){
    // Unit tests for lb.core.Sandbox#removeListener

    var sandbox = new lb.core.Sandbox('testRemoveListener');
    var ut = sandbox.removeListener;

    // no failures expected
    ut();
    ut({});

    var div1 = $('testRemoveListener.click');
    var callback1 = function(){};
    var listener1 = sandbox.addListener(div1, 'click', callback1);
    var listener2 = sandbox.addListener(div1, 'click', callback1);
    var listener3 = sandbox.addListener(div1, 'click', callback1);

    ut(listener1);
    assert.arrayEquals( sandbox.getListeners(), [listener2,listener3],
                                    "first listener expected to be removed.");
    ut(listener1);
    assert.arrayEquals( sandbox.getListeners(), [listener2,listener3],
                     "no change expected for first listner already removed.");
    ut(listener3);
    assert.arrayEquals( sandbox.getListeners(), [listener2],
                                    "third listener expected to be removed.");
    ut(listener2);
    assert.arrayEquals( sandbox.getListeners(), [],
                                    "second listener expected to be removed.");

    assert.arrayEquals( events.getListeners(div1,'click',false), [],
               "all non-capturing listeners expected to be removed from DOM.");
  }

  function testRemoveAllListeners(){
    // Unit tests for lb.core.Sandbox#removeAllListeners

    var sandbox = new lb.core.Sandbox('testRemoveListener');
    var ut = sandbox.removeAllListeners;

    // no error expected
    ut();

    var div1 = $('testRemoveAllListeners.click');
    var callback1 = function(){};
    var listener1 = sandbox.addListener(div1, 'click', callback1);
    var listener2 = sandbox.addListener(div1, 'click', callback1);
    var listener3 = sandbox.addListener(div1, 'click', callback1);

    ut();
    assert.arrayEquals( sandbox.getListeners(), [],
                                    "all listeners expected to be removed.");

    assert.arrayEquals( events.getListeners(div1,'click',false), [],
               "all non-capturing listeners expected to be removed from DOM.");

    // no error expected
    ut();
  }

  var tests = {
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetId: testGetId,
    testGetBox: testGetBox,
    testIsInBox: testIsInBox,
    testSubscribe: testSubscribe,
    testUnsubscribe: testUnsubscribe,
    testPublish: testPublish,
    testSend: testSend,
    testSetTimeout: testSetTimeout,
    testTrim: testTrim,
    test$: test$,
    testElement: testElement,
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass,
    testGetListeners: testGetListeners,
    testaddListener: testAddListener,
    testRemoveListener: testRemoveListener,
    testRemoveAllListeners: testRemoveAllListeners
  };

  testrunner.define(tests, "lb.core.Sandbox");
  return tests;

}());
