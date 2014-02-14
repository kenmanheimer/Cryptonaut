(function (window, console, Cryptonaut, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _           = window._,
    $           = window.Zepto;

  var EntriesCollection = Backbone.Collection.extend({
    initialize: function() {
      this.container = "entries"; // default
      this.model = Cryptonaut.prototype.EntryModel; // default
    },
    fetch: function (options) {
      var _this = this;
      var container = options && options.container || this.container;
      window.app.session.load(container, function(err, entries) {
        if (options && options.error && err) options.error(err);
        _this.set(
          _.map(entries.keys, function(entry, key) {
            return new _this.model(entry);
          })
        );
        if (options && options.success) options.success(_this);
      });
    },
    sync: function() {
      // ...
      console.log("@TODO: EntriesCollection.sync");
    }
  });

  Cryptonaut.prototype.EntriesCollection = EntriesCollection;

})(this, this.console, this.Cryptonaut);
