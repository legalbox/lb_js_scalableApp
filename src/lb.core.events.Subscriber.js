/*
 * Namespace: lb.core.events.Subscriber
 * Subscriber to Core Events
 *
 * A Subscriber acts as a filter between the Publisher of Core Events and
 * callbacks registered by Modules.
 *
 * All subscribers get notified of all events. Each subscriber will apply the
 * filter configured during its creation to decide whether the associated
 * callback shall be triggered or not.
 *
 * In this module, a filter consists of a set of properties with values. The
 * same property must be present with the same value for the callback to get
 * triggered.
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
/*requires lb.core.events.js */
/*requires lb.base.object.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.events.Subscriber = lb.core.events.Subscriber ||
                            function(filter, callback){
  // Function: new Subscriber(filter,callback): Subscriber
  // Constructor of a new Core Events Subscriber.
  //
  // Parameters:
  //   filter - object, the set of properties/values expected in events
  //   callback - function, the associated callback function to trigger.
  //              A matching event will trigger the callback, and be provided
  //              as parameter: callback(event). The provided parameter is a
  //              deep clone of the input event, and can thus be kept at hand
  //              and updated freely by the target module.
  //
  // Returns:
  //   object, the new instance of lb.core.events.Subscriber

  // Define alias
  var clone = lb.base.object.clone;

  function notify(event){
    // Function: notify(event)
    // Apply the filter to incoming event and trigger the callback if the
    // event matches the expected filter.
    //
    // Parameters:
    //   event - object, the incoming event object
    //
    // The filtering principle is:
    // * a filter without any property accepts all incoming events
    // * any property set on the filter must be found with the same value on
    //   the incoming event. If the property is not present, or present with a
    //   different value, the incoming event is rejected.
    //
    // Note:
    // The input event is cloned recursively before being provided to the
    // target callback, which can then keep it and update it freely.

    for (var name in filter) {
      if ( filter.hasOwnProperty(name) ){
        if ( !event[name] || event[name] !== filter[name] ){
          // event rejected
          return;
        }
      }
    }

    // event accepted
    callback( clone(event,true) );
  }

  return { // Public methods
    notify: notify
  };
};
