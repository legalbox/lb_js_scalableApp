/*
 * Namespace: lb.core.Module
 * Core Module of Legal Box Web Application
 *
 * Each Module corresponds to an independent unit of functionality.
 *
 * For the purpose of this life cycle management, a new Module instance is 
 * created for each User Interface Module and each Data Model Module added on
 * the Core Application.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-14
 */
/*requires lb.core.js */
/*requires lb.core.Sandbox.js */
/*requires lb.base.log.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.Module = lb.core.Module || function (id, creator){
  // Function: new Module(id,creator): Module
  // Constructor of a new Core Module.
  //
  // Parameters:
  //   id - string, the module identifier, e.g. 'lb.ui.myModule'
  //   creator - function, a creator function returning a custom module.
  //             A new Sandbox instance will be provided as parameter.
  //             creator functions for User Interface modules should be
  //             registered in the namespace 'lb.ui', e.g. lb.ui.myModule while
  //             creator functions for Data Model modules should be registered
  //             in the namespace 'lb.data', e.g. lb.data.myModule.
  //
  // Returns:
  //   object, the new instance of lb.core.Module

  // Define aliases
  var log = lb.base.log.print,
      Sandbox = lb.core.Sandbox,

  // Private fields

  // object, the underlying module instance
      module;

  try {
    module = creator( new Sandbox(id) );
  } catch(creationError){
    log('ERROR: failed to create module "'+id+
        '" using creator "'+creator+
        '"; '+creationError);
  }

  function getId(){
    // Function: getId(): string
    // Get the module identifier.
    //
    // Returns:
    //   string, the module identifier, as given in contructor.

    return id;
  }

  function start(){
    // Function: start()
    // Create and start the underlying module.
    //
    // Note:
    // Nothing happens in case the underlying module has no start() method or
    // no underlying module is available.

    //
    if (!module || !module.start){
      return;
    }

    try {
      module.start();
    } catch(startError){
      log('ERROR: Failed to start module "'+id+'"; '+startError+'.');
    }
  }

  function end(){
    // Function: end()
    // Terminate the underlying module.
    //
    // Note:
    // Nothing happens in case the underlying module has no end() method or
    // no underlying module is available.

    //
    if (!module || !module.end){
      return;
    }

    try {
      module.end();
    } catch(endError){
      log('ERROR: Failed to end module "'+id+'"; '+endError+'.');
    }
  }

  return { // Public methods
    getId: getId,
    start: start,
    end: end
  };
};
