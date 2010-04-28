/*
 * Namespace: lb.ui.EventFilter
 * User Interface Event Filters
 *
 * Filters are applied by User Interface Module on events notified by the
 * Application Core Facade, before triggering a callback registered by a
 * portlet module.
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
/*requires lb.ui.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.ui.EventFilter = lb.ui.EventFilter || function(filterEvent, callback){
  // Function: new EventFilter(event,callback): EventFilter
  // Constructor of a new User Interface Event Filter.
  //
  // Parameters:
  //   filterEvent - object, the event sample provided as filter
  //   callback - function, the associated callback function to trigger.
  //              A matching event will trigger the callback, and be provided
  //              as parameter.
  //
  // Returns:
  //   object, the new instance of lb.ui.EventFilter

  function apply(event){
    // Function: apply(event)
    // Apply this filter to incoming event and trigger the callback if the
    // event matches the expected filterEvent.
    //
    // Parameters:
    //   event - object, the incoming event object
    //
    // The filtering principle is:
    // * a filter event without any property accepts all incoming events
    // * any property set on the filter event must be found with the same value
    //   on the incoming event. If the property is not present, or present with
    //   a different value, the incoming event is rejected.

    for (var name in filterEvent) {
      if ( filterEvent.hasOwnProperty(name) ){
        if ( !event[name] || event[name] !== filterEvent[name] ){
          // event rejected
          return;
        }
      }
    }

    // event accepted
    callback(event);
  }

  // Public methods
  this.apply = apply;
  return this;
};
