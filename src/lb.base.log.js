/*
 * Namespace: lb.base.log
 * Logging Adapter Module for Base Library
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box SAS (c) 2010, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2010-06-18
 */
/*requires lb.base.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.log = lb.base.log || (function() {
  // Builder of
  // Closure for lb.base.log module

  // Define aliases
      /*requires closure/goog.debug.Console.js*/
  var Console = goog.debug.Console,
      /*requires closure/goog.debug.Logger.js*/
      Logger = goog.debug.Logger,
      Level  = goog.debug.Logger.Level,

  // Private fields

    // object - the logger instance (goog.debug.Logger)
    logger;

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

    if (!logger){
      Console.autoInstall();
      logger = Logger.getLogger('lb');
      logger.setLevel(Level.ALL);
    }
    logger.info(message);
  }

  return { // public API
    print: print
  };
}());
