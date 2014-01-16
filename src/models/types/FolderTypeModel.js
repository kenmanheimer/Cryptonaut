(function (window, console, Encryptr, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  var FolderType = Backbone.Model.extend({
    type: "Folder",
    contents: null,
    initialize: function () {
      this.modelID = "folder:" + window.app.getNewUnique();
      if (! this.contents) {
        this.contents = new Encryptr.prototype.EntriesCollection();
        this.contents.container = this.modelID;
        this.contents.sync("create", this.contents);
      }
    },
    which: "FolderType"
  });

  FolderType.prototype.displayName = "Folder";

  Encryptr.prototype.types = Encryptr.prototype.types || {};
  Encryptr.prototype.types.FolderType = FolderType;

})(this, this.console, this.Encryptr);
