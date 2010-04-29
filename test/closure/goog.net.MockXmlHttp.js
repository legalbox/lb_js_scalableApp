/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Copyright 2007 Google Inc. All Rights Reserved
 *
 * Use of this source code is governed by an Apache 2.0 License.
 */
/*
 * Modifications Copyright 2010 Legal Box SAS, All Rights Reserved.
 * - code extracted from closure/goog/net/xhrio_test.html
 * - added goog.provide('goog.net.MockXmlHttp')
 * - added array in goog.net.MockXmlHttp.all; each new instance of MockXmlHttp
 *   now gets pushed to this list in constructor.
 * - code moved inside a closure to keep global scope clean
 * - added requires comments for goog.net and goog.net.XmlHttp.js
 * - added properties on this._ :
 *     * this._.url: uri provided in open()
 *     * this._.method: verb provided in open()
 *     * this._.async: async param provided in open()
 *     * this._.data: opt_data provided in send()
 * - set this.responseText to echo this._.data just before state COMPLETE
 */

/*requires goog.net*/
goog.provide('goog.net.MockXmlHttp');

/*requires goog.net.XmlHttp.js*/

(function(){
  // Closure scoping

  var instances = [];

  function MockXmlHttp() {
    // constructor
    instances.push(this);
  }

  MockXmlHttp.prototype.readyState = goog.net.XmlHttp.ReadyState.UNINITIALIZED;

  MockXmlHttp.prototype.status = 200;

  MockXmlHttp.syncSend = false;

  MockXmlHttp.prototype.send = function(opt_data) {
    this.readyState = goog.net.XmlHttp.ReadyState.UNINITIALIZED;

    this._.data = opt_data;

    if (MockXmlHttp.syncSend) {
      this.complete();
    }

  };

  MockXmlHttp.prototype.complete = function() {
    this.readyState = goog.net.XmlHttp.ReadyState.LOADING;
    this.onreadystatechange();

    this.readyState = goog.net.XmlHttp.ReadyState.LOADED;
    this.onreadystatechange();

    this.readyState = goog.net.XmlHttp.ReadyState.INTERACTIVE;
    this.onreadystatechange();

    // echo provided data
    this.responseText = this._.data;

    this.readyState = goog.net.XmlHttp.ReadyState.COMPLETE;
    this.onreadystatechange();
  };


  MockXmlHttp.prototype.open = function(verb, uri, async) {
    this._ = {
      method: verb,
      url: uri,
      async: async
    };
  };

  MockXmlHttp.prototype.abort = function() {};

  MockXmlHttp.prototype.setRequestHeader = function(key, value) {};


  MockXmlHttp.OptionType = goog.net.XmlHttp.OptionType;
  MockXmlHttp.ReadyState = goog.net.XmlHttp.ReadyState;
  MockXmlHttp.getProgId_ = goog.net.XmlHttp.getProgId_;
  MockXmlHttp.optionsFactory_ = goog.net.XmlHttp.optionsFactory_;
  MockXmlHttp.cachedOptions_ = goog.net.XmlHttp.cachedOptions_;
  MockXmlHttp.getOptions = goog.net.XmlHttp.getOptions;

  goog.net.XmlHttp = MockXmlHttp;
  goog.net.MockXmlHttp.all = instances;

})();
