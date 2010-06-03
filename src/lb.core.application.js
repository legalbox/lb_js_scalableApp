/*
 * Namespace: lb.core.application
 * Core Application
 *
 * The Core Application manages the life cycle of modules.
 *
 * It also initializes and destroys the local navigation history.
 * There are several requirements to fulfill for the local history to work in a
 * consistent way cross-browsers. Please refer to <lb.base.history> for the
 * details of the markup and styles needed in the document.
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
 * 2010-06-03
 */
/*requires lb.core.js */
/*requires lb.base.log.js */
/*requires lb.base.array.js */
/*requires lb.base.config.js */
/*requires lb.base.dom.Listener.js */
/*requires lb.base.history.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb, window */
// preserve the module, if already loaded
lb.core.application = lb.core.application || (function() {
  // Builder of
  // Closure for lb.core.application module

  // Declare aliases
  var log = lb.base.log.print,
      addOne = lb.base.array.addOne,
      removeOne = lb.base.array.removeOne,
      removeAll = lb.base.array.removeAll,
      config = lb.base.config,
      Listener = lb.base.dom.Listener,
      history = lb.base.history,

  // Private members

    // array, the list of modules (lb.core.Module) added in the application
    modules = [],

    // object, the onload listener (lb.base.dom.Listener)
    loadListener,

    // object, the onunload listener (lb.base.dom.Listener)
    unloadListener;

  // Function: setOptions(options)
  // Configure a set of option properties.
  //
  // Note:
  // Previous properties are preserved unless overwritten by new properties.
  //
  // Parameter:
  //   options - object, a hash of configuration properties.

  // This is an alias on lb.base.config.setOptions()

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
    //
    // Note:
    // Nothing happens in case the same instance of module is already present.

    addOne(modules, module);
  }

  function removeModule(module){
    // Function: removeModule(module)
    // Remove a module from the application.
    //
    // Parameter:
    //   module - object, the module (lb.core.Module) to remove

    removeOne(modules, module);
  }

  function startAll(){
    // Function: startAll()
    // Start all registered modules.
    //
    // The local navigation history is also initialized beforehand.

    history.init();
    for (var i=0; i<modules.length; i++){
      modules[i].start();
    }
  }

  function endAll(){
    // Function: endAll()
    // Terminate all registered modules.
    //
    // All registered modules are discarded.
    //
    // The local navigation history is also destroyed afterwards.

    for (var i=0; i<modules.length; i++){
      modules[i].end();
    }
    removeAll(modules);
    history.destroy();
    if (loadListener){
      loadListener.detach();
    }
    if (unloadListener){
      unloadListener.detach();
    }
  }

  function run(){
    // Function: run()
    // Run the application.
    //
    // * startAll gets registered as listener for window 'load' event,
    // * endAll gets registered as listener for window 'unload' event.

    loadListener = new Listener(window, 'load', startAll);
    unloadListener = new Listener(window, 'unload', endAll);
  }

  return { // Public API
    setOptions: config.setOptions,
    getModules: getModules,
    addModule: addModule,
    removeModule: removeModule,
    startAll: startAll,
    endAll: endAll,
    run: run
  };
}());
