'use strict';
/* eslint-env mocha */
const {strict: assert} = require('assert');
const Vinyl = require('vinyl');
const data = require('gulp-data');
const template = require('.');

it('should compile Lodash templates', callback => {
	const stream = template({people: ['foo', 'bar']});

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '<li>foo</li><li>bar</li>');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<% _.forEach(people, function (name) { %><li><%- name %></li><% }); %>')
	}));

	stream.end();
});

it('should support data via gulp-data', callback => {
	const dl = [];

	const stream = data(file => {
		return {
			dd: file.path
		};
	});

	stream.pipe(template({dt: 'path'}));

	stream.on('data', chunk => {
		dl.push(chunk.contents.toString());
	});

	stream.on('end', () => {
		const expected = '<dt>path</dt><dd>bar.txt</dd><dt>path</dt><dd>foo.txt</dd>';
		assert.equal(dl.sort().join(''), expected);
		callback();
	});

	stream.write(new Vinyl({
		path: 'foo.txt',
		contents: Buffer.from('<dt><%- dt %></dt><dd><%- dd %></dd>')
	}));

	stream.write(new Vinyl({
		path: 'bar.txt',
		contents: Buffer.from('<dt><%- dt %></dt><dd><%- dd %></dd>')
	}));

	stream.end();
});

it('should support Lo-Dash options with gulp-data', callback => {
	const options = {
		variable: 'data',
		imports: {
			dt: 'path'
		}
	};

	const dl = [];

	const stream = data(file => {
		return {
			dd: file.path
		};
	});

	stream.pipe(template(null, options));

	stream.on('data', chunk => {
		dl.push(chunk.contents.toString());
	});

	stream.on('end', () => {
		const expected = '<dt>path</dt><dd>bar.txt</dd><dt>path</dt><dd>foo.txt</dd>';
		assert.equal(dl.sort().join(''), expected);
		callback();
	});

	stream.write(new Vinyl({
		path: 'foo.txt',
		contents: Buffer.from('<dt><%- dt %></dt><dd><%- data.dd %></dd>')
	}));

	stream.write(new Vinyl({
		path: 'bar.txt',
		contents: Buffer.from('<dt><%- dt %></dt><dd><%- data.dd %></dd>')
	}));

	stream.end();
});

it('should merge gulp-data and data parameter', callback => {
	const stream = data(() => {
		return {
			people: ['foo', 'bar'],
			nested: {
				a: 'one',
				b: 'two'
			}
		};
	});

	stream.pipe(template({
		heading: 'people',
		nested: {
			a: 'three',
			c: 'four'
		}
	}));

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '<h1>people</h1><li>foo</li><li>bar</li>three,two,four');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1><%= heading %></h1><% _.forEach(people, function (name) { %><li><%- name %></li><% }); %><%= nested.a %>,<%= nested.b %>,<%= nested.c %>')
	}));

	stream.end();
});

it('should not alter gulp-data or data parameter', callback => {
	const chunks = [];

	const stream = data(file => {
		return {
			contents: file.contents.toString()
		};
	});

	const parameter = {
		foo: 'foo',
		bar: 'bar',
		foobar: ['foo', 'bar']
	};

	stream.pipe(template(parameter));

	stream.on('data', chunk => {
		chunks.push(chunk);
	});

	stream.on('end', () => {
		assert.deepEqual(chunks[0].data, {contents: 'foo'});
		assert.deepEqual(parameter, {
			foo: 'foo',
			bar: 'bar',
			foobar: ['foo', 'bar']
		});
		callback();
	});

	stream.write(new Vinyl({
		contents: Buffer.from('foo')
	}));

	stream.end();
});

it('should work with no data supplied', callback => {
	const stream = template();

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('')
	}));

	stream.end();
});

it('should precompile Lodash templates', callback => {
	const stream = template.precompile();

	stream.on('data', data => {
		assert.ok(data.contents.toString().includes('function'));
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1><%= heading %></h1>')
	}));

	stream.end();
});

it('should support Lo-Dash options when precompiling', callback => {
	const options = {
		variable: 'data'
	};

	const stream = template.precompile(options);

	stream.on('data', data => {
		assert.ok(data.contents.toString().includes('function'));
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1><%= heading %></h1>')
	}));

	stream.end();
});
