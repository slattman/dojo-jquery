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
	"dojo/dom-style",
	"dojo/dom-class",
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
], function(dojo, array, lang, baseFx, ready, dquery, has, dom, style, cls, construct, on, fx, loader, defaultEngine){

	console.log(array);

	"use strict";

	var version = 0.01;

	/* get the ingredients */
	var NodeList = dquery.NodeList;

	/* TODO: add a pinch of jquery, might need to tweak the recipe a bit :*/
	lang.extend(NodeList, {

		/* core */
		jquery: version,
		length: 0,
		toArray: function() { return Array.slice.call(this); },
		get: function(num) { return num != null ? (num < 0 ? this[num + this.length] : this[num]) : this[0]; },
		pushStack: function(elems) {
			var ret = query.merge(this.constructor(), elems);
			ret.prevObject = this;
			return ret;
		},
		each: function(callback) { return query.each(this, callback); },
		map: function(callback) {
			return this.pushStack( query.map(this, function(elem, i) {
				return callback.call(elem, i, elem);
			})
		)},
		slice: function() { return this.pushStack(Array.slice.apply(this, arguments)); },
		eq: function(i) {
			var len = this.length,
				j = +i + (i < 0 ? len : 0)
			;
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},
		end: function() { return this.prevObject || this.constructor(null); },
		push: Array.push,
		sort: Array.sort,
		splice: Array.splice,
		ready: ready,


		val: function(value) {
			var hooks, ret, isFunction,
				elem = this[0],
				rreturn = /\r/g
			;
			console.log(this);
			if (!arguments.length) {
				if (elem) {
					hooks = this.valHooks[elem.type] || this.valHooks[elem.nodeName.toLowerCase()];
					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined)
						return ret;
					ret = elem.value;
					return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
				}
				return;
			}
			isFunction = query.isFunction(value);
			var self = this;
			return this.each(function(i) {
				var val;
				if (this.nodeType !== 1) return;
				if (isFunction) val = value.call(this, i, query(this).val());
				else val = value;
				if (val == null) val = "";
				else if (typeof val === "number") val += "";
				else if (query.isArray(val)) val = this.map(val, function(value) { return value == null ? "" : value + ""; });
				hooks = self.valHooks[this.type] || self.valHooks[this.nodeName.toLowerCase()];
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined)
					this.value = val;
			});
		},

		valHooks: {
			option: {
				get: function(elem) {
					return query.trim(elem.value);
				}
			},
			radio: {
				set: function(elem, value) {
					if (query.isArray(value)) {
						return (elem.checked = query.inArray(query(elem).val(), value) > -1);
					}
				}
			},
			checkbox: {
				set: function(elem, value) {
					if (query.isArray(value)) {
						return (elem.checked = query.inArray(query(elem).val(), value) > -1);
					}
				}
			},
			select: {
				get: function(elem) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ? max : one ? index : 0
					;
					for (; i < max; i++) {
						option = options[ i ];
						if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null) && (!option.parentNode.disabled || !query.nodeName(option.parentNode, "optgroup"))) {
							value = query(option).val();
							if (one)
								return value;
							values.push( value );
						}
					}
					return values;
				},
				set: function(elem, value) {
					var optionSet, option,
						options = elem.options,
						values = query.makeArray(value),
						i = options.length
					;
					while ( i-- ) {
						option = options[i];
						if ((option.selected = query.inArray(query.valHooks.option.get(option), values) > -1))
							optionSet = true;
					}
					if (!optionSet)
						elem.selectedIndex = -1;
					return values;
				}
			}
		},

		find: function(query) { return this.query(query); },

		css: function() {
			if (typeof arguments[0] == "string")
				this.style(arguments[0], arguments[1]);
			if (typeof arguments[0] == "object")
				this.style(arguments[0]);
			return this;
		},
		hasClass: function(clsName) {
			for (var i in this)
				if (cls.contains(this[i], clsName)) return true;
			return false;
		},
		height: function(h) {
			if (h) return this.style("height", h);
			return this.style("height");
		},
		width: function(w) {
			if (w) return this.style("width", w);
			return this.style("width")[0];
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
		fadeToggle: function(){
			this.forEach(function(node) {
				if (node.style.opacity == 1 || node.style.opacity == "") 
					baseFx.fadeOut({node:node}).play();
				else baseFx.fadeIn({node:node}).play();
			});
			return this;
		},
		hide: function(node) {
			return this.query(node).style("display", "none");
		},
		show: function(node) {
			return this.query(node).style("display", "block");
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
		},

		/*

		index: function(){},
		size: function(){},

		animate: function(){},
		delay: function(){},
		fadeTo: function(){},
		finish: function(){},
		slideDown: function(){},
		slideToggle: function(){},
		slideUp: function(){},
		stop: function(){},

		toggle: function(){},
		bind: function(){},
		blur: function(){},
		change: function(){},
		dblclick: function(){},
		delegate: function(){},
		die: function(){},
		error: function(){},
		focus: function(){},
		focusout: function(){},
		hover: function(){},
		keydown: function(){},
		keypress: function(){},
		keyup: function(){},
		live: function(){},
		mousedown: function(){},
		mouseenter: function(){},
		mouseleave: function(){},
		mouseout: function(){},
		mouseover: function(){},
		mouseup: function(){},
		off: function(){},
		on: function(){},
		one: function(){},
		resize: function(){},
		scroll: function(){},
		select: function(){},
		submit: function(){},
		trigger: function(){},
		triggerHandler: function(){},
		unbind: function(){},
		undelegate: function(){},
		unload: function(){},

		detach: function(){},
		replaceAll: function(){},
		text: function(){},
		unwrap: function(){},
		wrap: function(){},
		wrapAll: function(){},
		wrapInner: function(){},
		selector: function(){},

		add: function(){},
		addBack: function(){},
		andSelf: function(){},
		children: function(){},
		closest: function(){},
		content: function(){},
		end: function(){},
		eq: function(){},
		filter: function(){},
		first: function(){},
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
		slice: function(){},
		prop: function() {},
		removeProp: function() {},

		serialize: function() {},
		serializeArray: function() {},
		ajaxComplete: function() {},
		ajaxError: function() {},
		ajaxSend: function() {},
		ajaxStart: function() {},
		ajaxStop: function() {},
		ajaxSuccess: function() {},

		innerHeight: function() {},
		innerWidth: function() {},
		offset: function() {},
		offsetParent: function() {},
		outerHeight: function() {},
		outerWidth: function() {},
		position: function() {},
		scrollLeft: function() {},
		scrollTop: function(){},

		clearQueue: function() {},
		dequeue: function() {},
		queue: function() {},
		promise: function(){},
		removeData: function() {},

		*/

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

	query.fn = NodeList.prototype;

	/* TODO: add salt and pepper for taste */

	var version = "@VERSION",
		class2type = {},
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		}
	;

	array.forEach("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(name, i) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	lang.mixin(query, {

		/* core */
		camelCase: function(string) { return string.replace(rmsPrefix, "ms-" ).replace(rdashAlpha, fcamelCase); },
		each: function(obj, callback) {
			var i = 0,
				length = obj.length,
				isArray = this.isArraylike(obj)
			;
			if (isArray) {
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false)
						break;
				}
			} else {
				for (i in obj) {
					if (callback.call( obj[i], i, obj[i] ) === false)
						break;
				}
			}
			return obj;
		},
		error: function(msg) { throw new Error(msg); },
		extend: lang.extend,
		globalEval: function(code) {
			var script = document.createElement("script");
			script.text = code;
			document.head.appendChild(script).parentNode.removeChild(script);
		},
		grep: function(elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert
			;
			for (; i < length; i++) {
				callbackInverse = !callback( elems[ i ], i );
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}
			return matches;
		},
		guid: 1,
		inArray: function(elem, arr, i) { return arr == null ? -1 : indexOf.call(arr, elem, i); },
		isArray: Array.isArray,
		isArraylike: function(obj) {
			var length = obj.length,
			type = this.type(obj);
			if (type === "function" || this.isWindow(obj))
				return false;
			if (obj.nodeType === 1 && length)
				return true;
			return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
		},
		isEmptyObject: function(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},
		isFunction: function(obj) { return typeof this.type(obj) === "function";  },
		isNumeric: function(obj) { return !this.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0; },
		isPlainObject: function(obj) {
			if ( this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj))
				return false;
			if (obj.constructor && !obj.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"))
				return false;
			return true;
		},
		isReady: true,
		isWindow: function(obj) { return obj != null && obj === obj.window; },
		makeArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				if (this.isArraylike(Object(arr))) {
					this.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call( ret, arr );
				}
			}
			return ret;
		},
		map: function(elems, callback, arg) {
			var value,
				i = 0,
				length = elems.length,
				isArray = this.isArraylike(elems),
				ret = []
			;
			if (isArray) {
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);
					if (value != null)
						ret.push(value);
				}
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);
					if (value != null)
						ret.push(value);
				}
			}
			return concat.apply([], ret);
		},
		merge: function(first, second) {
			var len = +second.length,
				j = 0,
				i = first.length
			;
			for (; j < len; j++) {
				first[i++] = second[j];
			}
			first.length = i;
			return first;
		},
		noop: function(){},
		now: Date.now,
		proxy: function(fn, context) {
			var tmp, args, proxy;
			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}
			if (query.isFunction(fn))
				return undefined;
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			};
			proxy.guid = fn.guid = fn.guid || query.guid++;
			return proxy;
		},
		support: {},
		trim: function(text) { return text == null ? "" : (text + "").replace(rtrim, ""); },
		type: function(obj) {
			if (obj == null) return obj + "";
			return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
		},

		holdReady: function(){},
		noConflict: function(){},
		sub: function(){},
		when: function(){},
		param: function(){},
		ajax: function(){},
		ajaxPrefilter: function(){},
		ajaxSetup: function(){},
		ajaxTransport: function(){},
		get: function(){},
		getJSON: function(){},
		getScript: function(){},
		post: function(){},
		load: function(){},
		cssHooks: function(){},
		data: function() {},
		dequeue: function() {},
		hasData: function() {},
		queue: function() {},
		removeData: function() {},
		browser: function(){},
		boxModel: function(){},		
		browser: function(){},
		sub: function(){},
		selector: function(){},
		contains: function(){},
		parseHTML: function(){},
		parseJSON: function(){},
		parseXML: function(){},
		isXMLDoc: function(){},
		queue: function(){},
		removeData: function(){},

		Callbacks: function(){
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
		},

		Deferred: function(){
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
		},
		
		fx: {
			interval: null,
			off: null,
			extend: lang.extend
		}

	});

	/* dinners served */
	return query;

});

