(function (window, console, Cryptonaut, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  var AccountModel = Backbone.Model.extend({
    defaults: {
      username: "",
      passphrase: "",
      session: undefined
    },
    initialize: function() {
      // ...
    }
  });

  Cryptonaut.prototype.AccountModel = AccountModel;

})(this, this.console, this.Cryptonaut);
