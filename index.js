'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var template = _.template;

function compile(options, getData) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		var data = getData(file);

		try {
			file.contents = new Buffer(template(file.contents.toString(), data, options).toString());
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
		}

		cb();
	});
}

module.exports = function (data, options) {
	return compile(options, function (file) {
		return _.merge({}, file.data, data);
	});
};

module.exports.precompile = function (options) {
	return compile(options, function() {
		return null;
	});
};
