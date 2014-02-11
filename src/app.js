var Cryptonaut = (function (window, console, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
      _         = window._,
      $         = window.Zepto;

  var Cryptonaut = function () {
    this.online = true; // assume a hopeful default
  };

  Cryptonaut.prototype.init = function() {
    window.document.addEventListener("deviceready", this.onDeviceReady, false);
    window.document.addEventListener("resume", this.onResume, false);
    window.document.addEventListener("pause", this.onPause, false);
    window.document.addEventListener("offline", this.setOffline, false);
    window.document.addEventListener("online", this.setOnline, false);

    // Set the hostname for the Crypton server
    // window.crypton.host = "192.168.1.12";
    window.crypton.host = "localhost";

    window.Offline.options =
          {checks: {image: {url: "https://crypton.io/images/crypton.png"}}};

    var isNodeWebkit = (typeof process == "object");
    if (isNodeWebkit) $.os.nodeWebkit = true;
    // Render the login view (and bind its events)
    this.loginView = new this.LoginView().render();
    // Hax for Android 2.x not groking :active
    $(document).on("touchstart", "a", function(event) {
      var $this = $(this);
      $this.addClass("active");
    });
    $(document).on("touchend", "a", function(event) {
      var $this = $(this);
      $this.removeClass("active");
    });
    $(document).on("touchmove", "a", function(event) {
      var $this = $(this);
      $this.removeClass("active");
    });

    window.FastClick.attach(document.body);
  };

  Cryptonaut.prototype.onDeviceReady = function(event) {
    if (window.device && window.device.platform === "iOS" && parseFloat(window.device.version) >= 7.0) {
      window.document.querySelectorAll(".app")[0].style.top = "20px"; // status bar hax
    }
    if (window.StatusBar && $.os.ios) {
      window.StatusBar.styleLightContent();
    }
    // Backstack effects
    Cryptonaut.prototype.noEffect = new window.BackStack.NoEffect();
    Cryptonaut.prototype.fadeEffect = new window.BackStack.FadeEffect();
    Cryptonaut.prototype.defaultEffect = new window.BackStack.NoEffect();
    Cryptonaut.prototype.defaultPopEffect = new window.BackStack.NoEffect();
    if (window.device && window.device.platform === "iOS") {
      Cryptonaut.prototype.defaultEffect = new Cryptonaut.prototype.FastSlideEffect();
      Cryptonaut.prototype.defaultPopEffect = new Cryptonaut.prototype.FastSlideEffect({
        direction: "right"
      });
    }
    window.document.addEventListener("backbutton", Cryptonaut.prototype.onBackButton, false);
    window.document.addEventListener("menubutton", Cryptonaut.prototype.onMenuButton, false);

    // Platform specific clipboard plugin / code
    if ($.os.ios || $.os.android) {
      Cryptonaut.prototype.copyToClipboard = window.cordova.plugins.clipboard.copy;
    } else if ($.os.bb10) {
      Cryptonaut.prototype.copyToClipboard = window.community.clipboard.setText;
    } else if ($.os.nodeWebkit && window.require ) { // How to *actually* detect node-webkit ?
      var gui = window.require('nw.gui');
      window.clipboard = gui.Clipboard.get();
      Cryptonaut.prototype.copyToClipboard = function(text) {
        window.clipboard.set(text, 'text');
      };
    } else {
      // Fallback to empty browser polyfill
      Cryptonaut.prototype.copyToClipboard = function() {};
    }
  };

  Cryptonaut.prototype.setOffline = function(event) {
    this.online = false;
  };

  Cryptonaut.prototype.setOnline = function(event) {
    this.online = true;
  };

  Cryptonaut.prototype.onResume = function(event) {
    // Throw up the login screen
    window.app.loginView.show();
    window.setTimeout(function() {
      window.app.session = undefined;
      window.app.navigator.popAll(window.app.noEffect);
      window.app.mainView.menuView.close();
    },100);
  };

  Cryptonaut.prototype.onPause = function(event) {
    // ...
  };

  Cryptonaut.prototype.onBackButton = function(event) {
    if ($(".menu").is(":visible")) {
      window.app.mainView.menuView.dismiss();
      return;
    }
    if ($(".addMenu").is(":visible")) {
      window.app.mainView.addMenuView.dismiss();
      return;
    }
    if ($(".back-btn").is(":visible")) {
      window.app.navigator.popView(window.app.defaultPopEffect);
      return;
    }
    navigator.app.exitApp();
  };

  Cryptonaut.prototype.onMenuButton = function(event) {
    // ...
  };

  Cryptonaut.prototype.randomString = function(length) {
    var charset = ("!@#$%^&*()_+{}:<>?|,[];./~" +
                   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
                   "0123456789");
    var i;
    var result = "";
    if(window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(length);
      window.crypto.getRandomValues(values);
      for(i = 0; i < length; i++) {
          result += charset[values[i] % charset.length];
      }
    }
    return result; // If you can't say something nice, don's say anything at all
  };

  return Cryptonaut;

})(this, this.console);
