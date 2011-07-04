/*
 * Namespace: lb.base.log
 * Logging Adapter Module for Base Library
 *
 * Authors:
 * o Eric Bréchemier <legalbox@eric.brechemier.name>
 * o Marc Delhommeau <marc.delhommeau@legalbox.com>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-07-04
 */
/*jslint white:false, plusplus:false */
/*global define */
define(
  [
    "./lb.base",
    "./closure/goog.debug.Console",
    "./closure/goog.debug.Logger"
  ],
  function(
    lbBase,
    Console,
    Logger
  ){

    // Define alias
    var Level  = Logger.Level,

    // Private fields

      // object - the logger instance (goog.debug.Logger)
      logger = null;

    function print(message){
      // Function: print(message)
      // Print a message to the log console.
      //
      // Parameter:
      //   message - string, the message to print
      //
      // Notes:
      // The console will be activated if (and only if) Debug=true
      // is present in the URL.
      //
      // The console is initialized on first call.

      if (logger===null){
        Console.autoInstall();
        logger = Logger.getLogger('lb');
        logger.setLevel(Level.INFO);
      }
      logger.info(message);
    }

    // Assign to lb.base.log
    // for backward-compatibility in browser environment
    lbBase.log = { // public API
      print: print
    };

    return lbBase.log;
  }
);
