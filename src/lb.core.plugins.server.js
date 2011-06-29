/*
 * Namespace: lb.core.plugins.server
 * Asynchronous Communication with a Remote Server Plugin for the Sandbox API
 *
 * Authors:
 * o Eric Bréchemier <legalbox@eric.brechemier.name>
 * o Marc Delhommeau <marc.delhommeau@legalbox.com>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-06-29
 */
/*jslint white:false, plusplus:false */
/*global define */
define(["./lb.core.plugins.server","./lb.base.ajax"],
  function(lbCorePluginsServer,   ajax) {
    // Assign to lb.core.plugins.sever
    // for backward-compatibility in browser environment
    lbCorePluginsServer = function(sandbox) {
      // Function: server(sandbox)
      // Define methods in the 'server' property of given sandbox.
      //
      // Parameters:
      //   sandbox - object, the sandbox instance to enrich with the send method

      // Declare alias
      var send = ajax.send;

      // Function: sandbox.server.send(url,data,receive)
      // Send and receive data from the remote host.
      //
      // Parameters:
      //   url - string, a url on remote host (must respect same origin policy)
      //   data - object, the data to send to the server. It must be valid JSON.
      //   receive - function, the callback with data received in response from
      //             the server. The data provided in argument will be a valid
      //             JSON object or array.

      // Note: send is an alias for lb.base.ajax.send

      sandbox.server = {
        send: send
      };
    };
    return lbCorePluginsServer;
  }
);
