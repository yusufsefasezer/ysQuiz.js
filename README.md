# ysQuiz.js
Easy to use and customizable quiz plugin.

## [Download](https://github.com/yusufsefasezer/ysQuiz.js/archive/master.zip) / [Demo](http://www.yusufsezer.com/projects/ysQuiz/) / [yusufsezer.com](http://www.yusufsezer.com)

## Why should I use ysQuiz.js
* No need any plugin - does not need any plugin or library.
* Easy to use - create the questions and start using it.
* Customizable - create wonders by customizing.

## How to use

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

### 1. Include ysQuiz on your site

```html
<script src="path/to/ysquiz.js"></script>
<!-- #optional -->
<link rel="stylesheet" href="path/to/ysquiz.css" />
<!-- #optional -->
```

### 2. Create HTML markup

ysQuiz uses the `<div class="ysquiz"></div>` element by default.

```html
<div class="ysquiz"></div>
```

### 3. Create Questions
Create questions in the following format.

```javascript
var myQuestions = [{
  question: "Question",
  answers: ["Answer 2", "Answer 1", "Answer 3"],
  correct: "Answer 4"
}, {
  question: "Question 2",
  answers: ["Answer 8", "Answer 7", "Answer 9"],
  correct: "Answer 6"
}];
```

### 4. Initialize ysQuiz
In the footer of your page, after the content, initialize ysQuiz. And that's it, you're done. Nice work!

```javascript
var myQuiz = new ysQuiz(myQuestions);
```

You can also look at the [examples](examples) directory for more

## ES6 Modules

ysQuiz does not have a default export, but does support CommonJS and can be used with native ES6 module imports.

```javascript
import('path/to/ysquiz.js')
  .then(function () {
    var myQuiz = new ysQuiz();
  });
``` 

It uses a UMD pattern, and should also work in most major module bundlers and package managers.

## Working with the Source Files

If you would prefer, you can work with the development code in the `src` directory using the included [Gulp build system](http://gulpjs.com/). This compiles and minifies code.

### Dependencies
Make sure these are installed first.

* [Node.js](http://nodejs.org)
* [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files.

## Options and Settings

ysQuiz includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into ysQuiz through the `init()` function:

```javascript
var myQuiz = new ysQuiz(myQuestions, {
  wrapper: ".ysquiz", // Quiz wrapper
  title: "ysQuiz", // Quiz title
  enumerator: true // If true, will be added number
});
```

### Use ysQuiz events in your own scripts

You can also call ysQuiz events in your own scripts.

#### init()
Initialize ysQuiz. This is called automatically when you setup your `new ysQuiz` object, but can be used to reinitialize your instance.

```javascript
var myQuiz = new ysQuiz();

myQuiz.init(myQuestions, {
  title: "my Quiz",
  enumerator: false
});
```

#### addQuestion()
Adds the new question.

```javascript
var myQuiz = new ysQuiz();

myQuiz.addQuestion("Question", ["Answer 2", "Answer 1", "Answer 3"], "Answer 4");
```

#### setup()
Setup the quiz template.

```javascript
var myQuiz = new ysQuiz();

myQuiz.addQuestion("Question", ["Answer 2", "Answer 1", "Answer 3"], "Answer 4");
myQuiz.setup();
```

#### destroy()
Destroy the current `ysQuiz.init()`. This is called automatically during the `init` function to remove any existing initializations.

```javascript
var myQuiz = new ysQuiz();

myQuiz.destroy();
```

## TODO

-

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details

Created by [Yusuf SEZER](http://www.yusufsezer.com)