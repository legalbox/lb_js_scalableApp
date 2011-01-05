/*
 * test.lb.core.Sandbox.js - Unit Tests of Sandbox for Modules
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-01-05
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.Sandbox.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, navigator, document, setTimeout */
(function() {
  // Builder of
  // Closure object for Test of User Interface Module

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      empty = bezen.array.empty,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.js */
      $ = bezen.$,
      /*requires bezen.string.js */
      endsWith = bezen.string.endsWith,
      /*requires bezen.dom.js */
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE,
      element = bezen.dom.element,
      /*requires goog.debug.Logger.js */
      LogManager = goog.debug.LogManager,
      /*requires goog.events.js */
      events = goog.events,
      /*requires goog.net.MockXmlHttp */
      MockXmlHttp = goog.net.MockXmlHttp,
      /*requires lb.base.config.js */
      config = lb.base.config,
      /*requires lb.base.history.js */
      history = lb.base.history,
      /*requires lb.core.events.publisher.js */
      publisher = lb.core.events.publisher,
      /*requires lb.core.events.Subscriber.js */
      Subscriber = lb.core.events.Subscriber;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','Sandbox'),
                                   "lb.core.Sandbox namespace was not found");
  }

  function testConstructor(){
    var Ut = lb.core.Sandbox;

    var sandbox = new Ut('myId');
    assert.isTrue( sandbox instanceof Ut,      "instanceof expected to work");
  }

  function setUp(){
    // Set up to restore a neutral state before each unit test

    // reset document language
    document.documentElement.removeAttribute('lang');
    // reset subscribers to notifications
    empty( publisher.getSubscribers() );
    // restore default configuration
    config.reset();
  }

  function testGetId(){
    // Unit tests for lb.core.Sandbox#getId()
    var testId = 'lb.ui.myModule';
    var sandbox = new lb.core.Sandbox(testId);
    var ut = sandbox.getId;

    setUp();
    assert.equals( ut(), testId,
                                  "id must match value given in constructor");
    assert.isFalse( object.exists( $('lb.ui.myModule') ),
                    "box element must not be created until getBox is called");

    assert.equals( ut('testId'), 'lb.ui.myModule.testId',
                    "conversion to full id must add prefix and separator");
  }

  function testGetBox(){
    // Unit tests for lb.core.Sandbox#getBox()
    var sandbox = new lb.core.Sandbox('testGetBox');
    var ut = sandbox.getBox;

    setUp();
    assert.equals( ut(), $('testGetBox'),
                               "box element 'testGetBox' should be returned");

    sandbox = new lb.core.Sandbox('missing');
    ut = sandbox.getBox;

    assert.equals( ut(false), null,
            "null expected when box element is missing and !createIfMissing");
    assert.equals( $('missing'), null,
             "missing box element must not be created when !createIfMissing");

    var box = ut();
    assert.isTrue( object.exists(box),
                                    "missing box must be created by default");
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

    setUp();
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
    var ut = new lb.core.Sandbox('testSubscribe').events.subscribe;

    setUp();

    var notifiedEvents = [];
    var callback = function(event){
      notifiedEvents.push(event);
    };
    var filter = {};
    ut(filter,callback);

    assert.equals(publisher.getSubscribers().length, 1,
                                          "one new event Subscriber expected");
    var event1 = {};
    publisher.publish(event1);
    assert.objectEquals(notifiedEvents, [event1],
                                "callback expected to be notified of event 1");
  }

  function testUnsubscribe(){
    var sandbox = new lb.core.Sandbox('testUnsubscribe');
    var ut = sandbox.events.unsubscribe;

    setUp();

    var counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0;
    function func1(){ counter1++; }
    function func2(){ counter2++; }
    function func3(){ counter3++; }
    function func4(){ counter4++; }
    sandbox.events.subscribe({},func1);
    sandbox.events.subscribe({topic: 'abc'},func2);
    sandbox.events.subscribe({topic: 'abc'},func3);
    sandbox.events.subscribe({topic: 'abc', type: 'new'}, func4);

    assert.equals(publisher.getSubscribers().length, 4,
                                  "assert: 4 subscribers expected initially");
    publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,1,1,1],
                           "assert: all initial subscribers expected to run");

    ut({});
    assert.equals(publisher.getSubscribers().length, 3,
                                         "3 subscribers expected: remove {}");
    publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,2],
                                         "subscriber for {} must be removed");

    ut({topic:'abc'});
    assert.equals(publisher.getSubscribers().length, 1,
                                "1 subscriber expected: remove {topic:'abc'}");
    publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,3],
                               "subscriber for {topic:'abc'} must be removed");

    ut({topic:'abc',type:'new'});
    assert.equals(publisher.getSubscribers().length, 0,
                    "0 subscriber expected: remove {topic:'abc',type:'new'}");
    publisher.publish({topic:'abc',type:'new'});
    assert.arrayEquals([counter1,counter2,counter3,counter4],[1,2,2,3],
                   "subscriber for {topic:'abc',type:'new'} must be removed");
  }

  function testPublish(){
    var ut = new lb.core.Sandbox('testPublish').events.publish;

    setUp();

    var events1 = [];
    var subscriber1 = new Subscriber(
      {topic:'abc'},
      function(event){
        events1.push(event);
      }
    );
    publisher.addSubscriber(subscriber1);

    var event1 = {topic:'abc',type:'new'};
    ut(event1);
    assert.objectEquals(events1,[event1],          "event1 must be published");
  }

  function testSend(){
    var ut = new lb.core.Sandbox('testSend').server.send;

    setUp();
    empty( MockXmlHttp.all );

    var url = '/events/';
    var data = {name: 'message', data: [{id:1, title:'Test'}]};
    var responses = [];
    var callback = function(response){
      responses.push(response);
    };
    ut(url, data, callback);

    assert.equals( MockXmlHttp.all.length, 1, "one instance of XHR expected");
    var xhr = MockXmlHttp.all[0];
    assert.equals( xhr.lb.url, url,   "same url expected in XHR call");
    assert.equals( xhr.lb.method, 'POST',      "POST method expected");
    assert.equals( xhr.lb.async, true, "  asynchronous call expected");

    // trigger asynchronous response
    xhr.complete();
    assert.objectEquals(responses, [data],      "echo of given data expected");
  }

  function testGetTimestamp(){
    var ut = new lb.core.Sandbox('testGetTimestamp').utils.getTimestamp;

    setUp();
    var before = (new Date()).getTime();
    var timestamp = ut();
    var after = (new Date()).getTime();

    assert.equals( typeof timestamp, 'number',  "timestamp must be a number");
    assert.isTrue( before <= timestamp && timestamp <= after,
                            "timestamp must fall in [before;after] interval");
  }

  function testSetTimeout(){
    var ut = new lb.core.Sandbox('testSetTimeout').utils.setTimeout;

    setUp();
    var originalSetTimeout = window.setTimeout;
    var funcs = [];
    var delays = [];
    var testTimeoutId = 42;
    window.setTimeout = function(func,delay){
      funcs.push(func);
      delays.push(delay);
      return testTimeoutId;
    };

    var count = 0;
    function callback(){
      count++;
    }

    assert.equals( ut(callback, 500), testTimeoutId,
                                        "timeoutId expected to be returned");
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

  function testClearTimeout(){
    var ut = new lb.core.Sandbox('testClearTimeout').utils.clearTimeout;

    setUp();
    var originalClearTimeout = window.clearTimeout;
    var captured = [];
    window.clearTimeout = function(timeoutId){
      captured.push(timeoutId);
    };

    ut(42);
    ut(123);
    ut(null);
    ut(undefined);

    assert.arrayEquals( captured, [42,123,null,undefined],
                                          "4 calls to clearTimeout expected");

    window.clearTimeout = originalClearTimeout;
  }

  function testTrim(){
    var ut = new lb.core.Sandbox('testTrim').utils.trim;

    setUp();
    assert.equals( ut('abcd'), 'abcd',
                          "no change expected when no whitespace is present");
    assert.equals( ut('a\nb c\td'), 'a\nb c\td',
                                     "internal whitespace must be preserved");
    assert.equals( ut('  \n\t  abcd  \n\t  '), 'abcd',
                                  "whitespace must be removed on both sides");
  }

  function testLog(){
    var ut = new lb.core.Sandbox('testLog').utils.log;

    setUp();
    var logRecords = [];
    var logHandler = function(logRecord){
      logRecords.push(logRecord);
    };

    var rootLogger = LogManager.getRoot();
    rootLogger.addHandler(logHandler);

    var testMessage = 'Test message for sandbox.log';
    ut(testMessage);

    assert.equals(logRecords.length, 1,             "1 log record expected");
    assert.equals(logRecords[0].getMessage(), testMessage, 
                                      "test message expected in log record");
  }

  function testConfirm(){
    var ut = new lb.core.Sandbox('testConfirm').utils.confirm;

    setUp();
    var originalWindowConfirm = window.confirm;
    var capturedByConfirm = [];
    var confirmResult = false;
    window.confirm = function(text){
      capturedByConfirm.push(text);
      return confirmResult;
    };

    var testMessage = "Test Confirmation Message";
    assert.isFalse( ut(testMessage),              "negative result expected");
    assert.arrayEquals(capturedByConfirm, [testMessage],
                                         "text argument expected (1st call)");

    capturedByConfirm = [];
    confirmResult = true;
    assert.isTrue( ut(testMessage),               "positive result expected");
    assert.arrayEquals(capturedByConfirm, [testMessage],
                                         "text argument expected (2nd call)");

    window.confirm = originalWindowConfirm;
  }

  function test$(){
    var ut = new lb.core.Sandbox('test$').dom.$;

    setUp();
    assert.equals( ut('testId'), document.getElementById('test$.testId'),
      "$ must return same node as document.getElementById, once prefix added");

    assert.equals( ut('outsideBox'), null,
                                      "$ must not return element outside box");
  }

  function testElement(){
    // Unit tests for lb.core.Sandbox#dom.element()
    // test factory must be configured beforehand
    var capturedNames = [],
        capturedParams = [],
        capturedChildNodes = [];
    var testFactory = {
      createElement: function(name, params, childNodes){
        capturedNames.push(name);
        capturedParams.push(params);
        capturedChildNodes.push(childNodes);
      }
    };
    config.setOptions({lbFactory:testFactory});
    assert.equals( config.getOption('lbFactory'), testFactory,
                            "assert: test factory expected to be configured");
    var ut = new lb.core.Sandbox('testElement').dom.element;

    setUp();
    var testName = 'a';
    var testParams = {href:"#first"};
    var testChildNodes = ["first link"];
    ut(testName, testParams, testChildNodes);
    assert.arrayEquals( capturedNames, [testName],       "tag name expected");
    assert.arrayEquals( capturedParams, [testParams],      "params expected");
    assert.arrayEquals( capturedChildNodes, [testChildNodes],
                                                       "childNodes expected");

    // restore default configuration
    config.reset();
  }

  function testGetClasses(){
    var ut = new lb.core.Sandbox('testGetClasses').css.getClasses;

    setUp();
    assert.objectEquals( ut( $('testGetClasses.threeClasses') ),
                         {'one':true, 'two':true, 'three':true},
                                            "three classes expected in hash");

    assert.objectEquals( ut( $('testGetClasses.outsideBox') ), {},
                            "empty hash expected when element is out of box");
  }

  function testAddClass(){
    var ut = new lb.core.Sandbox('testAddClass').css.addClass;

    setUp();
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
    var ut = new lb.core.Sandbox('testRemoveClass').css.removeClass;

    setUp();
    var div = $('testRemoveClass.threeClasses');
    ut(div, 'two');
    assert.equals(div.className, 'one three',
                                        "class 'two' expected to be removed");

    div = $('testRemoveClass.outsideBox');
    ut(div, 'two');
    assert.equals(div.className, 'one two three',
                             "no change expected when element is out of box");
  }

  function testFireEvent(){
    // Unit tests for lb.core.Sandbox#dom.fireEvent
    // Test factory must be configured beforehand
    var capturedElements = [],
        capturedTypes = [],
        capturedProperties = [],
        capturedUseCapture = [];
    var testFactory = {
      createEvent: function(element, type, properties, useCapture){
        capturedElements.push(element);
        capturedTypes.push(type);
        capturedProperties.push(properties);
        capturedUseCapture.push(useCapture);
      }
    };
    config.setOptions({lbFactory:testFactory});
    var ut = new lb.core.Sandbox('testFireEvent').dom.fireEvent;

    setUp();
    var testElement = element('div');
    var testProperties = {
      screenX: 300, screenY: 450,
      clientX: 200, clientY: 150
    };
    ut(testElement, 'click', testProperties);

    assert.arrayEquals(capturedElements, [testElement],
                                                      "test element expected");
    assert.arrayEquals(capturedTypes, ['click'],              "type expected");
    assert.arrayEquals(capturedProperties, [testProperties],
                                                  "test properties expected");
    assert.arrayEquals(capturedUseCapture, [undefined],
                                               "useCapture expected omitted");
  }

  function testCancelEvent(){
    // Unit tests for lb.core.Sandbox#dom.cancelEvent
    // Test factory must be configured beforehand
    var capturedEvents = [];
    var testFactory = {
      destroyEvent: function(event){
        capturedEvents.push(event);
      }
    };
    config.setOptions({lbFactory:testFactory});
    var ut = new lb.core.Sandbox('testCancelEvent').dom.cancelEvent;

    setUp();
    var testEvent = {type: 'click'};
    ut(testEvent);
    assert.arrayEquals(capturedEvents, [testEvent],
                                       "test event expected on test factory");
  }

  function testGetListeners(){
    var ut = new lb.core.Sandbox('testGetListeners').dom.getListeners;

    setUp();
    assert.arrayEquals( ut(), [],          "empty array expected initially");
  }

  function testAddListener(){
    // Unit tests for lb.core.Sandbox#dom.addListener
    // Test factory must be configured beforehand
    var createdListeners = [];
    var testFactory = {
      createListener: function(element, type, callback, useCapture){
        var testListener = {
          element: element,
          type: type,
          callback: callback,
          useCapture: useCapture
        };
        createdListeners.push(testListener);
        return testListener;
      }
    };
    config.setOptions({lbFactory:testFactory});
    var sandbox = new lb.core.Sandbox('testAddListener');
    var ut = sandbox.dom.addListener;

    setUp();
    var callback = function(event){
    };

    var div0 = $('testAddListener.outsideBox');
    assert.isFalse( object.exists( ut(div0, 'click', callback) ),
                           "no listener object expected for div outside box");
    assert.arrayEquals( sandbox.dom.getListeners(), [],
                            "no listener expected to be added (not created)");

    var div1 = $('testAddListener.click');
    var listener1 = ut(div1, 'click', callback);
    assert.objectEquals(listener1,
           {
              element: div1,
              type: 'click',
              callback: callback,
              useCapture: undefined
           },
                  "test listener expected to be returned for div inside box");
    assert.arrayEquals( sandbox.dom.getListeners(), [listener1],
                "created listener expected to be added to sandbox listeners");

    var listener2 = ut(div1, 'click', callback);
    assert.arrayEquals( sandbox.dom.getListeners(), [listener1, listener2],
                              "two listeners expected in getListeners()");
  }

  function testRemoveListener(){
    // Unit tests for lb.core.Sandbox#dom.removeListener
    // Test factory must be configured beforehand
    var destroyedListeners = [];
    var testFactory = {
      createListener: function(element, type, callback, useCapture){
        var testListener = {
          element: element,
          type: type,
          callback: callback,
          useCapture: useCapture
        };
        return testListener;
      },
      destroyListener: function(listener){
        destroyedListeners.push(listener);
      }
    };
    config.setOptions({lbFactory:testFactory});
    var sandbox = new lb.core.Sandbox('testRemoveListener');
    var ut = sandbox.dom.removeListener;

    setUp();

    // no failures expected
    ut();
    ut({});
    assert.arrayEquals(destroyedListeners, [],
                      "missing and unknown listener expected to be ignored");

    var div1 = $('testRemoveListener.click');
    var callback1 = function(){};
    var listener1 = sandbox.dom.addListener(div1, 'click', callback1);
    var listener2 = sandbox.dom.addListener(div1, 'click', callback1);
    var listener3 = sandbox.dom.addListener(div1, 'click', callback1);

    ut(listener1);
    assert.arrayEquals(destroyedListeners, [listener1],
                                   "first listener expected to be destroyed");
    assert.arrayEquals( sandbox.dom.getListeners(), [listener2,listener3],
                                         "two listeners expected to remain.");

    ut(listener1);
    assert.arrayEquals(destroyedListeners, [listener1],
                              "listener1 not expected to be destroyed twice");
    assert.arrayEquals( sandbox.dom.getListeners(), [listener2,listener3],
                     "no change expected for first listner already removed.");

    ut(listener3);
    assert.arrayEquals(destroyedListeners, [listener1, listener3],
                                        "listener3 expected to be destroyed");
    assert.arrayEquals( sandbox.dom.getListeners(), [listener2],
                                         "one listener expected to remain.");
    ut(listener2);
    assert.arrayEquals(destroyedListeners, [listener1, listener3, listener2],
                                        "listener2 expected to be destroyed");
    assert.arrayEquals( sandbox.dom.getListeners(), [],
                                           "no remaining listener expected.");
  }

  function testRemoveAllListeners(){
    // Unit tests for lb.core.Sandbox#dom.removeAllListeners
    // Test factory must be configured beforehand
    var destroyedListeners = [];
    var testFactory = {
      createListener: function(element, type, callback, useCapture){
        var testListener = {
          element: element,
          type: type,
          callback: callback,
          useCapture: useCapture
        };
        return testListener;
      },
      destroyListener: function(listener){
        destroyedListeners.push(listener);
      }
    };
    config.setOptions({lbFactory:testFactory});
    var sandbox = new lb.core.Sandbox('testRemoveAllListeners');
    var ut = sandbox.dom.removeAllListeners;

    setUp();

    // no error expected
    ut();

    var div1 = $('testRemoveAllListeners.click');
    var callback1 = function(){};
    var listener1 = sandbox.dom.addListener(div1, 'click', callback1);
    var listener2 = sandbox.dom.addListener(div1, 'click', callback1);
    var listener3 = sandbox.dom.addListener(div1, 'click', callback1);

    ut();
    assert.arrayEquals( destroyedListeners, [listener1, listener2, listener3],
                                    "all listeners expected to be destroyed");
    assert.arrayEquals( sandbox.dom.getListeners(), [],
                                    "all listeners expected to be removed.");

    // no error expected
    ut();
  }

  function testGetLanguageList(){
    var ut = new lb.core.Sandbox('testGetLanguageList').i18n.getLanguageList;

    setUp();
    assert.arrayEquals( ut(), [],   "language list expected empty initially");
  }

  function testGetSelectedLanguage(){
    var sandbox = new lb.core.Sandbox('testGetSelectedLanguage');
    var ut = sandbox.i18n.getSelectedLanguage;

    setUp();
    assert.equals( ut(), navigator.language || navigator.browserLanguage,
                  "selected language expected to default to browser language");

    var testLanguageCode = 'TESTlanguageCODE';
    document.documentElement.lang = testLanguageCode;
    assert.equals( ut(), testLanguageCode,
     "value of 'lang' attribute of root HTML element expected to be returned");
  }

  function testSelectLanguage(){
    var ut = new lb.core.Sandbox('testSelectLanguage').i18n.selectLanguage;

    setUp();
    var testLanguageCode = 'TestLANGUAGEcode';
    ut(testLanguageCode);
    assert.equals( document.documentElement.lang, testLanguageCode,
                  "selected language expected to be set to 'lang' attribute "+
                                                      "of root HTML element");
  }

  function testAddLanguageProperties(){
    var sandbox = new lb.core.Sandbox('testAddLanguageProperties');
    var ut = sandbox.i18n.addLanguageProperties;

    setUp();
    ut();
    ut(undefined);
    ut(null,{});
    ut({},{});
    assert.arrayEquals( sandbox.i18n.getLanguageList(), [],
       "null, undefined and non-string language code expected to be ignored");

    var firstLanguageCode = 'TEST-language-CODE-01';
    sandbox.i18n.selectLanguage(firstLanguageCode);
    var aValue = function(){},
        cValue = 'C Value';
    ut(firstLanguageCode,{
      a: aValue,
      b: {
        c: cValue
      }
    });
    assert.arrayEquals( sandbox.i18n.getLanguageList(), [firstLanguageCode],
                    "first language code expected to be added to the list");
    assert.equals( sandbox.i18n.get('a',firstLanguageCode), aValue,
                                            "'a' expected in first language");
    assert.equals( sandbox.i18n.get('b.c',firstLanguageCode), cValue,
                                          "'b.c' expected in first language");

    var secondLanguageCode = '';
    sandbox.i18n.selectLanguage(secondLanguageCode);
    var dValue = {};
    ut(secondLanguageCode,{
      d: dValue
    });
    assert.arrayEquals( sandbox.i18n.getLanguageList(),
                        [secondLanguageCode, firstLanguageCode],
                  "second language code expected to be added, in sort order");
    assert.equals( sandbox.i18n.get('d',secondLanguageCode),dValue,
                                           "'d' expected in second language");
  }

  function testGet(){
    var sandbox = new lb.core.Sandbox('testGet');
    var ut = sandbox.i18n.get;

    setUp();
    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);
    assert.equals( ut(), null,             "null expected for missing key");

    var testSandbox = new lb.core.Sandbox('testGet.testSandbox');
    var dValue = function(){
          return 'D VALUE';
        },
        cValue = {
          d: dValue
        },
        bValue = {
          c: cValue
        },
        aValue = 'A VALUE';
    testSandbox.i18n.addLanguageProperties(testLanguageCode,{
      a: aValue,
      b: bValue
    });

    assert.equals( ut(), null,                "null expected for missing key");
    assert.equals( ut('a'), aValue,     "a value expected (default language)");
    assert.equals( ut('b'), bValue,     "b value expected (default language)");
    assert.equals( ut('b.c'), cValue,   "c value expected (default language)");
    assert.equals( ut('b.c.d'), dValue, "d value expected (default language)");

    sandbox.i18n.selectLanguage('OTHER-LANGUAGE-CODE');
    assert.equals( ut('a',testLanguageCode), aValue,
                                      "a value expected (explicit language)");
    assert.equals( ut('b',testLanguageCode), bValue,
                                      "b value expected (explicit language)");
    assert.equals( ut('b.c',testLanguageCode), cValue,
                                      "c value expected (explicit language)");
    assert.equals( ut('b.c.d',testLanguageCode), dValue,
                                      "d value expected (explicit language)");

    assert.equals( ut(['a'],testLanguageCode), aValue,
                      "a value expected (array notation, explicit language)");
    assert.equals( ut(['b'],testLanguageCode), bValue,
                      "b value expected (array notation, explicit language)");
    assert.equals( ut(['b','c'],testLanguageCode), cValue,
                      "c value expected (array notation, explicit language)");
    assert.equals( ut(['b','c','d'],testLanguageCode), dValue,
                      "d value expected (array notation, explicit language)");
  }

  function testGetString(){
    var sandbox = new lb.core.Sandbox('testGetString');
    var ut = sandbox.i18n.getString;

    setUp();
    assert.equals( ut(), null,              "null expected for missing key");
    assert.equals( ut('missing'), null,   "null expected for key 'missing'");

    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);

    var testSandbox = new lb.core.Sandbox('testGetString.testSandbox');
    var noParamValue = 'No Param Value',
        simpleParamValue = '#simple#',
        dottedParamValue = '#dotted.param#',
        complexParamValue = 'Complex #param-to-replace#, #missing#';
    testSandbox.i18n.addLanguageProperties(testLanguageCode,{
      noParam: noParamValue,
      simpleParam: simpleParamValue,
      dottedParam: dottedParamValue,
      complexParam: complexParamValue
    });

    assert.equals( ut('noParam'), noParamValue,
                          "value without param expected AS IS (no language)");
    assert.equals( ut('simpleParam',{simple:'replacement'}), 'replacement',
                           "simple value replacement expected (no language)");
    assert.equals( ut('dottedParam',
                   {
                     dotted:{
                       param:'replacement'
                     }
                   }), 'replacement',
                           "dotted value replacement expected (no language)");
    assert.equals( ut('complexParam',{'param-to-replace':'value'}),
                   'Complex value, #missing#',
                 "one of two params expected in complex value (no language)");

    sandbox.i18n.selectLanguage('OTHER-LANGUAGE-CODE');

    assert.equals( ut('noParam',null,testLanguageCode), noParamValue,
                    "value without param expected AS IS (explicit language)");
    assert.equals( ut('simpleParam',{simple:'replacement'},testLanguageCode),
                   'replacement',
                     "simple value replacement expected (explicit language)");
    assert.equals( ut('dottedParam',
                   {
                     dotted:{
                       param:'replacement'
                     }
                   }, testLanguageCode), 'replacement',
                    "dotted value replacement expected (explicit language)");
    assert.equals( ut('complexParam',
                      {'param-to-replace':'value'},
                      testLanguageCode),
                   'Complex value, #missing#',
           "one of two params expected in complex value (explicit language)");
  }

  function testFilterHtml(){
    var sandbox = new lb.core.Sandbox('testFilterHtml');
    var ut = sandbox.i18n.filterHtml;

    setUp();
    try {
      ut();
      ut(null);
    } catch(e) {
      assert.fail("null/undefined node expected to be ignored: "+e);
    }

    var testLanguageCode = 'te-ST';
    sandbox.i18n.selectLanguage(testLanguageCode);

    var noParamValue = 'No param replacement',
        noParamNode = element('div',{},noParamValue),
        simpleNodeValue = '#param#',
        simpleNode = element('div',{},simpleNodeValue),
        dottedNodeValue = '#dotted.param#',
        dottedNode = element('div',{},dottedNodeValue),
        complexNode = element('div',{},
          'Complex ',
          element('span',{id:'#attributeParam#'},'#text-to-replace#'),
          ' #missing#'
        );

    ut(noParamNode);
    assert.equals( noParamNode.innerHTML, noParamValue,
               "value without param expected to be left AS IS (no language)");
    ut(simpleNode,{param:'value'});
    assert.equals( simpleNode.innerHTML, 'value',
                           "simple value replacement expected (no language)");
    ut(dottedNode,{dotted:{param:'value'}});
    assert.equals( dottedNode.innerHTML, 'value',
                           "dotted replacement value expected (no language)");
    ut(complexNode,{
      attributeParam: 'attribute value',
      'text-to-replace':'text value'
    });
    assert.arrayEquals(
      [
        complexNode.nodeName,
        complexNode.childNodes.length,
          complexNode.childNodes[0].nodeValue,
          complexNode.childNodes[1].nodeName,
          complexNode.childNodes[1].getAttribute('id'),
          complexNode.childNodes[1].innerHTML,
          complexNode.childNodes[2].nodeValue
      ],
      [
        'DIV',
        3,
          'Complex ',
          'SPAN',
            'attribute value',
            'text value',
          ' #missing#'
      ],          "two replacements expected in complex value (no language)");

    sandbox.i18n.selectLanguage('OTHER-LANGUAGE-CODE');

    noParamNode = element('div',{},noParamValue);
    simpleNode = element('div',{},simpleNodeValue);
    dottedNode = element('div',{},dottedNodeValue);
    complexNode = element('div',{},
      'Complex ',
      element('span',{id:'#attributeParam#'},'#text-to-replace#'),
      ' #missing#'
    );

    ut(noParamNode,testLanguageCode);
    assert.equals( noParamNode.innerHTML, noParamValue,
         "value without param expected to be left AS IS (explicit language)");
    ut(simpleNode,{param:'value'},testLanguageCode);
    assert.equals( simpleNode.innerHTML, 'value',
                     "simple value replacement expected (explicit language)");
    ut(dottedNode,{dotted:{param:'value'}},testLanguageCode);
    assert.equals( dottedNode.innerHTML, 'value',
                    "dotted replacement value expected (explicit language)");
    ut(complexNode,{
      attributeParam: 'attribute value',
      'text-to-replace':'text value'
    },testLanguageCode);
    assert.arrayEquals(
      [
        complexNode.nodeName,
        complexNode.childNodes.length,
          complexNode.childNodes[0].nodeValue,
          complexNode.childNodes[1].nodeName,
          complexNode.childNodes[1].getAttribute('id'),
          complexNode.childNodes[1].innerHTML,
          complexNode.childNodes[2].nodeValue
      ],
      [
        'DIV',
        3,
          'Complex ',
          'SPAN',
            'attribute value',
            'text value',
          ' #missing#'
      ],    "two replacements expected in complex value (explicit language)");

    var listNode = element('ul',{},
      element('li',{},'No Language'),
      element('li',{lang:''},'Root'),
      element('li',{lang:'de'},'German'),
      element('li',{lang:'de-AT'},'German/Austria'),
      element('li',{lang:'de-DE'},'German/Germany'),
      element('li',{lang:'en'},'English'),
      element('li',{lang:'en-GB'},'English/United Kingdom'),
      element('li',{lang:'en-US'},'English/USA'),
      element('li',{lang:'fr'},'French'),
      element('li',{lang:'fr-CA'},'French/Canada'),
      element('li',{lang:'fr-FR'},'French/France')
    );
    assert.equals( listNode.childNodes.length, 11,
                                 "assert: 11 child nodes expected initially");
    ut(listNode,{},'en-GB');
    assert.equals( listNode.childNodes.length, 4,
                                          "4 child nodes expected to remain");
    assert.arrayEquals(
      [
        listNode.childNodes[0].nodeName,
        listNode.childNodes[0].getAttribute('lang'),
        listNode.childNodes[0].innerHTML,

        listNode.childNodes[1].nodeName,
        listNode.childNodes[1].getAttribute('lang'),
        listNode.childNodes[1].innerHTML,

        listNode.childNodes[2].nodeName,
        listNode.childNodes[2].getAttribute('lang'),
        listNode.childNodes[2].innerHTML,

        listNode.childNodes[3].nodeName,
        listNode.childNodes[3].getAttribute('lang'),
        listNode.childNodes[3].innerHTML
      ],
      [
        'LI', '',      'No Language',
        'LI', '',      'Root',
        'LI', 'en',    'English',
        'LI', 'en-GB', 'English/United Kingdom'
      ],             "only child nodes with no lang, lang '', 'en', 'en-GB' "+
                                   "expected to remain for language 'en-GB'");

    var frenchAncestorWithChild = element('div',{lang:'fr'},
      element('div')
    );
    var child = frenchAncestorWithChild.firstChild;
    ut(child,{},'fr');
    assert.equals( frenchAncestorWithChild.firstChild, child,
        "child with inherited French language expected to be preserved (fr)");

    ut(child,{},'en');
    assert.equals( frenchAncestorWithChild.firstChild, null,
          "child with inherited French language expected to be removed (en)");

    var frenchAncestorWithEnglishChild = element('div',{lang:'fr'},
      element('div',{lang:'en'})
    );
    child = frenchAncestorWithEnglishChild.firstChild;
    ut(child,{},'en');
    assert.equals( frenchAncestorWithEnglishChild.firstChild, child,
           "English child with French ancestor expected to be preserved (en)");
    ut(child,{},'fr');
    assert.equals( frenchAncestorWithEnglishChild.firstChild, null,
             "English child with French ancestor expected to be removed (fr)");
  }

  function testGetLocation(){
    var ut = new lb.core.Sandbox('testGetLocation').url.getLocation;

    setUp();
    var location = ut();
    assert.isTrue( object.exists(location),      "location object expected");
    assert.equals( location.href, window.location.href,
                                      "href should be the same as for window");
    assert.equals( location.protocol, window.location.protocol,
                                  "protocol should be the same as for window");
    assert.equals( location.host, window.location.host,
                                      "host should be the same as for window");
    assert.equals( location.hostname, window.location.hostname,
                                  "hostname should be the same as for window");
    assert.equals( location.port, window.location.port,
                                      "port should be the same as for window");
    assert.equals( location.pathname, window.location.pathname,
                                  "pathname should be the same as for window");
    assert.equals( location.search, window.location.search,
                                    "search should be the same as for window");
    assert.equals( location.hash, window.location.hash,
                                      "hash should be the same as for window");

    // try modifying values - must not modify window.location
    location.href = 'test://test.example.com:80123/test/path/?query=test#test';
    location.protocol = 'test://';
    location.host = 'test.example.com:80123';
    location.hostname = 'test.example.com';
    location.port = '80123';
    location.pathname = '/test/path/';
    location.search = '?query=test';
    location.hash = '#test';
    assert.isFalse( location.href === window.location.href,
                                    "href must not be the same as for window");
    assert.isFalse( location.protocol === window.location.protocol,
                                "protocol must not be the same as for window");
    assert.isFalse( location.host === window.location.host,
                                   "host must not  be the same as for window");
    assert.isFalse( location.hostname === window.location.hostname,
                                "hostname must not be the same as for window");
    assert.isFalse( location.port === window.location.port,
                                   "port must not be the same as for window");
    assert.isFalse( location.pathname === window.location.pathname,
                               "pathname must not be the same as for window");
    assert.isFalse( location.search === window.location.search,
                                 "search must not be the same as for window");
    assert.isFalse( location.hash === window.location.hash,
                                   "hash must not be the same as for window");
  }

  function testSetHash(){
    var ut = new lb.core.Sandbox('testSetHash').url.setHash;

    setUp();
    ut('simple');
    assert.equals(window.location.hash, '#simple',
                                             "simple hash expected to be set");

    ut('new hash');
    assert.equals(history.getHash(), '#new hash',
                                               "new hash expected to be set");
    ut('');
  }

  function testOnHashChange(test){
    var ut = new lb.core.Sandbox('testOnHashChange').url.onHashChange;

    setUp();
    history.setHash('start');
    var hashOne = [];
    function captureHashOne(hash){
      hashOne.push(hash);
    }
    var hashTwo = [];
    function captureHashTwo(hash){
      hashTwo.push(hash);
    }

    test.startAsyncTest();
    setTimeout(function(){
      // in IE, hash change is detected after a polling,
      // 'start' could be seen as a new hash because of the polling interval,
      // even if the listener is actually added just after the setHash('start')
      ut(captureHashOne);
      history.setHash('one');
      setTimeout(function(){
        assert.arrayEquals(hashOne,['#one'],
                "first hash change expected to be captured by first listener");
        ut(captureHashTwo); // replace listener
        history.setHash('two');
        setTimeout(function(){
          assert.arrayEquals(hashOne,['#one'],
                          "first listener must be removed when second is set");
          assert.arrayEquals(hashTwo,['#two'],
              "second hash change expected to be captured by second listener");
          ut(null); // remove listener
          history.setHash('three');
          setTimeout(function(){
            assert.arrayEquals(hashOne,['#one'],
              "no more hash change expected to be captured by first listener");
            assert.arrayEquals(hashTwo,['#two'],
                 "third hash change must be removed by setting null listener");
            test.endAsyncTest();
            history.setHash('');
          },200);
        },200);
      },200);
    },200);
  }

  testrunner.define({
    testNamespace: testNamespace,
    testConstructor: testConstructor,
    testGetId: testGetId,
    testGetBox: testGetBox,
    testIsInBox: testIsInBox
  },"lb.core.Sandbox");

  testrunner.define({
    testGetClasses: testGetClasses,
    testAddClass: testAddClass,
    testRemoveClass: testRemoveClass
  },"lb.core.Sandbox.css");

  testrunner.define({
    test$: test$,
    testElement: testElement,
    testFireEvent: testFireEvent,
    testCancelEvent: testCancelEvent,
    testGetListeners: testGetListeners,
    testAddListener: testAddListener,
    testRemoveListener: testRemoveListener,
    testRemoveAllListeners: testRemoveAllListeners
  },"lb.core.Sandbox.dom");

  testrunner.define({
    testSubscribe: testSubscribe,
    testUnsubscribe: testUnsubscribe,
    testPublish: testPublish
  },"lb.core.Sandbox.events");

  testrunner.define({
    testGetLanguageList: testGetLanguageList,
    testGetSelectedLanguage: testGetSelectedLanguage,
    testSelectLanguage: testSelectLanguage,
    testAddLanguageProperties: testAddLanguageProperties,
    testGet: testGet,
    testGetString: testGetString,
    testFilterHtml: testFilterHtml
  },"lb.core.Sandbox.i18n");

  testrunner.define({
    testSend: testSend
  },"lb.core.Sandbox.server");

  testrunner.define({
    testGetLocation: testGetLocation,
    testSetHash: testSetHash,
    testOnHashChange: testOnHashChange
  },"lb.core.Sandbox.url");

  testrunner.define({
    testGetTimestamp: testGetTimestamp,
    testSetTimeout: testSetTimeout,
    testClearTimeout: testClearTimeout,
    testTrim: testTrim,
    testLog: testLog,
    testConfirm: testConfirm
  },"lb.core.Sandbox.utils");

}());
