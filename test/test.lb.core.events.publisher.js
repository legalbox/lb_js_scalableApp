/*
 * test.lb.core.events.publisher.js - Unit Tests of Events Publisher
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-06-18
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.events.publisher.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.events.publisher

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      empty = bezen.array.empty,
      /*requires bezen.string.js */
      startsWith = bezen.string.startsWith,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','events','publisher'),
                                    "lb.core.events.publisher was not found");
  }

  function testGetSubscribers(){
    var ut = lb.core.events.publisher.getSubscribers;

    var subscribers = ut();
    assert.isTrue( object.exists(subscribers),
                                          "subscribers must exist initially");
    empty(subscribers);
    assert.arrayEquals( ut(), [],      "empty array of subscribers expected");
  }

  function testAddSubscriber(){
    var ut = lb.core.events.publisher.addSubscriber;

    var subscribers = lb.core.events.publisher.getSubscribers();
    empty(subscribers);

    var subscriber1 = {}, subscriber2 = {}, subscriber3 = {};
    ut(subscriber1);
    assert.arrayEquals(subscribers, [subscriber1],
                                                "First subscriber expected");

    ut(subscriber2);
    ut(subscriber3);

    assert.arrayEquals(subscribers, [subscriber1,subscriber2,subscriber3],
                                                    "3 subscribers expected");

    ut(subscriber1);
    ut(subscriber2);
    ut(subscriber3);
    assert.arrayEquals(subscribers, [subscriber1,subscriber2,subscriber3],
                                                    "no duplicate expected");
  }

  function testRemoveSubscriber(){
    var ut = lb.core.events.publisher.removeSubscriber;

    var subscribers = lb.core.events.publisher.getSubscribers();
    empty(subscribers);
    var subscriber1 = {}, subscriber2 = {}, subscriber3 = {};
    lb.core.events.publisher.addSubscriber(subscriber1);
    lb.core.events.publisher.addSubscriber(subscriber2);

    ut(subscriber3);
    assert.arrayEquals(subscribers, [subscriber1,subscriber2],
                         "No change expected when subscriber is not present");

    ut(subscriber2);
    assert.arrayEquals(subscribers, [subscriber1],
                                  "Second subscriber expected to be removed");

    ut(subscriber1);
    assert.arrayEquals(subscribers, [],
                                  "First subscriber expected to be removed");
    ut(subscriber1);
    assert.arrayEquals(subscribers, [],
                                    "No change expected when array is empty");
  }

  function testPublish(){
    var ut = lb.core.events.publisher.publish;

    empty( lb.core.events.publisher.getSubscribers() );

    var event0 = {};
    ut(event0);

    var events1 = [];
    var module1 = {
      notify: function(event){ events1.push(event); }
    };

    var events2 = [];
    var module2 = {
      notify: function(event){
        events2.push(event);
        throw new Error('Test failure in module 2');
      }
    };

    var events3 = [];
    var module3 = {
      notify: function(event){ events3.push(event); }
    };

    lb.core.events.publisher.addSubscriber(module1);
    lb.core.events.publisher.addSubscriber(module2);

    var event1 = {};
    ut(event1);
    assert.arrayEquals(events1, [event1],
                                  "first module must get notified of event1");
    assert.arrayEquals(events2, [event1],
                                  "second module must get notified of event1");

    lb.core.events.publisher.addSubscriber(module3);
    var event2 = {};
    ut(event2);
    assert.arrayEquals(events1, [event1,event2],
                        "first module must get notified of event2 only once");
    assert.arrayEquals(events2, [event1,event2],
                        "second module must get notified of event2");
    assert.arrayEquals(events3, [event2],
                                  "third module must get notified of event2");

    lb.core.events.publisher.removeSubscriber(module1);
    var event3 = {};
    ut(event3);
    assert.arrayEquals(events1, [event1,event2],
                              "first module must not get notified of event3");
    assert.arrayEquals(events2, [event1,event2,event3],
                              "second module must get notified of event3");
    assert.arrayEquals(events3, [event2,event3],
                                  "third module must get notified of event3");

    empty( lb.core.events.publisher.getSubscribers() );
    var events4 = [];
    function notify4(event){
      lb.core.events.publisher.addSubscriber({notify:notify4});
      events4.push(event);
    }
    var module4 = {
      notify: notify4
    };

    var events5 = [];
    var module5 = {
      notify: function(event){
        lb.core.events.publisher.removeSubscriber(module5);
        events5.push(event);
      }
    };

    lb.core.events.publisher.addSubscriber( module4 );
    lb.core.events.publisher.addSubscriber( module5 );

    var event4 = {};
    ut(event4);
    assert.arrayEquals(events4,[event4],
                "recursive subscriber must get notified of event4 only once");
    assert.arrayEquals(events4,[event4],
                        "destructive subscriber must get notified of event4");

    var event5 = {};
    ut(event5);
    assert.arrayEquals(events4,[event4,event5,event5],
                "recursive subscriber must get notified of event5 only twice");
    assert.arrayEquals(events5,[event4],
                     "destructive subscriber must not get notified of event5");
  }

  var tests = {
    testNamespace: testNamespace,
    testGetSubscribers: testGetSubscribers,
    testAddSubscriber: testAddSubscriber,
    testRemoveSubscriber: testRemoveSubscriber,
    testPublish: testPublish
  };

  testrunner.define(tests, "lb.core.events.publisher");
  return tests;

}());
