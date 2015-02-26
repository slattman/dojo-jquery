/*
 *
 * jquery.dojo.js v 0.01
 * make dojo look and feel more like jquery
 * author: brad slattman
 * slattman@gmail.com
 *
 */

var $ = $ || (function() {
  
  require([
    "dojo/query", 
    "dojo/NodeList-dom", 
    "dojo/NodeList-html", 
    "dojo/NodeList-fx", 
    "dojo/NodeList-data", 
    "dojo/NodeList-traverse", 
    "dojo/NodeList-manipulate",
  ], function($) {

    alert("init");

    /* make it look like jquery */
    window.$ = $;

    /* add some more jqueryness */
    dojo.extend(dojo.NodeList, {

      ready: function() {
        dojo.addOnLoad(arguments[0]);
      },

      each: function() {
        var cb = arguments[0];
        this.forEach(function() {
          return cb(arguments[0], arguments[1], arguments[2]);
        });
      },

      find: function() {
        var find = arguments[0],
            list = []
        ;
        this.forEach(function() {
          list.push($(arguments[0]).query(find));
        });
        if (list.length > 1)
          return list;
        return list[0];
      },

      show: function() {
        this.forEach(function(node) {
          $(node).style("display", "block");
        });
      },

      hide: function() {
        this.forEach(function(node) {
          $(node).style("display", "none");
        });
      },

      fadeIn: function() {
        this.forEach(function(node) {
          $(node).fadeIn().play();
        });        
      },

      fadeOut: function() {
        this.forEach(function(node) {
          $(node).fadeOut().play();
        });
      }

    });

  });

})();
