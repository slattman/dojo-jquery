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

		/* attributes
		prop: function() {},
		removeProp: function() {},
		val: function() {}, */

		/* ajax helpers
		serialize: function() {},
		serializeArray: function() {}, */

		/* ajax events
		ajaxComplete: function() {},
		ajaxError: function() {},
		ajaxSend: function() {},
		ajaxStart: function() {},
		ajaxStop: function() {},
		ajaxSuccess: function() {}, */

		/* css */
		css: function() {
			if (typeof arguments[0] == "string")
				this.style(arguments[0], arguments[1]);
			if (typeof arguments[0] == "object") {}
				this.style(arguments[0]);
			return this;
		},
		/*hasClass: function() {},
		height: function() {},
		width: function() {},
		innerHeight: function() {},
		innerWidth: function() {},
		offset: function() {},
		offsetParent: function() {},
		outerHeight: function() {},
		outerWidth: function() {},
		position: function() {},
		scrollLeft: function() {},
		scrollTop: function(){},*/

		/* data
		clearQueue: function() {},
		dequeue: function() {},
		queue: function() {},
		removeData: function() {},*/

		/* deferred
		promise: function(){},*/

		/* effects
		animate: function(){},
		delay: function(){},*/
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
		/*fadeTo: function(){},
		fadeToggle: function(){},
		finish: function(){},*/
		hide: function(node) {
			return this.query(node).style("display", "none");
		},
		show: function(node) {
			return this.query(node).style("display", "block");
		},
		/*slideDown: function(){},
		slideToggle: function(){},
		slideUp: function(){},
		stop: function(){},
		toggle: function(){},*/

		/* events
		bind: function(){},
		blur: function(){},
		change: function(){},*/
		click: function(callback) {
			this.forEach(function(node) {
				on(node, 'click', callback);
			});
			return this;
		},
		/*dblclick: function(){},
		delegate: function(){},
		die: function(){},
		error: function(){},
		focus: function(){},
		focusout: function(){},
		hover: function(){},
		keydown: function(){},
		keypress: function(){},
		keyup: function(){},
		live: function(){},*/
		load: function(callback) {
			this.forEach(function(node) {
				on(node, 'load', callback);
			});
			return this;
		},
		/*mousedown: function(){},
		mouseenter: function(){},
		mouseleave: function(){},
		mouseout: function(){},
		mouseover: function(){},
		mouseup: function(){},
		off: function(){},
		on: function(){},
		one: function(){},*/
		ready: ready,
		/*resize: function(){},
		scroll: function(){},
		select: function(){},
		submit: function(){},
		trigger: function(){},
		triggerHandler: function(){},
		unbind: function(){},
		undelegate: function(){},
		unload: function(){},*/
		
		/* internals
		pushStack: function(){},*/

		/* manipulation
		detach: function(){},
		replaceAll: function(){},
		text: function(){},
		unwrap: function(){},
		wrap: function(){},
		wrapAll: function(){},
		wrapInner: function(){},*/
		
		/* miscellaneous
		each: function(){},
		get: function(){},
		index: function(){},
		size: function(){},
		toArray: function(){},*/
		
		/* properties
		length: function(){},
		selector: function(){},*/

		/* removed
		die: function(){},
		live: function(){},
		toggle: function(){},*/

		/* traversing
		add: function(){},
		addBack: function(){},
		andSelf: function(){},
		children: function(){},
		closest: function(){},
		content: function(){}, */
		each: function(callback) {
			this.forEach(function() {
				return callback(arguments[0], arguments[1], arguments[2]);
			});
		},
		/*end: function(){},
		eq: function(){},
		filter: function(){},*/
		find: function(query) {
			return this.query(query);
		},
		/*first: function(){},
		has: function(){},
		is: function(){},
		last: function(){},
		map: function(){},
		next: function(){},
		nextAll: function(){},
		nextUntil: function(){},
		not: function(){},
		parent: function(){},
		parents: function(){},
		parentsUntil: function(){},
		prev: function(){},
		prevAll: function(){},
		orevUntil: function(){},
		siblings: function(){},
		slice: function(){},*/

	});

	/* sizzle */
	function queryForEngine(engine, NodeList){
		var query = function(/*String*/ query, /*String|DOMNode?*/ root){

			/* TODO: custom psuedo selectors */

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

	/* helper functions */
	query.param = function(){};

	/* low level interface */
	query.ajax = function(){};
	query.ajaxPrefilter = function(){};
	query.ajaxSetup = function(){};
	query.ajaxTransport = function(){};

	/* shorthand methods */
	query.get = function(){};
	query.getJSON = function(){};
	query.getScript = function(){};
	query.post = function(){};
	query.load = function(){};

	/* calbacks */
	query.Callbacks = function(){
		return {
			add: function(){},
			disable: function(){},
			disabled: function(){},
			empty: function(){},
			fire: function(){},
			fired: function(){},
			fireWith: function(){},
			has: function(){},
			lock: function(){},
			locked: function(){},
			remove: function(){}
		}
	};

	/* core */
	query.holdReady = function(){};
	query.noConflict = function(){};
	query.sub = function(){};
	query.when = function(){};

	/* css */
	query.cssHooks = function(){};

	/* data */
	query.data = function() {};
	query.dequeue = function() {};
	query.hasData = function() {};
	query.queue = function() {};
	query.removeData = function() {};

	/* deferred */
	query.Deferred = function(){
		return {
			always: function(){},
			done: function(){},
			fail: function(){},
			isRejected: function(){}, // removed
			isResolved: function(){}, // removed
			notify: function(){},
			notifyWith: function(){},
			pipe: function(){},
			progress: function(){},
			promise: function(){},
			reject: function(){},
			rejectWith: function(){},
			resolve: function(){},
			resolveWith: function(){},
			state: function(){},
			then: function(){}
		}
	};

	/* events */
	query.proxy = function(){};

	/* internals */
	query.fn = function() {
		return {
			jquery: 2
		}
	};
	query.error = function(){};
	
	/* properties */
	query.browser = function(){};
	query.support = function(){};

	/* fx */
	query.fx = function(){
		return {
			interval: null,
			off: null,
			extend: function(){}
		}
	},

	/* removed */
	query.boxModel = function(){};		
	query.browser = function(){};
	query.sub = function(){};
	query.selector = function(){};

	/* utilities */
	query.contains = function(){};
	query.extend = function(){};
	query.globalEval = function(){};
	query.grep = function(){};
	query.inArray = function(){};
	query.isArray = function(){};
	query.isEmptyObject = function(){};
	query.isFunction = function(){};
	query.isNumeric = function(){};
	query.isPlainObject = function(){};
	query.isWindow = function(){};
	query.isXMLDoc = function(){};
	query.makeArray = function(){};
	query.map = function(){};
	query.merge = function(){};
	query.noop = function(){};
	query.now = function(){};
	query.parseHTML = function(){};
	query.parseJSON = function(){};
	query.parseXML = function(){};
	query.proxy = function(){};
	query.queue = function(){};
	query.removeData = function(){};
	query.support = function(){};
	query.trim = function(){};
	query.type = function(){};
	query.unique = function(){};

	/* dinners served */
	return query;

});

