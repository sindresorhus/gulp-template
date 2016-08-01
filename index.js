'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var template = require('lodash.template');
var merge = require('lodash.merge');

function compile(options, data, render) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		try {
			var tpl = template(file.contents.toString(), options);
			file.contents = new Buffer(render ? tpl(merge({}, file.data, data)) : tpl.toString());
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
		}

		cb();
	});
}

module.exports = function (data, options) {
	return compile(options, data, true);
};

module.exports.precompile = function (options) {
	return compile(options);
};
