'use strict';
const PluginError = require('plugin-error');
const through = require('through2');
const _ = require('lodash');

function compile(options, data, render) {
	return through.obj(function (file, encoding, callback) {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		try {
			const tpl = _.template(file.contents.toString(), options);
			file.contents = Buffer.from(render ? tpl(_.merge({}, file.data, data)) : tpl.toString());
			this.push(file);
		} catch (error) {
			this.emit('error', new PluginError('gulp-template', error, {fileName: file.path}));
		}

		callback();
	});
}

module.exports = (data, options) => compile(options, data, true);
module.exports.precompile = options => compile(options);
