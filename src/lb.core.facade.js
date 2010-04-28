/*
 * Namespace: lb.core.facade
 * Application Core Facade
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-04-28
 */
/*requires lb.core.js */
/*requires lb.core.dom.js */
/*requires lb.core.log.js */
/*requires lb.ui.Module.js */
/*requires lb.ui.Sandbox.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.facade = lb.core.facade || (function() {
  // Builder of
  // Closure for lb.core.facade module

  // Declare aliases
  var Module = lb.ui.Module,
      Sandbox = lb.ui.Sandbox,
      $ = lb.core.dom.$,
      log = lb.core.log.print,

  // Private members

  // array, the list of modules (lb.ui.Module) registered on the facade
      modules = [],

  // array, the list of modules (lb.ui.Module) subscribed to notifications
      subscribers = [];

  function getModules(){
    // Function: getModules(): array
    // Get the list of User Interface modules registered on the facade.
    //
    // Returns:
    //   array, the list of registered modules (lb.ui.Module)

    return modules;
  }

  function register(id, name, creator){
    // Function: register(id, name, creator)
    // Register a user interface module.
    //
    // Parameters:
    //   id - string, the identifier of the HTML element for the module box
    //   name - string, a name to describe the module, e.g. 'lb.ui.myModule'
    //   creator - func, the function to create an instance of the module
    //
    // Note:
    // This method expects the keyword this to reference the Facade object.
    // It must be called or applied on the Facade.

    var box, sandbox, module;

    module = new Module(name, creator);
    box = $(id);
    if (!box){
      var message = 'ERROR: could not find box element "'+id+
                    '" for module "'+name+'".';
      log(message);
      throw new Error(message);
    }
    sandbox = new Sandbox(box,module,this);
    module.setSandbox(sandbox);
    modules.push(module);
  }

  function startAll(){
    // Function startAll()
    // Start all registered modules.

    for (var i=0; i<modules.length; i++){
      modules[i].start();
    }
  }

  function stopAll(){
    // Function stopAll()
    // Stop all registered modules.
    //
    // Note:
    // All subscriptions are cancelled. Any module will have to get subscribed
    // anew to receive future notifications.

    for (var i=0; i<modules.length; i++){
      modules[i].stop();
    }
    subscribers = [];
  }

  function subscribe(module){
    // Function subscribe(module)
    // Subscribe a module to event notifications.
    //
    // Parameter:
    //   module - object, the User Interface Module (instance of lb.ui.Module)
    //
    // Note:
    // A module may be subscribed multiple times, it will receive the event
    // notifications only once.

    for (var i=0; i<subscribers.length; i++){
      if (module === subscribers[i]){
        return; // already subscribed
      }
    }
    subscribers.push(module);
  }

  function notifyAll(event){
    // Function notifyAll(event)
    // Notify all subscribed modules of the given event.
    //
    // Parameter:
    //   event - object, the event object

    for (var i=0; i<subscribers.length; i++){
      subscribers[i].notify(event);
    }
  }

  function getApi(){
    // Function: getApi(): object
    // Get the public api to publish in the sandboxes
    //
    // Returns:
    //   object, a set of named functions, making the public api

    return {
      // TODO: define API methods
      log: log
    };
  }

  return { // Facade API
    getModules: getModules,
    register: register,
    startAll: startAll,
    stopAll: stopAll,
    subscribe: subscribe,
    notifyAll: notifyAll,
    getApi: getApi
  };
}());
