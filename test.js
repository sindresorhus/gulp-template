'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var data = require('gulp-data');
var template = require('./');

it('should compile Lodash templates', function (cb) {
	var stream = template({people: ['foo', 'bar']});

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<li>foo</li><li>bar</li>');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('<% _.forEach(people, function (name) { %><li><%- name %></li><% }); %>')
	}));

	stream.end();
});

it('should support data via gulp-data', function (cb) {
	var dl = [];

	var stream = data(function (file) {
		return {
			dd: file.path
		};
	});

	stream.pipe(template({dt: 'path'}));

	stream.on('data', function (chunk) {
		dl.push(chunk.contents.toString());
	});

	stream.on('end', function () {
		var expected = '<dt>path</dt><dd>bar.txt</dd><dt>path</dt><dd>foo.txt</dd>';
		assert.equal(dl.sort().join(''), expected);
		cb();
	});

	stream.write(new gutil.File({
		path: 'foo.txt',
		contents: new Buffer('<dt><%- dt %></dt><dd><%- dd %></dd>')
	}));

	stream.write(new gutil.File({
		path: 'bar.txt',
		contents: new Buffer('<dt><%- dt %></dt><dd><%- dd %></dd>')
	}));

	stream.end();
});

it('should support Lo-Dash options with gulp-data', function (cb) {
	var options = {
		variable: 'data',
		imports: {
			dt: 'path'
		}
	};

	var dl = [];

	var stream = data(function (file) {
		return {
			dd: file.path
		};
	});

	stream.pipe(template(null, options));

	stream.on('data', function (chunk) {
		dl.push(chunk.contents.toString());
	});

	stream.on('end', function () {
		var expected = '<dt>path</dt><dd>bar.txt</dd><dt>path</dt><dd>foo.txt</dd>';
		assert.equal(dl.sort().join(''), expected);
		cb();
	});

	stream.write(new gutil.File({
		path: 'foo.txt',
		contents: new Buffer('<dt><%- dt %></dt><dd><%- data.dd %></dd>')
	}));

	stream.write(new gutil.File({
		path: 'bar.txt',
		contents: new Buffer('<dt><%- dt %></dt><dd><%- data.dd %></dd>')
	}));

	stream.end();
});

it('should merge gulp-data and data parameter', function (cb) {
	var stream = data(function () {
		return {
			people: ['foo', 'bar'],
			nested: { 'a' : 'one', 'b' : 'two' }
		};
	});

	stream.pipe(template({
		heading: 'people',
		nested: { 'a': 'three', 'c' : 'four' }
	}));

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<h1>people</h1><li>foo</li><li>bar</li>three,two,four');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('<h1><%= heading %></h1><% _.forEach(people, function (name) { %><li><%- name %></li><% }); %><%= nested.a %>,<%= nested.b %>,<%= nested.c %>')
	}));

	stream.end();
});

it('should not alter gulp-data or data parameter', function (cb) {
	var chunks = [];

	var stream = data(function (file) {
		return {
			contents: file.contents.toString()
		};
	});

	var parameter = {
		foo: 'foo',
		bar: 'bar',
		foobar: ['foo', 'bar']
	};

	stream.pipe(template(parameter));

	stream.on('data', function (chunk) {
		chunks.push(chunk);
	});

	stream.on('end', function () {
		assert.deepEqual(chunks[0].data, {contents: 'foo'});
		assert.deepEqual(parameter, {
			foo: 'foo',
			bar: 'bar',
			foobar: ['foo', 'bar']
		});
		cb();
	});

	stream.write(new gutil.File({
		contents: new Buffer('foo')
	}));

	stream.end();
});

it('should work with no data supplied', function (cb) {
	var stream = template();

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('')
	}));

	stream.end();
});

it('should precompile Lodash templates', function (cb) {
	var stream = template.precompile();

	stream.on('data', function (data) {
		assert.ok(data.contents.toString().indexOf('function (obj)') === 0);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('<h1><%= heading %></h1>')
	}));

	stream.end();
});

it('should support Lo-Dash options when precompiling', function (cb) {
	var options = {
		variable: 'data'
	};

	var stream = template.precompile(options);

	stream.on('data', function (data) {
		assert.ok(data.contents.toString().indexOf('function (data)') === 0);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('<h1><%= heading %></h1>')
	}));

	stream.end();
});
