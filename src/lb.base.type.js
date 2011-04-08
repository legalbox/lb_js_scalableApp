/*
 * Namespace: lb.base.type
 * Utility method for type checking.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal-Box SAS (c) 2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-04-08
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.base.type = lb.base.type || (function() {
  // Builder of
  // Closure for lb.base.type module

  function is(value){
    // Function: is(value[,type]): boolean
    // Check the type of a value, possibly nested in sub-properties.
    //
    // The method may be called with a single argument to check that the value
    // is neither null nor undefined.
    //
    // If more than two arguments are provided, the value is considered to be
    // nested within a chain of properties starting with the first argument:
    // | is(object,'parent','child','leaf','boolean')
    // will check whether the property object.parent.child.leaf exists and is
    // a boolean.
    //
    // Parameters:
    //   value - any, the value to check, which may be nested in a chain made
    //           of previous arguments (see above)
    //   type - string, optional, the type expected for the value.
    //          Alternatively, a constructor function may be provided to check
    //          whether the value is an instance of given constructor.
    //
    // Returns:
    //   * false, if no argument is provided
    //   * false, if a single argument is provided which is null or undefined
    //   * true, if a single argument is provided, which is not null/undefined
    //   * if the type argument is a string, it is compared with the internal
    //     class of the value, put in lower case
    //   * if the type argument is a function, the instanceof operator is used
    //     to check if the value is considered an instance of the function
    //   * otherwise, the value is compared with the provided type using the
    //     strict equality operator ===
    //
    // Expected Types:
    // [TO BE COMPLETED]
    //
    // Notes:
    // This method retrieves the internal class of the provided value using
    // | Object.prototype.toString.call(value).slice(8, -1)
    // The class is then converted to lower case.
    //
    // The internal class differs depending on the script engine used by the
    // browser for [ADD LIST HERE: window, DOM Nodes?]
    //
    // See "The Class of an Object" section in the JavaScript Garden for
    // more details:
    // http://bonsaiden.github.com/JavaScript-Garden/#types.typeof
    var undefined, // do not trust global undefined, which may be overridden
        i,
        length = arguments.length,
        last = length -1,
        type,
        typeOfType,
        internalClass;

    if (length===0){
      return false; // no argument
    }

    if (length===1){
      return (value!==null && value!==undefined);
    }

    if (length>2){
      for (i=0; i<last-1; i++){
        if ( !is(value) ){
          return false;
        }
        value = value[ arguments[i+1] ]
      }
    }

    type = arguments[last];
    if (type === ''){
      return value === type;
    }

    typeOfType = typeof type;
    if (typeOfType === 'string') {
      internalClass = Object.prototype.toString.call(value)
                                               .slice(8, -1)
                                               .toLowerCase();
      return internalClass === type;
    }

    if (typeOfType === 'function') {
      return value instanceof type;
    }

    return value === type;
  }

  return { // public API
    is: is
  };
}());
