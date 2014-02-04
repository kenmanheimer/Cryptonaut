(function (window, console, Encryptr, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
  _         = window._,
  $         = window.Zepto;

  var EntriesView = Backbone.View.extend({
    destructionPolicy: "never",
    events: {
      // ...
    },
    initialize: function() {
      _.bindAll(this, "render", "addAll", "addOne", "viewActivate", "viewDeactivate");
      this.collection.bind("reset", this.addAll, this);
      this.collection.bind("add", this.addOne, this);
      this.collection.bind("remove", this.addAll, this);
      this.on("viewActivate",this.viewActivate);
      this.on("viewDeactivate",this.viewDeactivate);

      this.subViews = [];
    },
    render: function() {
      this.$el.html(window.tmpl["entriesView"]({}));
      window.app.mainView.on("deleteentry", this.deleteButton_clickHandler, this);
      window.app.mainView.once("editentry", this.editButton_clickHandler, this);
      return this;
    },
    addAll: function () {
      this.$("ul").html("");
      this.collection.each(this.addOne);
    },
    addOne: function(model) {
      var view = new Encryptr.prototype.EntriesListItemView({
        model: model
      });
      this.$("ul").append(view.render().el);
      this.subViews.push(view);
    },
    viewActivate: function(event) {
      this.priorEntriesCollection = window.app.currentEntriesCollection;
      window.app.currentEntriesCollection = this.collection;
      this.collection.fetch();
      this.addAll();

      window.app.mainView.on("deleteentry", this.deleteButton_clickHandler,
                             this);
      window.app.mainView.on("editentry", this.editButton_clickHandler, this);

      if (this.collection.folderModel) {
        $(".nav .back-btn").removeClass("hidden");
        $(".nav .edit-btn.right").removeClass("hidden");
        //XXX $(".nav .delete-btn").removeClass("hidden");
        $(".nav .delete-btn").addClass("hidden");  // XXX
        window.app.mainView.setTitle(this.collection.folderModel.get("label"));
      }
      else {
        $(".nav .btn.right").addClass("hidden");
      }
      $(".nav .menu-btn").removeClass("hidden");
    },
    viewDeactivate: function(event) {
      // Reestablish prior entries collection. Will be superceded when
      // another entries view is activated.
      window.app.currentEntriesCollection = this.priorEntriesCollection;

      if (this.collection.folderModel) {
        $(".nav .back-btn").addClass("hidden");
        $(".nav .btn.right").addClass("hidden");
      }
      window.app.mainView.setTitle("Encryptr");
      $(".nav .menu-btn").removeClass("hidden");
      $(".nav .add-btn.right").removeClass("hidden");
      window.app.mainView.off("editentry", null, null);
      window.app.mainView.off("deleteentry", null, null);
    },
    editButton_clickHandler: function(event) {
      window.app.navigator.replaceView(
        window.app.EditView,
        {model: this.collection.folderModel},
        window.app.noEffect
      );
    },
    deleteButton_clickHandler: function(event) {
      var _this = this;
      var message = ("Delete this folder and ALL its contents?");
      navigator.notification.confirm(message, function(button) {
        if (button === 1) {
          _this.model.destroy();
          window.app.navigator.popView(window.app.defaultPopEffect);
        }
      }, "Confirm delete");
    },
    close: function() {
      _.each(this.subViews, function(view) {
        view.close();
      });
      this.remove();
    },
    which: "EntriesView"
  });
  Encryptr.prototype.EntriesView = EntriesView;

  var EntriesListItemView = Backbone.View.extend({
    tagName: "li",
    className: "entry",
    events: {
      "click a": "a_clickHandler"
    },
    initialize: function() {
      _.bindAll(this, "render");
      this.model.bind("change", this.render, this);
    },
    render: function() {
      this.$el.html(
        window.tmpl["entriesListItemView"](
          this.model.toJSON()
        )
      );
      return this;
    },
    a_clickHandler: function(event) {
      var _this = this,
          model = this.model,
          contentsId = model.get("contentsId");
      if (!$(".menu").hasClass("dismissed") ||
          !$(".addMenu").hasClass("dismissed")) {
        return;
      }
      if (contentsId) {
        model.fetch();
        window.app.navigator.pushView(
          window.app.EntriesView,
          {collection: model.contents},
          window.app.noEffect
        );
      }
      else {
        window.app.navigator.pushView(window.app.EntryView, {
          model: _this.model
        }, window.app.defaultEffect);
      }
    },
    close: function() {
      this.remove();
    },
    which: "EntriesListItemView"
  });
  Encryptr.prototype.EntriesListItemView = EntriesListItemView;

})(this, this.console, this.Encryptr);
