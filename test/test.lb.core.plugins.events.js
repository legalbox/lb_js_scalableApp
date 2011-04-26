/*
 * test.lb.core.plugins.events.js - Unit Tests of Events Core Plugin
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-04-26
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.plugins.events.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.core.plugins.events

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      empty = bezen.array.empty,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.core.events.publisher.js */
      publisher = lb.core.events.publisher,
      /*requires lb.core.events.Subscriber.js */
      Subscriber = lb.core.events.Subscriber,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','plugins','events'),
                            "lb.core.plugins.events namespace was not found");
  }

  function testPlugin(){
    var ut = lb.core.plugins.events;

    var sandbox = new Sandbox('testPlugin');
    ut(sandbox);

    // Events for loose coupling with other modules (sandbox.events)
    assert.isTrue( object.exists(sandbox,'events','subscribe'),
                           "sandbox.events.subscribe expected to be defined");
    assert.isTrue( object.exists(sandbox,'events','unsubscribe'),
                         "sandbox.events.unsubscribe expected to be defined");
    assert.isTrue( object.exists(sandbox,'events','publish'),
                             "sandbox.events.publish expected to be defined");
  }

  function setUp(){
    // Set up to restore a neutral state before each unit test

    // reset subscribers to notifications
    empty( publisher.getSubscribers() );
  }

  function testSubscribe(){
    var sandbox = new Sandbox('testSubscribe');
    lb.core.plugins.events(sandbox);
    var ut = sandbox.events.subscribe;

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
    var sandbox = new Sandbox('testUnsubscribe');
    lb.core.plugins.events(sandbox);
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
    var sandbox = new Sandbox('testPublish');
    lb.core.plugins.events(sandbox);
    var ut = sandbox.events.publish;

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

  var tests = {
    testNamespace: testNamespace,
    testPlugin: testPlugin,
    testSubscribe: testSubscribe,
    testUnsubscribe: testUnsubscribe,
    testPublish: testPublish
  };

  testrunner.define(tests, "lb.core.plugins.events");
  return tests;

}());
