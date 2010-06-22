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
 * Legal Box SAS (c) 2010, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2010-06-22
 */
/*requires lb.core.events.js */
/*jslint white:false, plusplus:false */
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
  //   object, the new instance of Subscriber

  // Define alias
      /*requires lb.base.object.js */
  var clone = lb.base.object.clone;

  function getFilter(){
    // Function: getFilter(): object
    // Get the associated filter object.
    //
    // Returns:
    //   object, the filter provided in constructor
    return filter;
  }

  function includes(event, filter){
    // Function: includes(event, filter): boolean
    // Check whether event object includes filter object.
    //
    // Parameters:
    //   event - object, first filter object
    //   filter - object, second filter object
    //
    // Returns:
    //   true when every property in filter has the same value in event,
    //   false otherwise
    //
    // Note:
    // This method is intended for internal use in this module to check whether
    // an event includes a filter; it is also used in the Sandbox, to compare
    // the mutual inclusion of two filters and check equality.

    for (var name in filter) {
      if ( filter.hasOwnProperty(name) ){
        if ( event[name] !== filter[name] ){
          // difference found
          return false;
        }
      }
    }
    return true;
  }

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

    if (  includes( event, getFilter() )  ){
      // event accepted
      callback( clone(event,true) );
    }
  }

  // Public mthods
  this.getFilter = getFilter;
  this.includes = includes;
  this.notify = notify;
};
