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
 * 2010-05-18
 */
/*requires lb.core.js */
/*requires lb.base.log.js */
/*requires lb.base.array.js */
/*requires lb.base.dom.factory.js */
/*requires lb.base.dom.Listener.js */
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
      Listener = lb.base.dom.Listener,
      defaultFactory = lb.base.dom.factory,

  // Private members

  // object, the factory for DOM elements, defaults to lb.base.dom.factory
      elementFactory = defaultFactory,

  // array, the list of modules (lb.core.Module) added in the application
      modules = [],

  // object, the onload listener (lb.base.dom.Listener)
      loadListener,

  // object, the onunload listener (lb.base.dom.Listener)
      unloadListener;

  function getElementFactory(){
    // Function: getElementFactory(): object
    // Get the factory configured to create DOM elements.
    //
    // Returns:
    //   object, the configured DOM element factory,
    //   lb.base.dom.factory by default.

    return elementFactory;
  }

  function setElementFactory(factory){
    // Function: setElementFactory(factory)
    // Configure a new factory to create DOM elements.
    //
    // This method is intended as an extension point for the support of Rich
    // Internet Applications: provide a custom factory to create widgets on top
    // of regular DOM elements. An element factory must implement the create()
    // method which creates DOM elements, and optionally a destroy() method to
    // destroy all components at the end of the application.
    //
    // Designing a Custom Factory:
    // A custom factory must implement the create() method, called to create
    // each DOM element with given tag name, attributes and child nodes, and 
    // optionally the destroy() method, to terminate widgets at the end of the 
    // application.
    // * See <lb.base.dom.factory>, the default Element Factory,
    //   for the expected signature of create().
    // * The destroy() method takes no parameters.
    //
    // Parameter:
    //   factory - object, optional, the new element factory. When omitted,
    //             the default factory is restored.
    //
    // Note:
    // Nothing happens in case the provided factory has no create() function.

    if (!factory){
      elementFactory = defaultFactory;
      return;
    }

    if (typeof factory.create !== "function"){
      log("Invalid element factory, without create function: "+factory+".");
      return;
    }

    elementFactory = factory;
  }

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

    for (var i=0; i<modules.length; i++){
      modules[i].start();
    }
  }

  function endAll(){
    // Function: endAll()
    // Terminate all registered modules.
    //
    // All registered modules are discarded.
    // The configured element factory is destroyed.

    for (var i=0; i<modules.length; i++){
      modules[i].end();
    }
    removeAll(modules);
    if (elementFactory.destroy){
      elementFactory.destroy();
    }
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
    getElementFactory: getElementFactory,
    setElementFactory: setElementFactory,
    getModules: getModules,
    addModule: addModule,
    removeModule: removeModule,
    startAll: startAll,
    endAll: endAll,
    run: run
  };
}());
