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
	"dojo/_base/array", 
	"dojo/_base/lang", 
	"dojo/_base/fx", 
	"dojo/ready", 
	"dojo/query", 
	"dojo/has", 
	"dojo/dom", 
	"dojo/dom-construct",
	"dojo/on", 
	"dojo/fx", 
	"dojo/selector/_loader", 
	"dojo/selector/_loader!default",
	"dojo/NodeList-dom", 
	"dojo/NodeList-html", 
	"dojo/NodeList-fx", 
	"dojo/NodeList-data", 
	"dojo/NodeList-traverse", 
	"dojo/NodeList-manipulate"
], function(dojo, array, lang, baseFx, ready, dquery, has, dom, construct, on, fx, loader, defaultEngine){

	"use strict";

	/* get the ingredients */
	var NodeList = dquery.NodeList;

	/* TODO: add a pinch of jquery, might need to tweak the recipe a bit */
	lang.extend(NodeList, {

		ready: ready,

		each: function(callback) {
			this.forEach(function() {
				return callback(arguments[0], arguments[1], arguments[2]);
			});
		},

		find: function(query) {
			return this.query(query);
		},

		show: function(node) {
			return this.query(node).style("display", "block");
		},

		hide: function(node) {
			return this.query(node).style("display", "none");
		},

		fadeIn: function() {
			this.forEach(function(node) {
				baseFx.fadeIn({node:node}).play();
			});
			return this;
		},

		fadeOut: function() {
			this.forEach(function(node) {
				baseFx.fadeOut({node:node}).play();
			});
			return this;
		},

		css: function() {
			if (typeof arguments[0] == "string")
				this.style(arguments[0], arguments[1]);
			if (typeof arguments[0] == "object") {}
				this.style(arguments[0]);
			return this;
		},

		click: function(callback) {
			this.forEach(function(node) {
				on(node, 'click', callback);
			});
			return this;
		},
		
		load: function(callback) {
			this.forEach(function(node) {
				on(node, 'load', callback);
			});
			return this;
		}

	});

	/* sizzle */
	function queryForEngine(engine, NodeList){
		var query = function(/*String*/ query, /*String|DOMNode?*/ root){
			if(typeof root == "string"){
				root = dom.byId(root);
				if(!root){
					return new NodeList([]);
				}
			}
			if (typeof query == "function")
				return ready(query);
			if (typeof query == "string") {
				if (query.match("<")) {
					var node = construct.toDom(query);
					return new NodeList(node);
				}
			}
			var results = typeof query == "string" ? engine(query, root) : query ? (query.end && query.on) ? query : [query] : [];
			if(results.end && results.on){
				return results;
			}
			return new NodeList(results);
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

	/* TODO: add salt and pepper for taste */
	query.ajax;
	query.get;
	query.getScript;
	query.post;

	/* dinners served */
	return query;

});

