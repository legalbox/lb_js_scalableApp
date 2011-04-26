/*
 * test.lb.core.plugins.server.js - Unit Tests of Server Core Plugin
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-04-26
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.core.plugins.server.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window, goog */
(function() {
  // Builder of
  // Closure object for Test of lb.core.plugins.server

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      empty = bezen.array.empty,
      /*requires goog.net.MockXmlHttp */
      MockXmlHttp = goog.net.MockXmlHttp,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','core','plugins','server'),
                            "lb.core.plugins.server namespace was not found");
  }

  function testPlugin(){
    var ut = lb.core.plugins.server;

    var sandbox = new Sandbox('testPlugin');
    ut(sandbox);

    // Asynchronous communication with a remote server (sandbox.server)
    assert.isTrue( object.exists(sandbox,'server','send'),
                                "sandbox.server.send expected to be defined");
  }

  function setUp(){
    // Set up to restore a neutral state before each unit test

    // reset mock XHR object
    empty( MockXmlHttp.all );
  }

  function testSend(){
    var sandbox = new Sandbox('testSend');
    lb.core.plugins.server(sandbox);
    var ut = sandbox.server.send;

    setUp();

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

  var tests = {
    testNamespace: testNamespace,
    testPlugin: testPlugin,
    testSend: testSend
  };

  testrunner.define(tests, "lb.core.plugins.server");
  return tests;

}());
