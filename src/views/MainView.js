(function (window, console, Cryptonaut, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  var MainView = Backbone.View.extend({
    el: "#main",
    events: {
      "click .menu-btn": "menuButton_clickHandler",
      "click .back-btn": "backButton_clickHandler",
      "click .edit-btn": "editButton_clickHandler",
      "click .save-btn": "saveButton_clickHandler",
      "click .delete-btn": "deleteButton_clickHandler",
      "click .add-btn": "addButton_clickHandler",
      "click .nav": "menuClose_clickHandler",
      "click .subviews": "menuClose_clickHandler"
    },
    initialize: function(options) {
      _.bindAll(this,
          "menuButton_clickHandler",
          "backButton_clickHandler",
          "addButton_clickHandler",
          "saveButton_clickHandler",
          "editButton_clickHandler",
          "deleteButton_clickHandler",
          "backButtonDisplay");
      this.menuView = new Cryptonaut.prototype.MenuView().render();
      this.menuView.dismiss();
      this.addMenuView = new Cryptonaut.prototype.AddMenuView().render();
      this.addMenuView.dismiss();
      this.$el.append(this.menuView.el);
      this.$el.append(this.addMenuView.el);
    },
    render: function() {
      this.$(".nav").html(
        window.tmpl["navView"]({})
      );
      return this;
    },
    menuButton_clickHandler: function(event) {
      event.preventDefault();
      this.menuView.toggle();
    },
    backButton_clickHandler: function(event) {
      event.preventDefault();
      this.backButtonDisplay(false);
      // console.log("back");
      // console.log(Date.now());
      if (window.app.navigator.viewsStack.length > 1) {
        window.app.navigator.popView(window.app.defaultPopEffect);
      }
    },
    addButton_clickHandler: function(event) {
      if (!this.menuView.$el.hasClass("dismissed")) {
        return;
      }
      event.preventDefault();
      this.addMenuView.toggle();
    },
    editButton_clickHandler: function(event) {
      this.trigger("editentry");
    },
    saveButton_clickHandler: function(event) {
      this.trigger("saveentry");
    },
    deleteButton_clickHandler: function(event) {
      this.trigger("deleteentry");
    },
    setTitle: function(title) {
      this.$(".nav .title").html(title);
    },
    backButtonDisplay: function(show) {
      if (show) {
        this.$(".back-btn").removeClass("hidden");
        this.$(".menu-btn").addClass("hidden");
        return;
      }
      this.$(".back-btn").addClass("hidden");
      this.$(".menu-btn").removeClass("hidden");
    },
    menuClose_clickHandler: function(event) {
      if (!this.menuView.$el.hasClass("dismissed") &&
          !$(event.target).hasClass("fa-ellipsis-v") &&
          !$(event.target).hasClass("menu-btn")) {
        this.menuView.dismiss();
      }
      if (!this.addMenuView.$el.hasClass("dismissed") &&
          !$(event.target).hasClass("fa-plus") &&
          !$(event.target).hasClass("add-btn")) {
        this.addMenuView.dismiss();
      }
    },
    close: function() {
      this.menuView.close();
      this.addMenuView.close();
    }
  });

  Cryptonaut.prototype.MainView = MainView;

})(this, this.console, this.Cryptonaut);
