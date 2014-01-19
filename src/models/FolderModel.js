// FolderModel.js
(function (window, console, Encryptr, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  /** FolderModel has features of an entry type, but is a real model. */
  var FolderModel = Backbone.Model.extend({
    defaults: {
      contents: null,
      type: "Folder"
    },
    displayName: "Folder",
    collection: Encryptr.prototype.EntriesCollection,
    contents: null,
    initialize: function () {
      // XXX Probably should remove "folder:", to reduce server-exposed info.
      this.modelId = "folder:" + window.app.getNewUnique();
      this.on("change", this.noteChange);
    },
    noteChange: function () {
      if ((typeof(this.get("contents")) === "string") &&
          this._previousAttributes.contents !== this.get("contents")) {
        console.log(this.modelId + " contents changed to string");
        this.fetch();
      }
    },
    /** Intervene in save to create our contents container, if we lack it. */
    save: function () {
      var primaryArgs = arguments,
          backboneSave = function () {
            Backbone.Model.prototype.save.apply(this, primaryArgs);
          }.bind(this);
      if (! this.get("contents")) {
        var collection = new Encryptr.prototype.EntriesCollection();
        collection.model = FolderModel;
        collection.modelId = "folderCollection:" + window.app.getNewUnique();
        collection.container = collection.modelId;
        this.set("contents", collection);
        window.app.session.create(collection.container,
                                  function (err, container) {
                                    backboneSave();
                                  });
      }
      else {
        backboneSave();
      }
    },
    fetch: function (options) {
      /* Reconstitute our entry collection if what we have is just the ID. */
      var contents = this.get("contents");
      if (typeof(contents) === "string") {
        var collection = new Encryptr.prototype.EntriesCollection();
        collection.container = contents;
        this.set("contents", collection);
        collection.fetch({
          error: function(errmsg) {
            navigator.notification.alert(
              "Fetch: " + errmsg,
              function() {},
              "Error");
          }
        });
      }
    },
    /** Return a representation ready for storing */
    toJSON: function () {
      var contents = this.get("contents"),
          attributes = this.attributes,
          dup = {};
      if (! contents || typeof(contents) === "string") {
        return Backbone.Model.prototype.toJSON.call(this);
      }
      _.extend(dup, this);
      dup.attributes = {};
      _.extend(dup.attributes, this.attributes);
      // Replace dup "contents" with its' id, for externalization:
      // (??? Using dup.set() triggers something that infinite loops)
      dup.attributes.contents = contents.modelId;
      return dup.toJSON();
    },
    which: "FolderModel"
  });

  Encryptr.prototype.FolderModel = FolderModel;

  Encryptr.prototype.types = Encryptr.prototype.types || {};
  Encryptr.prototype.types.FolderModel = FolderModel;

})(this, this.console, this.Encryptr);
