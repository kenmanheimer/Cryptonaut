(function (window, console, Cryptonaut, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
  _         = window._,
  $         = window.Zepto;

  var EntryView = Backbone.View.extend({
    events: {
      "longTap .copyable": "copyable_longTapHandler"
    },
    initialize: function() {
      this.model.bind("change", this.render, this);
      _.bindAll(this,
          "render",
          "editButton_clickHandler",
          "deleteButton_clickHandler",
          "viewActivate",
          "viewDeactivate");
      this.on("viewActivate",this.viewActivate);
      this.on("viewDeactivate",this.viewDeactivate);
      if (!window.app.toastView) {
        window.app.toastView = new window.app.ToastView();
      }
    },
    render: function() {
      var _this = this;
      this.$el.html(
        window.tmpl["entryView"](
          this.model.toJSON()
        )
      );
      window.app.mainView.on("deleteentry", this.deleteButton_clickHandler, this);
      window.app.mainView.once("editentry", this.editButton_clickHandler, this);

      // Desktop polyfill for longTap
      var timer = null;
      this.$(".copyable").on("mousedown", function(event) {
        timer = setTimeout( function() {
          _this.copyable_longTapHandler(event);
        }, 750 );
      });
      this.$(".copyable").on("mouseup", function(event) {
        clearTimeout( timer );
      });

      return this;
    },
    copyable_longTapHandler: function(event) {
      event.preventDefault();
      event.stopPropagation();
      var text = $(event.target).text();
      window.app.copyToClipboard(text);
      window.app.toastView.show("Copied to clipboard");
    },
    editButton_clickHandler: function(event) {
      window.app.navigator.replaceView(
        window.app.EditView,
        {model: this.model},
        window.app.noEffect
      );
    },
    deleteButton_clickHandler: function(event) {
      var _this = this;
      var message = "Delete this entry?";
      navigator.notification.confirm(message, function(button) {
        if (button === 1) {
          _this.model.destroy();
          window.app.navigator.popView(window.app.defaultPopEffect);
        }
      }, "Confirm delete");
    },
    viewActivate: function(event) {
      var _this = this;
      window.app.mainView.backButtonDisplay(true);
      $(".nav .btn.right").addClass("hidden");
      $(".nav .edit-btn.right").removeClass("hidden");
      $(".nav .delete-btn").removeClass("hidden");
      window.app.mainView.setTitle(this.model.get("label"));
    },
    viewDeactivate: function(event) {
      window.app.mainView.backButtonDisplay(false);
      $(".nav .btn.right").addClass("hidden");
      $(".nav .add-btn.right").removeClass("hidden");
      window.app.mainView.setTitle("Cryptonaut");
      window.app.mainView.off("editentry", null, null);
      window.app.mainView.off("deleteentry", null, null);
    },
    close: function() {
      this.remove();
    }
  });
  Cryptonaut.prototype.EntryView = EntryView;

})(this, this.console, this.Cryptonaut);
