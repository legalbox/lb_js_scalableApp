/*
 * Namespace: lb.core.Module
 * Core Module of Legal Box Scalable JavaScript Application
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
 * 2010-05-19
 */
/*requires lb.core.js */
/*requires lb.core.application.js */
/*requires lb.core.Sandbox.js */
/*requires lb.base.dom.js */
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
  //   object, the new instance of Module

  // Define aliases
  var log = lb.base.log.print,
      Sandbox = lb.core.Sandbox,
      getFactory = lb.core.application.getFactory,
      $ = lb.base.dom.$,

  // Private fields

  // object, the underlying module instance
      module,

  // object, the sandbox object
      sandbox;

  try {
    sandbox = new Sandbox(id);
    module = creator(sandbox);
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

  function getSandbox(){
    // Function: getSandbox(): object
    // Get the sandbox allocated to the module.
    //
    // Returns:
    //   object, the module's sandbox.

    return sandbox;
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
    // The end() method is optional on the underlying module; it will not be
    // called when omitted. In any case, removeAllListeners() will be called on
    // the sandbox to cleanup any remaining DOM listeners, and destroyElement()
    // will be called on the configured factory to terminate the box element
    // and any widgets included within.

    //
    try {
      if (module && module.end){
        module.end();
      }
      sandbox.removeAllListeners();
      var box = $( sandbox.getId() );
      if (box){
        getFactory().destroyElement(box);
      }
    } catch(endError){
      log('ERROR: Failed to end module "'+id+'"; '+endError+'.');
    }
  }

  // Public methods
  this.getId = getId;
  this.getSandbox = getSandbox;
  this.start = start;
  this.end = end;
};
