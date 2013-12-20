'use strict';
var es = require('event-stream');
var tpl = require('lodash.template');

module.exports = function (data, options) {
	return es.map(function (file, cb) {
		file.contents = new Buffer(tpl(file.contents.toString(), data, options));
		cb(null, file);
	});
};
