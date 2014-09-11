# [gulp](http://gulpjs.com)-template [![Build Status](https://travis-ci.org/sindresorhus/gulp-template.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-template)

> Compile [Lo-Dash templates](http://lodash.com/docs#template)

Lo-Dash is like Underscore, but faster and better.

*Issues with the output should be reported on the Lo-Dash [issue tracker](https://github.com/lodash/lodash/issues).*


## Install

```sh
$ npm install --save-dev gulp-template
```


## Usage

### `src/greeting.html`

```erb
<h1>Hello <%= name %></h1>
```

### `gulpfile.js`

```js
var gulp = require('gulp');
var template = require('gulp-template');

gulp.task('default', function () {
	return gulp.src('src/greeting.html')
		.pipe(template({name: 'Sindre'}))
		.pipe(gulp.dest('dist'));
});
```

You can alternatively use [gulp-data](https://github.com/colynb/gulp-data) to inject the data:

```js
var gulp = require('gulp');
var template = require('gulp-template');
var data = require('gulp-data');

gulp.task('default', function () {
	return gulp.src('src/greeting.html')
		.pipe(data(function () {
			return {name: 'Sindre'};
		}))
		.pipe(template())
		.pipe(gulp.dest('dist'));
});
```

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## API

See the [Lo-Dash `_.template` docs](http://lodash.com/docs#template).

### template(data, options)

#### data

Type: `Object`

The data object used to populate the text.

#### options

Type: `Object`

[Lo-Dash `_.template` options](http://lodash.com/docs#template).


## Notes

If you use [grunt](http://gruntjs.com) instead of gulp, but want to perform a similar task, use [grunt-template](https://github.com/mathiasbynens/grunt-template).


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
