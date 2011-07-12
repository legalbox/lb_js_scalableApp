/*
 * Namespace: lb.core
 * Core Modules for Legal Box Scalable JavaScript Application
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
 * 2011-07-06
 */
/*jslint white:false, plusplus:false */
/*global define */
define(
  [
    "./lb"
  ],
  function(lb) {

    // Note: no methods defined at this level currently

    // Assign to lb.core
    // for backward-compatibility in browser environment
    lb.core = { // public API
    };

    return lb.core;
  }
);
