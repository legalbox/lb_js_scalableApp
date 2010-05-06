/*
 * Namespace: lb.core.application
 * Core Application
 *
 * The Core Application manages the life cycle of modules.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-06
 */
/*requires lb.base.js */
/*requires lb.base.log.js */
/*requires lb.base.dom.js */
/*requires lb.core.js */
/*requires lb.core.Module.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, window */
// preserve the module, if already loaded
lb.core.application = lb.core.application || (function() {
  // Builder of
  // Closure for lb.core.facade module

  // Declare aliases
  var Module = lb.core.Module,
      log = lb.base.log.print,
      addListener = lb.base.dom.addListener,

  // Private members

  // array, the list of modules (lb.core.Module) added in the application
      modules = [];

  function getModules(){
    // Function: getModules(): array
    // Get the list of modules added in the application.
    //
    // Returns:
    //   array, the list of modules (lb.core.Module) added with addModule().

    return modules;
  }

  function addModule(module){
    // Function: addModule(module)
    // Add a new module to the application.
    //
    // Parameter:
    //   module - object, the new module (lb.core.Module) to add

    // no check: modules may be added multiple times
    modules.push(module);
  }

  function removeModule(module){
    // Function: removeModule(module)
    // Remove a module from the application.
    //
    // Parameter:
    //   module - object, the module (lb.core.Module) to remove

    for (var i=0; i<modules.length; i++){
      if (modules[i]===module){
        modules.splice(i,1);
        i--; // index for next item decreased
        // no return: remove duplicates if any
      }
    }
  }

  function startAll(){
    // Function: startAll()
    // Start all registered modules.

    for (var i=0; i<modules.length; i++){
      modules[i].start();
    }
  }

  function endAll(){
    // Function: endAll()
    // Terminate all registered modules.

    for (var i=0; i<modules.length; i++){
      modules[i].end();
    }
  }

  function run(){
    // Function: run()
    // Run the application.
    //
    // * startAll gets registered as listener for window 'load' event,
    // * endAll gets registered as listener for window 'unload' event.

    addListener(window, 'load', startAll);
    addListener(window, 'unload', endAll);
  }

  return { // Facade API
    getModules: getModules,
    addModule: addModule,
    removeModule: removeModule,
    startAll: startAll,
    endAll: endAll,
    run: run
  };
}());
