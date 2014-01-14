'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var template = require('lodash').template;

module.exports = function (data, options) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return cb();
		}

		try {
			file.contents = new Buffer(template(file.contents.toString(), data, options));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err));
		}

		this.push(file);
		cb();
	});
};
