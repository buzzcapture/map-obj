'use strict';

const _ = require("lodash");
const WeakMap = WeakMap || require("weak-map");

// customized for this use-case
const isObject = obj => typeof obj === 'object' && obj !== null && !(obj instanceof RegExp) &&
	!(obj instanceof Error) && !(obj instanceof Date);

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

	const target = opts.target;
	delete opts.target;

	_.forOwn(objectToMap, (val, key) => {
		let result = fn(key, val, objectToMap);
		let newValue = result[1];

		if (opts.deep && isObject(newValue)) {
			if (Array.isArray(newValue)) {
				newValue = newValue.map(objectToMap => isObject(objectToMap) ?
					mapObj(objectToMap, fn, opts, seen) : objectToMap);
			} else {
				newValue = mapObj(newValue, fn, opts, seen);
			}
		}

		target[_.head(result)] = newValue;
	});

	return target;
};
