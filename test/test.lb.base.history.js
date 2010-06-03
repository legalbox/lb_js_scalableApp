/*
 * test.lb.base.history.js - Unit Tests of lb.base.history module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * Version:   2010-06-02
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.history.js */
/*requires bezen.js */
/*requires bezen.dom.js */
/*requires bezen.assert.js */
/*requires bezen.object.js */
/*requires bezen.testrunner.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false, evil:true */
/*global lb, bezen, window, setTimeout */
(function() {
  // Builder of
  // Closure object for Test of lb.base.history

  // Define aliases
  var assert = bezen.assert,
      object = bezen.object,
      testrunner = bezen.testrunner,
      $ = bezen.$,
      remove = bezen.dom.remove;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','history'),
                                   "lb.base.history namespace was not found");
  }

  function testInit(){
    var ut = lb.base.history.init;

    // Only included in IE
    // assert.isTrue( object.exists( $('lb.base.history.iframe') ),
    // "assert: iframe with id 'lb.base.history.iframe' expected in document");
    assert.isTrue( object.exists( $('lb.base.history.input') ),
         "assert: input with id 'lb.base.history.input' expected in document");

    ut();
    ut(); // second call should have no effect
    lb.base.history.destroy();

    if ( $('lb.base.history.iframe') ){
      remove( $('lb.base.history.iframe') );
    }
    remove( $('lb.base.history.input') );
    // See details in setUp()
    lb.base.config.setOptions({'lb:history:cheapUrl':'favicon.ico'});
    ut();
    lb.base.history.destroy();
  }

  function testDestroy(){
    var ut = lb.base.history.destroy;

    lb.base.history.init();
    ut(); // must not fail
    ut(); // must not fail when already destroyed
  }

  function setUp(){
    // The resource must exist. There is a favicon.ico file in the test folder,
    // while there may not be a favicon at the root of the test server.
    lb.base.config.setOptions({'lb:history:cheapUrl':'favicon.ico'});
    lb.base.history.init();
  }

  function tearDown(){
    lb.base.history.destroy();
  }

  function testGetHash(){
    var ut = lb.base.history.getHash;
    setUp();

    window.location.hash = '#one';
    assert.equals( ut(), '#one',                    "'#one' expected in hash");

    window.location.hash = '#one/two/three';
    assert.equals( ut(), '#one/two/three',
                                          "'#one/two/three' expected in hash");

    window.location.hash = 'one%20space';
    assert.equals( ut(), '#one space',    "hash value expected to be decoded");

    tearDown();
    assert.equals( ut(), null,  "null expected when history manager is ended");
  }

  function testSetHash(){
    var ut = lb.base.history.setHash;
    setUp();

    ut('#simple');
    assert.equals(window.location.hash, '#simple',
                                           "simple hash expected to be set");

    ut('nohashsign');
    assert.equals(window.location.hash, '#nohashsign',
                       "hash without hash sign expected to be set with one");

    ut('a/b/c');
    assert.equals(window.location.hash, '#a/b/c',
                                              "hash path expected to be set");

    ut('one space');
    // window.location.hash is not a reliable check, it gets decoded in FF
    assert.equals( lb.base.history.getHash(), '#one space',
               "hash with space expected to be properly encoded and decoded");

    tearDown();
    ut('ignored');
    assert.isFalse( window.location.hash === 'ignored',
                    "setHash() must be ignored when history manager is ended");
  }

  function testOnHashChange(test){
    var ut = lb.base.history.onHashChange;
    setUp();

    // Callback is asynchronous in IE (synchronous in other browsers)
    test.startAsyncTest();
    bezen.log.on(); // debug

    var capturedHash = [];
    function captureHash(hash){
      bezen.log.info('Captured Hash: '+hash);
      capturedHash.push(hash);
    }

    // sequence of hashes for the test
    var hashSequence = ['#zero','#one','#two','#three'];
    var currentStep = 0;
    var checkHash;
    var changeHash = function(){
      bezen.log.info("Set Hash: "+hashSequence[currentStep]);
      lb.base.history.setHash( hashSequence[currentStep] );
      checkHash();
    };
    checkHash = function(){
      // check that current hash has been set
      if ( !object.exists(capturedHash[currentStep]) ){
        bezen.log.info('Checking captured hash: '+capturedHash[currentStep]);

        // Issue: fires twice in IE for the initial hash.......
        // The issue disappears if we wait only 150ms, appears for 200ms

        // retry the check in 150ms
        //setTimeout(checkHash, 150);

        // retry the check in 200ms
        setTimeout(checkHash, 200);
        return;
      }

      assert.equals( capturedHash[currentStep], hashSequence[currentStep],
                      "New hash expected to be captured at step "+currentStep);

      // go to next step
      currentStep++;
      if ( currentStep < hashSequence.length) {
        changeHash();
      } else {
        test.endAsyncTest();
        tearDown();
      }
    };

    bezen.log.info("Set Hash: "+hashSequence[currentStep]);
    lb.base.history.setHash( hashSequence[currentStep] );
    ut(captureHash);
    checkHash();
  }

  var tests = {
    testNamespace: testNamespace,
    testInit: testInit,
    testDestroy: testDestroy,
    testGetHash: testGetHash,
    testSetHash: testSetHash,
    testOnHashChange: testOnHashChange
  };

  testrunner.define(tests, "lb.base.history");
  return tests;

}());
