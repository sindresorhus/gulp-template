'use strict';
var es = require('event-stream');
var gutil = require('gulp-util');
var tpl = require('lodash.template');
var argv = require('optimist').argv;

module.exports = function (data, options) {
	return es.map(function (file, cb) {
		file.contents = new Buffer(tpl(file.contents.toString(), data, options));
		cb(null, file);
	});
};
