/*
 *
 * dojo/jquery v 0.01 alpha
 * make dojo look and feel more like jquery
 * author: brad slattman
 * slattman@gmail.com
 *
 */

define([
	"dojo/_base/kernel", 
	"dojo/query", 
	"dojo/has", 
	"dojo/dom", 
	"dojo/on", 
	"dojo/_base/array", 
	"dojo/_base/lang", 
	"dojo/selector/_loader", 
	"dojo/selector/_loader!default",
	"dojo/NodeList-dom", 
	"dojo/NodeList-html", 
	"dojo/NodeList-fx", 
	"dojo/NodeList-data", 
	"dojo/NodeList-traverse", 
	"dojo/NodeList-manipulate",
], function(dojo, dquery, has, dom, on, array, lang, loader, defaultEngine){

	"use strict";

	/* copy the original NodeList */
	var NodeList = dquery.NodeList;

	/* add some more jqueryness */
	lang.extend(NodeList, {

      ready: function() {},

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
          dojo.fadeIn({node:node}).play();
        });        
      },

      fadeOut: function() {
        this.forEach(function(node) {
          dojo.fadeOut({node:node}).play();
        });
      }

	});

	/* look familiar? sizzle me baby! */
	function queryForEngine(engine, NodeList){
		var query = function(/*String*/ query, /*String|DOMNode?*/ root){
			if(typeof root == "string"){
				root = dom.byId(root);
				if(!root){
					return new NodeList([]);
				}
			}
			var results = typeof query == "string" ? engine(query, root) : query ? (query.end && query.on) ? query : [query] : [];
			if(results.end && results.on){
				return results;
			}
			return new NodeList(results);
		};
		query.matches = engine.match || function(node, selector, root){
			return query.filter([node], selector, root).length > 0;
		};
		query.filter = engine.filter || function(nodes, selector, root){
			return query(selector, root).filter(function(node){
				return array.indexOf(nodes, node) > -1;
			});
		};
		if(typeof engine != "function"){
			var search = engine.search;
			engine = function(selector, root){
				return search(root || document, selector);
			};
		}
		return query;
	}

	var query = queryForEngine(defaultEngine, NodeList);

	dojo.query = queryForEngine(defaultEngine, function(array){
		return NodeList(array);
	});

	query.load = function(id, parentRequire, loaded){
		loader.load(id, parentRequire, function(engine){
			loaded(queryForEngine(engine, NodeList));
		});
	};

	dojo._filterQueryResult = query._filterResult = function(nodes, selector, root){
		return new NodeList(query.filter(nodes, selector, root));
	};

	dojo.NodeList = query.NodeList = NodeList;

	return query;

});

