(function (window, console, Encryptr, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
    _         = window._,
    $         = window.Zepto;

  var FolderType = Backbone.Model.extend({
    type: "Folder",
    contents: null,         // Will initialize with fresh EntriesCollection
    initialize: function () {
      console.log("FolderModel initialize.");
      if (! this.get("container")) {
        this.set("container", "folder:" + window.app.getNewUnique());
      }
      if (! this.get("contents")) {
        this.set("contents", new Encryptr.prototype.EntriesCollection());
      }
    },
    which: "FolderType"
  });

  FolderType.prototype.displayName = "Folder";

  Encryptr.prototype.types = Encryptr.prototype.types || {};
  Encryptr.prototype.types.FolderType = FolderType;

})(this, this.console, this.Encryptr);
