/*
 * Namespace: lb.core.plugins.builder
 * Sandbox Builder, associate plugins to define the different parts of the API
 *
 * This is the default builder used in Core Module to create a new instance
 * of the Sandbox for a new module. It loads all plugins defined in the
 * framework in the namespace lb.core.plugins.
 *
 * The default Sandbox Builder is intended to be replaced with a custom builder
 * to add methods to the Sandbox API or replace methods to implement a
 * different behavior.
 *
 * How to customize the sandbox API:
 * A custom builder is an object with a method buildSandbox(id) which returns
 * a new instance of the Sandbox.
 *
 * The custom builder can be configured by calling setOptions on the
 * application core:
 * | lb.core.application.setOptions({ lbBuilder: your.customBuilder })
 *
 * To develop your own custom builder, you can start by creating a new module
 * as a closure assigned to your own namespace. You can then define the method
 * buildSandbox(id), calling the same method in the default Sandbox Builder
 * and returning the resulting Sandbox. You may now customize the Sandbox
 * instance returned by the default Sandbox Builder before returning it.
 *
 * The default Sandbox Builder uses plugins, located in lb.core.plugins, to
 * customize the bare instance of Sandbox resulting from a call to the Sandbox
 * constructor. A plugin is a function which takes the sandbox as parameter
 * and customizes it by adding, removing, or replacing methods. Each plugin
 * defined in lb.core.plugins adds methods to the Sandbox grouped in a property
 * named after the plugin, e.g. sandbox.css for the plugin lb.core.plugins.css.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-04-26
 */
/*requires lb.core.plugins.js */
/*jslint white:false, plusplus:false */
/*global lb */
lb.core.plugins.builder = (function() {
  // Builder of
  // Closure for lb.core.plugins.builder module

  // Declare aliases
  var /*requires lb.base.object.js */
      has = lb.base.object.has,
      /*requires lb.core.Sandbox.js */
      Sandbox = lb.core.Sandbox,
      /*requires lb.core.plugins.js */
      plugins = lb.core.plugins,
      /*requires lb.core.plugins.css.js */
      css = plugins.css,
      /*requires lb.core.plugins.dom.js */
      dom = plugins.dom,
      /*requires lb.core.plugins.events.js */
      events = plugins.events
      /*requires lb.core.plugins.i18n.js */
      i18n = plugins.i18n,
      /*requires lb.core.plugins.server.js */
      server = plugins.server,
      /*requires lb.core.plugins.url.js */
      url = plugins.url,
      /*requires lb.core.plugins.utils.js */
      utils = plugins.utils;

  function buildSandbox(id){
    // Function: buildSandbox(id)
    // Build a new instance of Sandbox from parts defined by plugins.
    //
    // Parameter:
    //   id - string, the identifier of the module for whom the Sandbox
    //        instance is intended.
    //
    // Returns:
    //   * null, in case the id argument is null or missing
    //   * object, a new instance of the Sandbox otherwise
    //
    // Note:
    // The module identifier may be used to customize the Sandbox methods
    // included, e.g. to restrict usage of AJAX methods to a specific Data
    // module, or to provide DOM manipulation methods only to User Interface
    // modules and not to Data modules. There is no such customization done in
    // the default Sandbox Builder, which always returns similar instances of
    // Sandbox with the same set of methods.
    if ( !has(id) ){
      return null;
    }

    var sandbox = new Sandbox(id);
    css(sandbox);
    dom(sandbox);
    events(sandbox);
    i18n(sandbox);
    server(sandbox);
    url(sandbox);
    utils(sandbox);
    return sandbox;
  }

  return { // public API
    buildSandbox: buildSandbox
  };
}());
