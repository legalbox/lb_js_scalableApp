/*
 * Namespace: lb.ui.Module
 * User Interface Modules of Legal Box Web Application
 *
 * Each User Interface Module corresponds to an independent unit of 
 * functionality, which may be started and stopped.
 *
 * For the purpose of this life cycle management, a new Module instance is 
 * created for each User Interface Module creator registered on the application
 * core Facade.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-04-20
 */
/*requires lb.ui.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global window, lb */
// preserve the module, if already loaded
lb.ui.Module = lb.ui.Module || function (name, creator){
  // Function: new Module(name,creator): Module
  // Constructor of a new User Interface Module.
  //
  // Parameters:
  //   name - string, the qualified module name, e.g. 'lb.ui.myModule'
  //   creator - function, a creator function returning a UI module.
  //             A new Sandbox instance will be provided as parameter.
  //
  // Returns:
  //   object, the new instance of lb.ui.Module

  // string, the status of underlying module
  var status = 'idle';

  // object, the underlying module instance
  var module;

  // object, the sandbox instance for the underlying module
  var sb;

  function getStatus(){
    // Function: getStatus(): string
    // Get the status of the underlying module
    //
    // Returns:
    // - 'idle' initially
    // - 'created' after a new instance gets created with provided creator
    // - 'started' after the module gets started
    // - 'stopped' after the module gets stopped
    // - 'failed' after a failure in creator(), start(), stop() or notify()

    return status;
  }

  function start(sandbox){
    // Function: start(sandbox)
    // Start the underlying module
    //
    // Parameters:
    //   sandbox - object, the sandbox instance for this UI module.
    //
    // Note:
    // Nothing happens in case no sandbox is provided.
    if (!sandbox){
      return;
    }

    try {
      sb = sandbox;
      module = creator(sandbox);
      status = 'created';
    } catch(e) {
      sb.log('ERROR: Failed to create module "'+name+
             '" using creator "'+creator+
             '" with sandbox "'+sandbox+
             '"; '+e+'.');
      status = 'failed';
      return;
    }

    try {
      module.start();
      status = 'started';
    } catch(e){
      sb.log('ERROR: Failed to start module "'+name+'"; '+e+'.');
      status = 'failed';
    }
  }

  function stop(){
    // Function: stop()
    // Stop the underlying module
    //
    // Note:
    // Nothing happens in case no sandbox has been provided in a start() call.
    if (!sb){
      return;
    }

    try {
      module.stop();
      status = 'stopped';
    } catch(e){
      sb.log('ERROR: Failed to stop module "'+name+'": '+e+'.');
      status = 'failed';
    }
  }

  function notify(event){
    // Function: notify(event)
    // Notify an event to the underlying module
    //
    // Parameter:
    //   event - object, the event subject of the notification
    //
    // Note:
    // Nothing happens in case no sandbox has been provided in a start() call.
    if (!sb){
      return;
    }

    try {
      module.notify(event);
    } catch(e){
      sb.log('ERROR: Failed to notify module "'+name+
                  '" of event "'+event+
                  '": '+e+'.');
      status = 'failed';
    }
  }

  // Public methods
  this.getStatus = getStatus;
  this.start = start;
  this.stop = stop;
  this.notify = notify;
  return this;
};
