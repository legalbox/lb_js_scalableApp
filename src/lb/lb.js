/*
 * Namespace: lb
 * Root of Legal Box Scalable JavaScript Application
 *
 * Authors:
 *   o Eric Bréchemier <legalbox@eric.brechemier.name>
 *   o Marc Delhommeau <marc.delhommeau@legalbox.com>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-07-12
 */
/*global define, window */
define(function() {

  // Note: no methods defined at this level currently

  var undef, // undefined value, for safe comparison
      lb = { // public API
      };

  // initialize global variable lb in browser environment,
  // for backward-compatibility
  if (window !== undef){
    window.lb = lb;
  }

  return lb;
});
