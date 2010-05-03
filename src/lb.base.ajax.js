/*
 * Namespace: lb.base.ajax
 * AJAX (Asynchronous JavaScript And XML) Adapter Module for Base Library
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-03
 */
/*requires lb.base.js */
/*requires lb.base.log.js */
/*requires lb.base.json.js */
/*requires closure/goog.net.XhrIo.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.ajax = lb.base.ajax || (function() {
  // Builder of
  // Closure for lb.base.ajax module

  // Declare alias
  var XhrIo = goog.net.XhrIo,
      json = lb.base.json,
      log = lb.base.log.print;

  function send(url, data, receive){
    // Function: send(url, data, receive)
    // Send data to given URL, and trigger receive() with asynchronous answer.
    //
    // Parameters:
    //   url - string, the remote URL, respecting same origin policy
    //   data - object|array, the data to send, to be converted to JSON.
    //          No functions should be present in this data object.
    //   receive - function, the callback to trigger.
    //             The response object or array, converted from JSON, will be
    //             provided as parameter.

    var jsonString = json.serialize(data);
    var callback = function(event){
      try {
        var response = event.target.getResponseJson();
        receive(response);
      } catch(e) {
        log('ERROR: "'+e+
            '" in response to POST "'+jsonString+'" to "'+url+'"');
      }
    };
    XhrIo.send(url, callback, 'POST', jsonString);
  }

  return { // public API
    send: send
  };
}());
