'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = require("lodash");
var WeakMap = WeakMap || require("weak-map");

// customized for this use-case
var isObject = function isObject(obj) {
	return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object' && obj !== null && !(obj instanceof RegExp) && !(obj instanceof Error) && !(obj instanceof Date);
};

module.exports = function mapObj(objectToMap, fn, opts, seen) {
	seen = seen || new WeakMap();

	if (seen.has(objectToMap)) {
		return seen.get(objectToMap);
	}

	opts = _.assign({
		deep: false,
		target: {}
	}, opts);

	seen.set(objectToMap, opts.target);

	var target = opts.target;
	delete opts.target;

	_.forOwn(objectToMap, function (val, key) {
		var result = fn(key, val, objectToMap);
		var newValue = result[1];

		if (opts.deep && isObject(newValue)) {
			if (Array.isArray(newValue)) {
				newValue = newValue.map(function (objectToMap) {
					return isObject(objectToMap) ? mapObj(objectToMap, fn, opts, seen) : objectToMap;
				});
			} else {
				newValue = mapObj(newValue, fn, opts, seen);
			}
		}

		target[_.head(result)] = newValue;
	});

	return target;
};