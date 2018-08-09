(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.ysQuiz = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  //
  // Shared Variables
  //

  var defaults = {
    // Selectors
    wrapper: '.ysquiz',

    // Quiz title
    title: 'ysQuiz',

    // Quiz enumerator
    enumerator: true
  };

  //
  // Shared Methods
  //

  /**
   * Generates a random interger between two given values
   * @private
   * @param {Number} min Integer representing the lower bound of the range
   * @param {Number} max Integer representing the upper bound of the range
   * @return {Number} Randomly generated integer
   */
  var randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Check if browser supports required methods.
   * @private
   * @return {Boolean} Returns true if all required methods are supported.
   */
  var supports = function () {
    return (
      'querySelector' in document &&
      'addEventListener' in window &&
      'classList' in document.createElement('div')
    );
  };

  /**
   * Check `obj` is a HTMLElement.
   * @private
   * @param {Object} obj The obj to check.
   * @returns {Boolean} Returns `true` if `obj` is a HTMLElement, else `false`.
   */
  var isElement = function (obj) {
    return obj instanceof HTMLElement;
  };

  /**
   * Merge two or more objects. Returns a new object.
   * @private
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   objects  The objects to merge together
   * @returns {Object}          Merged values of defaults and options
   */
  var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;

  };

  //
  // Plugin Constructor
  //

  /** 
   * Plugin Object
   * @param {Array} questions Quiz questions
   * @param {Object} opts User settings
   * @constructor
   */
  var Plugin = function (questions, opts) {

    //
    // Plugin Variables
    //

    var publicAPIs = {};
    var settings = null;
    var quizQuestions = [];
    var stats = {
      currentQuestion: 0,
      finished: false,
      numOfCorrect: 0,
      numOfWrong: 0,
      //correctAnswers: [],
      //wrongAnswers: [],
      reset: function () {
        this.currentQuestion = 0;
        this.finished = false;
        //this.correctAnswers.length = 0;
        //this.wrongAnswers.length = 0;
      }
    };

    //
    // Plugin Methods
    //

    /**
     * Initialize Plugin.
     * @public
     * @param {Array} questions Quiz questions
     * @param {Object} options User settings
     */
    publicAPIs.init = function (questions, options) {

      // Feature test
      if (!supports()) throw 'ysQuiz: This browser does not support the required JavaScript methods and browser APIs.';

      // Destroy any existing initializations
      publicAPIs.destroy();

      // Merge settings into defaults
      settings = extend(defaults, options || {});

      // Select wrapper
      settings.wrapper = (typeof settings.wrapper === 'string') ? document.querySelector(settings.wrapper) : settings.wrapper;

      // Check if a valid element
      if (!isElement(settings.wrapper)) throw new TypeError('ysQuiz: Please select a valid quiz wrapper.');

      // Add wrapper style
      settings.wrapper.classList.add('ysquiz');

      // Add the questions
      if (Array.isArray(questions)) {
        for (var i = 0, qL = questions.length; i < qL; i++) {
          publicAPIs.addQuestion(questions[i].question, questions[i].answers, questions[i].correct);
        }
      }

      // Setup the quiz
      publicAPIs.setup();

    };

    /**
     * Adds the new question.
     * @public
     * @param {String} question Question
     * @param {Array} answers Question answers
     * @param {String} correctAnswer Correct answer
     */
    publicAPIs.addQuestion = function (question, answers, correctAnswer) {

      if (!Array.isArray(answers)) throw new TypeError('ysQuiz: Answers must be array.');

      quizQuestions.push(new Question(question, answers, correctAnswer));

    };

    /**
    * Setup the quiz template.
    * @public
    */
    publicAPIs.setup = function () {

      // If there are no questions and plugin isn't already initialized, cancel the setup.
      if (quizQuestions.length == 0 || !settings) return;

      // Create the quiz template
      var template = '<div class="ysquiz-header"><h1>' + settings.title + '</h1></div>';
      template += '<div class="ysquiz-content"><div class="ysquiz-question"></div></div>';
      template += '<div class="ysquiz-footer"><p class="ysquiz-message"></p></div>';
      settings.wrapper.innerHTML = template;

      // Start the question
      if (quizQuestions.length > 0) quizQuestions[stats.currentQuestion].render(settings.wrapper.querySelector('.ysquiz-question'));

    };

		/**
		 * Destroy the current initialization.
		 * @public
		 */
    publicAPIs.destroy = function () {

      // if plugin isn't already initialized, stop
      if (!settings) return;

      // Reset wrapper content
      settings.wrapper.innerHTML = null;

      // Reset variables
      settings = null;
      quizQuestions.length = 0;
      stats.reset();

    };

    //
    // Question Methods
    //

    /**
    * Question Object
    * @param {String} question Question
    * @param {Array} answers Question answers
    * @param {String} correctAnswer Correct answer
    * @constructor
    */
    var Question = function (question, answers, correctAnswer) {
      this.question = question;
      this.answers = answers;
      this.selected = -1;
      this.correctIndex = randomNumber(0, answers.length);
      answers.splice(this.correctIndex, 0, correctAnswer);
    };

    /**
     * Checks the answer
     * @public
     */
    Question.prototype.checkAnswer = function () {
      return this.selected == this.correctIndex;
    };

    /**
    * Creates question in `elem` field.
    * @param {HTMLElement} elem Rendering element
    * @public
    */
    Question.prototype.render = function (elem) {

      // Stores the scope
      var self = this;

      // Reset element content
      elem.innerHTML = null;

      // Create the question title
      elem.innerHTML += '<h3 class="ysquiz-question-title">' + ((settings.enumerator === true) ? ((stats.currentQuestion + 1) + '. ') : ('')) + ' ' + this.question + '</h3>';

      // Create the answers
      var answers = document.createElement('ul');
      for (var j = 0, aL = this.answers.length; j < aL; j++) {
        answers.innerHTML += '<li><label><input type="radio" name=question' + (stats.currentQuestion + 1) + ' />' + this.answers[j] + '</label></li>';
      }

      // Create the button
      var nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.addEventListener('click', function () {
        onClickEvent(this, self);
      });

      // Append the question
      elem.appendChild(answers);
      elem.appendChild(nextBtn);

    };

    /**
    * Click handler
    * @param {HTMLElement} elem clicked element
    * @param {Question} question Quiz question
    * @private
    */
    var onClickEvent = function (elem, question) {

      // Checks whether the quiz is finished
      if (stats.finished) {

        var template = '<div class="ysquiz-result">';
        template += '<h3>Result:</h3>';
        template += '<p class="ysquiz-total-question">' + quizQuestions.length + ' question</p>';
        template += '<p class="ysquiz-total-correct">' + stats.numOfCorrect + ' correct</p>';
        template += '<p class="ysquiz-total-wrong">' + stats.numOfWrong + ' wrong</p>';
        template += '</div>';
        settings.wrapper.querySelector('.ysquiz-content').innerHTML = template;

        return;
      }

      // Selects radio buttons
      var radioButtons = settings.wrapper.querySelectorAll('input[type=radio]');
      var messageElement = settings.wrapper.querySelector('.ysquiz-message');
      question.selected = getSelectedIndex(radioButtons);

      // Checks whether selection is made
      if (question.selected === -1) {
        messageElement.textContent = 'Please select a answer!';
        return;
      }

      messageElement.innerHTML = null;

      // Checks whether the correct answer is selected
      if (question.checkAnswer()) {
        stats.numOfCorrect++;
      } else {
        stats.numOfWrong++;
      }

      stats.currentQuestion++;

      // Checks whether the quiz is finished
      if (quizQuestions.length == stats.currentQuestion) {
        elem.textContent = 'Show Results';
        stats.finished = true;
        return;
      }

      // Render next question.
      if (quizQuestions.length > 0 && stats.currentQuestion < quizQuestions.length) quizQuestions[stats.currentQuestion].render(settings.wrapper.querySelector('.ysquiz-question'));

    };

    /**
    * Get the selected button index.
    * @param {Array} buttons to be checked
    * @private
    */
    var getSelectedIndex = function (buttons) {

      for (var i = 0, bL = buttons.length; i < bL; i++) {
        if (buttons[i].checked) return i;
      }

      return -1;
    };

    //
    // Initialize plugin
    //

    publicAPIs.init(questions, opts);

    //
    // Return the public APIs
    //

    return publicAPIs;

  };

  //
  // Return the Plugin
  //

  return Plugin;

});