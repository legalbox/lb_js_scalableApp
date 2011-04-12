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
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-04-12
 */
/*requires lb.core.js */
/*jslint white:false, plusplus:false */
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
  var /*requires lb.base.type.js */
      is = lb.base.type.is,
      /*requires lb.base.log.js */
      log = lb.base.log.print,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox,
      /*requires lb.base.config.js */
      getOption = lb.base.config.getOption,
      /*requires lb.base.dom.js */
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
    // Notes:
    // * the start method is optional on the underlying module; it will not be
    //   called when omitted.
    // * before starting the module, the initElement() method is triggered on
    //   the configured factory with the box element of the module as argument,
    //   if a custom factory has been configured which supports the method and
    //   the box is present in the document.

    var customFactory = getOption('lbFactory'),
        box;
    if ( is(customFactory,'initElement','function') ){
      box = getSandbox().getBox(false);
      if ( is(box) ){
        // possible extension point for the initialization of widgets
        customFactory.initElement(box);
      }
    }

    if ( !is(module,'start','function') ){
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

    try {
      if ( is(module,'end','function') ){
        module.end();
      }
      sandbox.dom.removeAllListeners();
      var box = $( sandbox.getId() ),
          factory = getOption('lbFactory',lb.base.dom.factory);
      if ( is(box) && is(factory,'destroyElement','function') ){
        factory.destroyElement(box);
      }
    } catch(endError){
      log('ERROR: Failed to end module "'+id+'"; '+endError+'.');
    }
  }

  // Public methods
  this.getId = getId;
  this.toString = getId;
  this.getSandbox = getSandbox;
  this.start = start;
  this.end = end;
};
