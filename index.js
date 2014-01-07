'use strict';
var es = require('event-stream');
var gutil = require('gulp-util');
var tpl = require('lodash.template');
var argv = require('optimist').argv;

// The plugin name as a constant.
var PLUGIN_NAME = 'gulp-template';

function GulpTemplate(data, options, fromCli) {

	if (typeof data === 'boolean') {
		fromCli = data;
	} else if (typeof options === 'boolean') {
		fromCli = options;
	}

	if (fromCli) {
		if (argv) {
			data = argv;
		} else {
			throw new gutil.PluginError(PLUGIN_NAME, 'Please provide cli options.');
		}
	}

	return es.map(function (file, cb) {
		file.contents = new Buffer(tpl(file.contents.toString(), data, options));
		cb(null, file);
	});
};

module.exports = GulpTemplate;
