/*
 * bezen.js - Root of bezen.org Javascript library
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   based on 2010-01-14
 */

// Modifications Copyright 2010-2011 Legal-Box SAS, All Rights Reserved
// Licensed under the BSD License - http://creativecommons.org/licenses/BSD/
// * updated module pattern for use with requireJS

/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global define, window, bezen, document */
define(
  function() {

    var nix = function(){  
      // an empty function that does nothing
      // declared here to be reused as a constant where needed, instead
      // of creating a new similar-looking function in many places
    };
     
    var $ = function(id) {
      // The classic shortcut for getElementById(), in its simplest form.
      // Note: nothing fancy here, this is just an alias for getElementById.
      //
      // param:
      //   id - (string) a DOM element identifier
      //
      // return: (DOM node) (null)
      //   same result as document.getElementById
       
      return document.getElementById(id);
    };

    var bezen = {
      // public API
      $: $,
      nix: nix,
      _: { // private section, for unit tests
      }
    }

    // initialize global variable bezen in browser environment,
    // for backward-compatibility
    if (window){
      // preserve the library, if already loaded
      window.bezen = window.bezen || bezen;
    }

    return bezen;
  }
);
