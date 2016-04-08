# gulp-template [![Build Status](https://travis-ci.org/sindresorhus/gulp-template.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-template)

> Render/precompile [Lo-Dash/Underscore templates](http://lodash.com/docs#template)

*Issues with the output should be reported on the Lo-Dash [issue tracker](https://github.com/lodash/lodash/issues).*


## Install

```
$ npm install --save-dev gulp-template
```


## Usage

### `src/greeting.html`

```erb
<h1>Hello <%= name %></h1>
```

### `gulpfile.js`

```js
const gulp = require('gulp');
const template = require('gulp-template');

gulp.task('default', () =>
	gulp.src('src/greeting.html')
		.pipe(template({name: 'Sindre'}))
		.pipe(gulp.dest('dist'))
);
```

You can alternatively use [gulp-data](https://github.com/colynb/gulp-data) to inject the data:

```js
const gulp = require('gulp');
const template = require('gulp-template');
const data = require('gulp-data');

gulp.task('default', () =>
	gulp.src('src/greeting.html')
		.pipe(data(() => ({name: 'Sindre'})))
		.pipe(template())
		.pipe(gulp.dest('dist'))
);
```

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## API

### template(data, [options])

Render a template using the provided `data`.

### template.precompile([options])

Precompile a template for rendering dynamically at a later time.

#### data

Type: `object`

Data object used to populate the text.

#### options

Type: `object`

[Lo-Dash `_.template` options](http://lodash.com/docs#template).


## Related

- [grunt-template](https://github.com/mathiasbynens/grunt-template) - Grunt version


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
