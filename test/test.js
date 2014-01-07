'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var fs = require('fs');
var template = require('../index');

it('should compile Lodash templates', function (cb) {
	var stream = template({greeting: 'Hello'});

	stream.on('data', function (data) {
		assert.equal(String(data.contents), 'Hello World');
		cb();
	});

	stream.write(new gutil.File({contents: '<%= greeting %> World'}));
});

it('should compile Lodash templates with cli options as data', function (cb) {
	var cliOpts, shell, actual, expected;

	cliOpts = [
		'--headline=gulp-template CLI Options',
		'--text=Easy, simple scaffolding! \\o/'
	];

	shell = spawn('gulp', options);
	expected = fs.readFileSync('test/fixtures/template.md', 'utf8');

	shell.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	shell.on('close', function() {
		actual = fs.readFileSync('test/result/template.md', 'utf8');
		assert.equal(actual, expected);
		cb();
	});
});
