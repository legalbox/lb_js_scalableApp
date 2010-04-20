/*
 * Namespace: lb.ui.Sandbox
 * Sandbox for User Interface Modules of Legal Box Web Application
 *
 * A new instance of Sandbox gets attributed to each User Interface Module.
 * It acts as a proxy to Application Programming Interface methods on the
 * Application Core Facade.
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
lb.ui.Sandbox = lb.ui.Sandbox || function (box,module,facade){
  // Function: new Sandbox(box,module,facade): Sandbox
  // Constructor of a new Sandbox.
  //
  // Parameters:
  //   box - object, the root HTML element for this User Interface Module
  //   module - object, the User Interface Module (instance of lb.ui.Module)
  //   facade - object, the Application Core Facade to proxify
  //
  // Returns:
  //   object, the new instance of lb.ui.Sandbox

  function getBox(){
    // Function: getBox(): object
    // Get the root HTML element for this module
    //
    // Returns:
    //   object, the box element provided in constructor

    return box;
  }

  function subscribe(event){
    // Function: subscribe(event)
    // Subscribe to an event of given type
    //
    // Parameters:
    //   event - object, the type of event.
    //           This object is similar to event objects. Any included property
    //           will be used as a filter to restrict events part of the 
    //           subscription. For example:
    //           * {} is a subscription to all events (no filter)
    //           * {name: 'foo'} is a subscription to all events named 'foo'
    //           * {name: 'foo', id:42} filters on name==='foo' and id===42

    // subscribe the associated User Interface Module to this event
    facade.subscribe(module,event);
  }

  function proxify(api){
    // (private) proxify(api)
    // Copy api methods to this object
    //
    // Parameters:
    //   api - object, the application programming interface object.
    //         Each field of this object is expected to be a function
    //         to be copied to the sandbox. No method of this object should
    //         be named like native methods of the sandbox (getBox, subscribe);
    //         otherwise, they will be hidden by the sandbox methods.

    for (var name in api){
      if ( api.hasOwnProperty(name) ) {
        this[name] = api[name];
      }
    }
  }

  // Public methods
  proxify.call(this, facade.getApi() );
  this.getBox = getBox;
  this.subscribe = subscribe;

  return this;
};
