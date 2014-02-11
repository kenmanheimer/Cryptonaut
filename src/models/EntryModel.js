(function (window, console, Cryptonaut, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  var EntryModel = Backbone.Model.extend({
    container: "entries"
  });

  Cryptonaut.prototype.EntryModel = EntryModel;

})(this, this.console, this.Cryptonaut);
