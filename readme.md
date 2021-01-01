# gulp-template

> Render/precompile [Lodash/Underscore templates](https://lodash.com/docs#template)

*Issues with the output should be reported on the Lodash [issue tracker](https://github.com/lodash/lodash/issues).*


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

exports.default = () => (
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

exports.default = () => (
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

### template(data, options?)

Render a template using the provided `data`.

### template.precompile(options?)

Precompile a template for rendering dynamically at a later time.

#### data

Type: `object`

Data object used to populate the text.

#### options

Type: `object`

[Lodash `_.template` options](https://lodash.com/docs#template).


## Tip

You can also provide your own [interpolation string](https://lodash.com/docs#template) for custom templates.

### `src/greeting.html`

```html
<h1>Hello {{ name }}</h1>
```

### `gulpfile.js`

```js
const gulp = require('gulp');
const template = require('gulp-template');
const data = require('gulp-data');

exports.default = () => (
	gulp.src('src/greeting.html')
		.pipe(data(() => ({name: 'Sindre'})))
		.pipe(template(null, {
			interpolate: /{{(.+?)}}/gs
		}))
		.pipe(gulp.dest('dist'))
);
```

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## Related

- [grunt-template](https://github.com/mathiasbynens/grunt-template) - Grunt version
