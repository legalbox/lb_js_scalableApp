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
 * 2010-05-03
 */
/*requires lb.core.js */
/*requires lb.core.events.Subscriber.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.Module = lb.core.Module || function (name, creator){
  // Function: new Module(name,creator): Module
  // Constructor of a new Core Module.
  //
  // Parameters:
  //   name - string, the qualified module name, e.g. 'lb.ui.myModule'
  //   creator - function, a creator function returning a module.
  //             A new Sandbox instance will be provided as parameter.
  //
  // Returns:
  //   object, the new instance of lb.core.Module

  // Define aliases
  var Subscriber = lb.core.events.Subscriber,

  // Private fields

  // string, the status of underlying module
      status = 'idle',

  // object, the underlying module instance
      module,

  // object, the sandbox for the underlying module
      sb,

  // array, the list of subscriber objects (lb.core.events.Subscriber)
      subscribers = [];

  function getName(){
    // Function: getName(): string
    // Get the module name.
    //
    // Returns:
    //   string, the module name, as given in contructor.

    return name;
  }

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

  function getSandbox(){
    // Function: getSandbox(): Sandbox
    // Get the sandbox associated with this module.
    //
    // Returns:
    //   object, the sandbox initialized in setSandbox().

    return sb;
  }

  function setSandbox(sandbox){
    // Function: setSandbox(sandbox)
    // Set the sandbox associated with this module.
    //
    // Parameters:
    //   sandbox - object, the sandbox to set (instance of lb.ui.Sandbox)
    //
    // Note:
    // setSandbox() must be called to initialize the sandbox before start() and
    // other methods are called; it is needed to access the logging api.

    sb = sandbox;
  }

  function start(){
    // Function: start()
    // Create and start the underlying module
    //
    // Note:
    // Nothing happens in case no sandbox has been configured.
    if (!sb){
      return;
    }

    try {
      module = creator(sb);
      status = 'created';
    } catch(e1) {
      sb.log('ERROR: Failed to create module "'+name+
             '" using creator "'+creator+
             '" with sandbox "'+sb+
             '"; '+e1+'.');
      status = 'failed';
      return;
    }

    try {
      module.start();
      status = 'started';
    } catch(e2){
      sb.log('ERROR: Failed to start module "'+name+'"; '+e2+'.');
      status = 'failed';
    }
  }

  function stop(){
    // Function: stop()
    // Stop the underlying module.
    //
    // All created Filters are deleted ; as a consequence, event subscriptions
    // are cancelled.
    //
    // Note:
    // Nothing happens in case no sandbox has been configured.
    if (!sb){
      return;
    }

    try {
      subscribers.length = 0;
      module.stop();
      status = 'stopped';
    } catch(e){
      sb.log('ERROR: Failed to stop module "'+name+'": '+e+'.');
      status = 'failed';
    }
  }

  // TODO: REMOVE, SPLIT TO lb.core.Sandbox / lb.core.events.publisher
  function subscribe(event,callback){
    // Function: subscribe(event, callback)
    // Filter incoming events and trigger callback for given event type.
    //
    // Parameters:
    //   event - object, the event type defining the filter
    //   callback - function, the callback function. This function shall accept
    //              an event as argument.

    subscribers.push( new Subscriber(event,callback) );
  }

  // TODO: MOVE TO lb.core.events.publisher#subscribe
  function notify(event){
    // Function: notify(event)
    // Notify an event to the underlying module
    //
    // Parameter:
    //   event - object, the event subject of the notification
    //
    // Note:
    // Nothing happens in case no sandbox has been configured.
    if (!sb){
      return;
    }

    for (var i=0; i<subscribers.length; i++){
      try {
        subscribers[i].notify(event);
      } catch(e){
        sb.log('ERROR: Failed to notify module "'+name+
                    '" of event "'+event+
                    '": '+e+'.');
        status = 'failed';
      }
    }
  }

  // Public methods
  this.getName = getName;
  this.getStatus = getStatus;
  this.getSandbox = getSandbox;
  this.setSandbox = setSandbox;
  this.start = start;
  this.stop = stop;
  this.subscribe = subscribe;
  this.notify = notify;
  return this;
};
