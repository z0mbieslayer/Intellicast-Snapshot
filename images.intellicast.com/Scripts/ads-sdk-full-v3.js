(function (exports) {
'use strict';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function $inject_process_nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd() {
    return '/';
}
function chdir(dir) {
    throw new Error('process.chdir is not supported');
};
function umask() {
    return 0;
}

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = global$1.performance || {};
var performanceNow = performance$1.now || performance$1.mozNow || performance$1.msNow || performance$1.oNow || performance$1.webkitNow || function () {
    return new Date().getTime();
};

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance$1) * 1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor(clocktime % 1 * 1e9);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }
    return [seconds, nanoseconds];
}

var startTime = new Date();
function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
}

var process = {
    nextTick: $inject_process_nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var es6Promise = createCommonjsModule(function (module, exports) {
  /*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   4.1.0
   */

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
  })(commonjsGlobal, function () {
    'use strict';

    function objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
    }

    function isFunction(x) {
      return typeof x === 'function';
    }

    var _isArray = undefined;
    if (!Array.isArray) {
      _isArray = function _isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      _isArray = Array.isArray;
    }

    var isArray = _isArray;

    var len = 0;
    var vertxNext = undefined;
    var customSchedulerFn = undefined;

    var asap = function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (customSchedulerFn) {
          customSchedulerFn(flush);
        } else {
          scheduleFlush();
        }
      }
    };

    function setScheduler(scheduleFn) {
      customSchedulerFn = scheduleFn;
    }

    function setAsap(asapFn) {
      asap = asapFn;
    }

    var browserWindow = typeof window !== 'undefined' ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

    // node
    function useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function () {
        return $inject_process_nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      if (typeof vertxNext !== 'undefined') {
        return function () {
          vertxNext(flush);
        };
      }

      return useSetTimeout();
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function () {
        node.data = iterations = ++iterations % 2;
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function () {
        return channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      // Store setTimeout reference so es6-promise will be unaffected by
      // other code modifying setTimeout (like sinon.useFakeTimers())
      var globalSetTimeout = setTimeout;
      return function () {
        return globalSetTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];

        callback(arg);

        queue[i] = undefined;
        queue[i + 1] = undefined;
      }

      len = 0;
    }

    function attemptVertx() {
      try {
        var r = commonjsRequire;
        var vertx = r('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush = undefined;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
      scheduleFlush = attemptVertx();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function then(onFulfillment, onRejection) {
      var _arguments = arguments;

      var parent = this;

      var child = new this.constructor(noop);

      if (child[PROMISE_ID] === undefined) {
        makePromise(child);
      }

      var _state = parent._state;

      if (_state) {
        (function () {
          var callback = _arguments[_state - 1];
          asap(function () {
            return invokeCallback(_state, child, callback, parent._result);
          });
        })();
      } else {
        subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }

    /**
      `Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        resolve(1);
      });

      promise.then(function(value){
        // value === 1
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.resolve(1);

      promise.then(function(value){
        // value === 1
      });
      ```

      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    function resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(noop);
      _resolve(promise, object);
      return promise;
    }

    var PROMISE_ID = Math.random().toString(36).substring(16);

    function noop() {}

    var PENDING = void 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var GET_THEN_ERROR = new ErrorObject();

    function selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        GET_THEN_ERROR.error = error;
        return GET_THEN_ERROR;
      }
    }

    function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then) {
      asap(function (promise) {
        var sealed = false;
        var error = tryThen(then, thenable, function (value) {
          if (sealed) {
            return;
          }
          sealed = true;
          if (thenable !== value) {
            _resolve(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function (reason) {
          if (sealed) {
            return;
          }
          sealed = true;

          _reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          _reject(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        _reject(promise, thenable._result);
      } else {
        subscribe(thenable, undefined, function (value) {
          return _resolve(promise, value);
        }, function (reason) {
          return _reject(promise, reason);
        });
      }
    }

    function handleMaybeThenable(promise, maybeThenable, then$$) {
      if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        if (then$$ === GET_THEN_ERROR) {
          _reject(promise, GET_THEN_ERROR.error);
          GET_THEN_ERROR.error = null;
        } else if (then$$ === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then$$)) {
          handleForeignThenable(promise, maybeThenable, then$$);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function _resolve(promise, value) {
      if (promise === value) {
        _reject(promise, selfFulfillment());
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value, getThen(value));
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) {
        return;
      }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length !== 0) {
        asap(publish, promise);
      }
    }

    function _reject(promise, reason) {
      if (promise._state !== PENDING) {
        return;
      }
      promise._state = REJECTED;
      promise._result = reason;

      asap(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var _subscribers = parent._subscribers;
      var length = _subscribers.length;

      parent._onerror = null;

      _subscribers[length] = child;
      _subscribers[length + FULFILLED] = onFulfillment;
      _subscribers[length + REJECTED] = onRejection;

      if (length === 0 && parent._state) {
        asap(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) {
        return;
      }

      var child = undefined,
          callback = undefined,
          detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function ErrorObject() {
      this.error = null;
    }

    var TRY_CATCH_ERROR = new ErrorObject();

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value = undefined,
          error = undefined,
          succeeded = undefined,
          failed = undefined;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value.error = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          _reject(promise, cannotReturnOwn());
          return;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        _resolve(promise, value);
      } else if (failed) {
        _reject(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        _reject(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value) {
          _resolve(promise, value);
        }, function rejectPromise(reason) {
          _reject(promise, reason);
        });
      } catch (e) {
        _reject(promise, e);
      }
    }

    var id = 0;
    function nextId() {
      return id++;
    }

    function makePromise(promise) {
      promise[PROMISE_ID] = id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this._input = input;
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        _reject(this.promise, validationError());
      }
    }

    function validationError() {
      return new Error('Array Methods must be provided an Array');
    };

    Enumerator.prototype._enumerate = function () {
      var length = this.length;
      var _input = this._input;

      for (var i = 0; this._state === PENDING && i < length; i++) {
        this._eachEntry(_input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function (entry, i) {
      var c = this._instanceConstructor;
      var resolve$$ = c.resolve;

      if (resolve$$ === resolve) {
        var _then = getThen(entry);

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise) {
          var promise = new c(noop);
          handleMaybeThenable(promise, entry, _then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$) {
            return resolve$$(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function (state, i, value) {
      var promise = this.promise;

      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          _reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function (promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    /**
      `Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = resolve(2);
      let promise3 = resolve(3);
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = reject(new Error("2"));
      let promise3 = reject(new Error("3"));
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    function all(entries) {
      return new Enumerator(this, entries).promise;
    }

    /**
      `Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.

      Example:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```

      `Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      An example real-world use case is implementing timeouts:

      ```javascript
      Promise.race([ajax('foo.json'), timeout(5000)])
      ```

      @method race
      @static
      @param {Array} promises array of promises to observe
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    function race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!isArray(entries)) {
        return new Constructor(function (_, reject) {
          return reject(new TypeError('You must pass an array to race.'));
        });
      } else {
        return new Constructor(function (resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }

    /**
      `Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop);
      _reject(promise, reason);
      return promise;
    }

    function needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      let promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          let xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = resolve;
    Promise.reject = reject;
    Promise._setScheduler = setScheduler;
    Promise._setAsap = setAsap;
    Promise._asap = asap;

    Promise.prototype = {
      constructor: Promise,

      /**
        The primary way of interacting with a promise is through its `then` method,
        which registers callbacks to receive either a promise's eventual value or the
        reason why the promise cannot be fulfilled.

        ```js
        findUser().then(function(user){
          // user is available
        }, function(reason){
          // user is unavailable, and you are given the reason why
        });
        ```

        Chaining
        --------

        The return value of `then` is itself a promise.  This second, 'downstream'
        promise is resolved with the return value of the first promise's fulfillment
        or rejection handler, or rejected if the handler throws an exception.

        ```js
        findUser().then(function (user) {
          return user.name;
        }, function (reason) {
          return 'default name';
        }).then(function (userName) {
          // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
          // will be `'default name'`
        });

        findUser().then(function (user) {
          throw new Error('Found user, but still unhappy');
        }, function (reason) {
          throw new Error('`findUser` rejected and we're unhappy');
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
          // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
        });
        ```
        If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

        ```js
        findUser().then(function (user) {
          throw new PedagogicalException('Upstream error');
        }).then(function (value) {
          // never reached
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // The `PedgagocialException` is propagated all the way down to here
        });
        ```

        Assimilation
        ------------

        Sometimes the value you want to propagate to a downstream promise can only be
        retrieved asynchronously. This can be achieved by returning a promise in the
        fulfillment or rejection handler. The downstream promise will then be pending
        until the returned promise is settled. This is called *assimilation*.

        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // The user's comments are now available
        });
        ```

        If the assimliated promise rejects, then the downstream promise will also reject.

        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // If `findCommentsByAuthor` fulfills, we'll have the value here
        }, function (reason) {
          // If `findCommentsByAuthor` rejects, we'll have the reason here
        });
        ```

        Simple Example
        --------------

        Synchronous Example

        ```javascript
        let result;

        try {
          result = findResult();
          // success
        } catch(reason) {
          // failure
        }
        ```

        Errback Example

        ```js
        findResult(function(result, err){
          if (err) {
            // failure
          } else {
            // success
          }
        });
        ```

        Promise Example;

        ```javascript
        findResult().then(function(result){
          // success
        }, function(reason){
          // failure
        });
        ```

        Advanced Example
        --------------

        Synchronous Example

        ```javascript
        let author, books;

        try {
          author = findAuthor();
          books  = findBooksByAuthor(author);
          // success
        } catch(reason) {
          // failure
        }
        ```

        Errback Example

        ```js

        function foundBooks(books) {

        }

        function failure(reason) {

        }

        findAuthor(function(author, err){
          if (err) {
            failure(err);
            // failure
          } else {
            try {
              findBoooksByAuthor(author, function(books, err) {
                if (err) {
                  failure(err);
                } else {
                  try {
                    foundBooks(books);
                  } catch(reason) {
                    failure(reason);
                  }
                }
              });
            } catch(error) {
              failure(err);
            }
            // success
          }
        });
        ```

        Promise Example;

        ```javascript
        findAuthor().
          then(findBooksByAuthor).
          then(function(books){
            // found books
        }).catch(function(reason){
          // something went wrong
        });
        ```

        @method then
        @param {Function} onFulfilled
        @param {Function} onRejected
        Useful for tooling.
        @return {Promise}
      */
      then: then,

      /**
        `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
        as the catch block of a try/catch statement.

        ```js
        function findAuthor(){
          throw new Error('couldn't find that author');
        }

        // synchronous
        try {
          findAuthor();
        } catch(reason) {
          // something went wrong
        }

        // async with promises
        findAuthor().catch(function(reason){
          // something went wrong
        });
        ```

        @method catch
        @param {Function} onRejection
        Useful for tooling.
        @return {Promise}
      */
      'catch': function _catch(onRejection) {
        return this.then(null, onRejection);
      }
    };

    function polyfill() {
      var local = undefined;

      if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
      } else if (typeof self !== 'undefined') {
        local = self;
      } else {
        try {
          local = Function('return this')();
        } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
        }
      }

      var P = local.Promise;

      if (P) {
        var promiseToString = null;
        try {
          promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
          // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
          return;
        }
      }

      local.Promise = Promise;
    }

    // Strange compat..
    Promise.polyfill = polyfill;
    Promise.Promise = Promise;

    return Promise;
  });
  });

// import logatim from 'logatim';
/*
const _debug = logatim.debug;
const _warn = logatim.warn;
const _error = logatim.error;
*/

var Promise$1 = es6Promise.Promise;
var LOADED = 'loaded';
var COMPLETE = 'complete';
var scriptLoaded = function scriptLoaded(ele) {
  if (ele.readyState) {
    return ele.readyState === LOADED || ele.readyState === COMPLETE;
  }

  return true;
};

var getCookie = function getCookie(name) {
  var parts = ('; ' + document.cookie).split('; ' + name + '=');

  if (parts.length === 2) return parts.pop().split(';').shift();
};

var debug = function d() /* p1, p2 = [] */{
  // _debug(p1, ...p2, new Date());
};

var error = function e() /* p1, p2 = [] */{
  // _error(p1, ...p2, new Date());
};

var warn = function w() /* p1, p2 = [] */{
  // _warn(p1, ...p2, new Date());
};

var adCookie = function adCookie() {
  return getCookie('adstest');
};

var partnerCookie = function partnerCookie() {
  return getCookie('partner');
};

var firstView = function fv() {
  var _fv = parseInt(getCookie('fv'), 10) || 0;

  _fv = _fv >= 0 && _fv < 2 ? ++_fv : -1;
  document.cookie = 'fv=' + _fv + '; expires=' + new Date(new Date().getTime() + 30 * 60 * 1000).toUTCString() + ';path=/';

  return _fv;
};

var GDub = typeof window !== 'undefined' ? window : global$1;

var loadScript = function loadScript(src) {
  var attribs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise$1(function (resolve) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = src;
    Array.prototype.forEach.call(Object.keys(attribs), function (attr) {
      script[attr] = attribs[attr];
    });
    script.onerror = function () {
      debug('Functions > loadScript [%s] > failed', [src]);
      resolve();
    };

    script.onload = function () {
      if (scriptLoaded(script)) {
        debug('Functions > loadScript [%s] > success', [src]);
        resolve();
      }
    };
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === LOADED || script.readyState === COMPLETE) {
          resolve();
        }
      };
    }
    debug('Functions > loadScript [%s]', [src]);
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

var jsonp = function jsonp(url, async) {
  return new Promise$1(function (resolve) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    var script = document.createElement('script');
    var finalURL = url.replace(/=\?/, '=' + callbackName);

    GDub[callbackName] = function (data) {
      GDub[callbackName] = null;
      debug('Functions > jsonp [%s] > done', [finalURL]);
      resolve(data);
    };

    script.async = async;
    script.src = finalURL;
    debug('Functions > jsonp [%s]', [finalURL]);
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

var validateConfigs = function validateConfigs(configs) {
  configs.valid = true;
  return configs;
};

// TODO: revisit performance API usage here.
var activityTimer = function timer(name, description, relativeTo) {
  var type = 'timer';
  var t = {
    type: type,
    name: name,
    description: description
  };

  if (relativeTo > 0) {
    t.duration = new Date().getTime() - relativeTo;
    t.timerStart = relativeTo;
  } else {
    t.timerEnd = new Date().getTime();
  }

  debug('Timer - ', [t]);
  return t;
};

// TODO: revisit performance API usage here.
var activityCounter = function counter(name) {
  return {
    type: 'counter',
    name: name
  };
};

var getFullObject = function getFullObject(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return {};

  var filtered = {};

  Object.getOwnPropertyNames(obj).forEach(function (item) {
    if (!!obj[item]) {
      if (_typeof(obj[item]) === 'object') {
        Object.assign(filtered, getFullObject(obj[item]));
      } else {
        filtered[item] = obj[item] + '';
      }
    }
  });

  return filtered;
};

var uniquePositions = function uniquePositions() {
  var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var posIdMap = pos.map(function (p) {
    return p.id || p;
  });

  return pos.filter(function (value, index) {
    return posIdMap.indexOf(value.id || value) === index;
  });
};

var NL = 'nl';

var DEFAULT_BIDDER_TIMEOUT = 2000;

var getUrlParameter = function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);

  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var ThirdParty = function () {
  function ThirdParty() {
    classCallCheck(this, ThirdParty);
  }

  createClass(ThirdParty, [{
    key: 'run',


    /**
     * Alias for bid() method.
     */
    value: function run() {
      return this.bid();
    }
  }, {
    key: 'bid',
    value: function bid() {
      return Promise$1.resolve({});
    }
  }, {
    key: 'finish',
    value: function finish() {
      return Promise$1.resolve({});
    }
  }, {
    key: 'validateConfig',
    value: function validateConfig() {
      this.isConfigValid = true;
    }
  }, {
    key: 'getCustParams',
    value: function getCustParams() {
      return {};
    }
  }]);
  return ThirdParty;
}();

ThirdParty.Activity = [];
ThirdParty.startActivity = function (token) {
  var startRecord = ThirdParty.Activity.push(activityTimer('ad.' + token + ThirdParty.ACTIVITY_START, '' + token + ThirdParty.ACTIVITY_START));

  debug('ThirdParty.startActivity', ThirdParty.Activity);
  return ThirdParty.Activity[startRecord - 1];
};
ThirdParty.finishActivity = function (token, time) {
  var startRecord = ThirdParty.Activity.push(activityTimer('ad.' + token + ThirdParty.ACTIVITY_TIME, '' + token + ThirdParty.ACTIVITY_TIME, time));

  debug('ThirdParty.finishActivity', ThirdParty.Activity);
  return ThirdParty.Activity[startRecord - 1];
};
ThirdParty.progressActivity = function (token, type, time) {
  var startRecord = ThirdParty.Activity.push(activityTimer('ad.' + token + type, '' + token + type, time));

  debug('ThirdParty.progressActivity', ThirdParty.Activity);
  return ThirdParty.Activity[startRecord - 1];
};

ThirdParty.ACTIVITY_START = 'Start';
ThirdParty.ACTIVITY_TIME = 'Time';
ThirdParty.ACTIVITY_REQUEST = 'Request';
ThirdParty.ACTIVITY_NO_DATA = 'NoData';
ThirdParty.ACTIVITY_READY = 'Ready';
ThirdParty.ACTIVITY_TIMED_OUT = 'TimedOut';

/**
 * Created by sherwoos on 8/26/16.
 */
var THIRD_PARTY_TOKEN = 'amznslots';

var AmazonSlots = function (_ThirdParty) {
  inherits(AmazonSlots, _ThirdParty);

  function AmazonSlots(configs) {
    classCallCheck(this, AmazonSlots);

    var _this = possibleConstructorReturn(this, (AmazonSlots.__proto__ || Object.getPrototypeOf(AmazonSlots)).call(this));

    _this.cfgs = validateConfigs(configs);
    return _this;
  }

  createClass(AmazonSlots, [{
    key: 'bid',
    value: function bid() {
      var _this2 = this;

      var timeStart = void 0;
      var timer = void 0;

      ThirdParty.startActivity(THIRD_PARTY_TOKEN);
      debug('Amazon Slots - run');
      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          debug('Amazon Slots - run > timed out.');
          reject({ reason: 'timeout' });
        }, _this2.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        GDub.amznads = GDub.amznads || {};
        var asyncParams = {
          id: _this2.cfgs.amznId,
          callbackFn: function callbackFn() {
            debug('Amazon Slots - run > process bids');
            clearTimeout(timer);
            resolve(GDub.amznads);
          },
          timeout: _this2.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT
        };

        debug('Amazon Slots - run > loading script.');
        timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN, ThirdParty.ACTIVITY_REQUEST).timeEnd;
        if (typeof GDub.amznads.getAdsCallback === 'function') {
          // Clean up
          var f = document.querySelectorAll('script[src*="aax.amazon-adsystem.com/e/dtb/bid"]');

          Array.prototype.forEach.call(f, function (node) {
            return node.parentNode.removeChild(node);
          });
          return GDub.amznads.getAdsCallback(asyncParams.id, asyncParams.callbackFn, asyncParams.timeout);
        }
        loadScript('../c.amazon-adsystem.com/aax2/amzn_ads.js', { 'async': _this2.cfgs.async }).then(function () {
          debug('Amazon Slots - run > script loaded.');
          GDub.amznads.getAdsCallback(asyncParams.id, asyncParams.callbackFn, asyncParams.timeout);
        });
      }).then(function (amznads) {
        var targeting = amznads.getTargeting() || {};

        if (!amznads.hasAds() || !targeting) {
          // No Ads
          debug('Amazon Slots - run > no data');
          ThirdParty.progressActivity(THIRD_PARTY_TOKEN, ThirdParty.ACTIVITY_NO_DATA, timeStart);
          targeting = {};
        } else {
          ThirdParty.progressActivity(THIRD_PARTY_TOKEN, ThirdParty.ACTIVITY_READY, timeStart);
        }
        debug('Amazon Slots - run > process done');
        var amznslots = [].concat(targeting.amznslots).join(',') || NL;
        var amznVid = [].concat(targeting.amzn_vid).join(',') || NL;

        ThirdParty.finishActivity(THIRD_PARTY_TOKEN, timeStart);
        return {
          amznslots: amznslots,
          'amzn_vid': amznVid
        };
      }).catch(function (error) {
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error,
          payload: {
            amznslots: NL,
            'amzn_vid': NL
          }
        });
      });
    }
  }]);
  return AmazonSlots;
}(ThirdParty);

AmazonSlots.TOKEN = THIRD_PARTY_TOKEN;

function isLocalStorageSupported() {
  var testKey = 'test';
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, 'totoro');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

var _get = function _get(object, path) {
  if (!Array.isArray(path)) {
    path = path.split('.');
  }

  var index = 0;
  var length = path.length;

  while (object !== null && index < length) {
    object = object[path[index++]] || null;
  }

  return index && index === length ? object : undefined;
};

var prepareJStorage = function prepareJStorage() {
  if (isLocalStorageSupported() && localStorage.jStorage) {
    return JSON.parse(localStorage.jStorage);
  }

  return {};
};

var jStorage = {
  get: function get(path) {
    return _get(prepareJStorage(), path);
  },
  set: function set(path, value) {
    if (isLocalStorageSupported()) {
      var jStorage = prepareJStorage();
      var storage = window.localStorage;

      jStorage[path] = value;
      storage.setItem('jStorage', JSON.stringify(jStorage));
    }
  }
};

/**
 * Created by sherwoos on 8/26/16.
 */

var THIRD_PARTY_TOKEN$1 = 'lotame';
var lotameDataCollectionPromise = null;

var Lotame = function (_ThirdParty) {
  inherits(Lotame, _ThirdParty);

  function Lotame(configs) {
    classCallCheck(this, Lotame);

    var _this2 = possibleConstructorReturn(this, (Lotame.__proto__ || Object.getPrototypeOf(Lotame)).call(this));

    _this2.cfgs = validateConfigs(configs);
    debug('Construct Lotame');
    return _this2;
  }

  createClass(Lotame, [{
    key: 'finish',
    value: function finish() {
      var _this3 = this;

      debug('Lotame - Client > bid');
      var metrics = this.cfgs.params && this.cfgs.params.metrics && this.cfgs.params.metrics.split('index.html') || [];

      if (!lotameDataCollectionPromise) {
        lotameDataCollectionPromise = loadScript('../tags.crwdcntrl.net/c/1884/cce431.js?ns=_cc1884', { 'id': 'LOTCC_1884', 'defer': true }).then(function () {
          debug('Lotame - Client > :lotameDataCollectionPromise > load script success > done');
          return GDub._cc1884;
        });
      }

      lotameDataCollectionPromise.then(function (_cc1884) {
        debug('Lotam - Client > lotameDataCollectionPromise > _cc1884', [_cc1884]);
        if (_cc1884) {
          _cc1884.add('seg', 'level1_' + metrics[0]);
          _cc1884.add('seg', 'level2_' + metrics[1]);
          _cc1884.add('seg', 'level3_' + metrics[2]);
          _cc1884.add('seg', 'level4_' + metrics[3]);
          _cc1884.add('seg', 'dma_' + (_this3.cfgs.params && _this3.cfgs.params.location && _this3.cfgs.params.location.dmaCd));
          _cc1884.add('seg', 'zone_' + (_this3.cfgs.params && _this3.cfgs.params.adzone));
          _cc1884.add('seg', 'lang_' + (_this3.cfgs.params && _this3.cfgs.params.lang));
          _cc1884.bcp();
          debug('Lotame - Client > lotameDataCollectionPromise > fire bcp beacon');
        }
      }).catch(function () {
        return Promise$1.resolve({});
      });
    }
  }, {
    key: 'bid',
    value: function bid() {
      var _this4 = this;

      debug('Lotame - run');

      var timeStart = void 0;
      var timer = void 0;

      var _this = this;

      ThirdParty.startActivity(THIRD_PARTY_TOKEN$1);
      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          debug('Lotame > bid > timed out');

          var lotameStorage = jStorage.get('lotame');

          if (lotameStorage) {
            resolve(lotameStorage);
          } else {
            reject({ reason: 'timeout' });
          }
        }, _this4.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        debug('Lotame - run > load script');
        timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN$1, ThirdParty.ACTIVITY_REQUEST).timeEnd;

        _this4.bidProcessPromise = _this.bidProcess().then(function (data) {
          return resolve(data);
        });
      }).then(function (data) {
        clearTimeout(timer);

        debug('Lotame - run > done');
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$1, ThirdParty.ACTIVITY_READY, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$1, timeStart);

        return data;
      }).catch(function (error) {
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$1, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$1, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error,
          payload: {
            'tpid': NL,
            'lpid': NL,
            'sg': NL
          }
        });
      });
    }
  }, {
    key: 'bidProcess',
    value: function bidProcess() {
      var _this5 = this;

      return new Promise$1(function (resolve) {
        jsonp('//ad.crwdcntrl.net/5/c=' + _this5.cfgs.clientId + '/pe=y/callback=?', _this5.cfgs.async).then(function (data) {
          return resolve(data);
        });
      }).then(function (data) {
        var lotTpid = data && data.Profile && data.Profile.tpid;
        var lotPid = data && data.Profile && data.Profile.pid;
        var audience = data && data.Profile && data.Profile.Audiences && data.Profile.Audiences.Audience || [];
        var lotId = audience.map(function (v) {
          return v.id;
        }).join(',') || '';

        jStorage.set('lotameRaw', data);

        var result = {
          'tpid': lotTpid || NL,
          'lpid': lotPid || NL,
          'sg': lotId || NL
        };

        if (lotTpid || lotPid || lotId) {
          jStorage.set('lotame', result);
        }

        return result;
      });
    }
  }]);
  return Lotame;
}(ThirdParty);

Lotame.TOKEN = THIRD_PARTY_TOKEN$1;

/**
 * Created by scsherwood on 8/24/16.
 */

var THIRD_PARTY_TOKEN$2 = 'criteo';

var Criteo = function (_ThirdParty) {
  inherits(Criteo, _ThirdParty);

  function Criteo(configs) {
    classCallCheck(this, Criteo);

    var _this = possibleConstructorReturn(this, (Criteo.__proto__ || Object.getPrototypeOf(Criteo)).call(this));

    _this.cfgs = validateConfigs(configs);
    debug('Construct Criteo');
    return _this;
  }

  createClass(Criteo, [{
    key: 'bid',
    value: function bid() {
      var _this2 = this;

      var timeStart = void 0;
      var timer = void 0;

      debug('Criteo - run');
      ThirdParty.startActivity(THIRD_PARTY_TOKEN$2);
      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          debug('Criteo - run > timed out.');
          reject({ reason: 'timeout' });
        }, _this2.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN$2, ThirdParty.ACTIVITY_REQUEST).timeEnd;
        loadScript('../rtax.criteo.com/delivery/rta/rta1721.html?netId=' + _this2.cfgs.netId + '&cookieName=cto_weather&varName=crtg_content', { 'async': _this2.cfgs.async }).then(function () {
          return resolve(GDub.crtg_content);
        });
      }).then(function () {
        var crtgContent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { 'cig': NL };

        debug('Criteo - run > process bids');
        clearTimeout(timer);

        /**
         * Process cig variable for Criteo
         */
        var output = [];

        debug('Criteo - run > criteo content: ' + crtgContent);
        output = output.concat(crtgContent.split(';').reduce(function (memo, token) {
          if (token.match(/cig/)) {
            var splitCig = token.split('=');

            if (splitCig.length === 2) {
              memo.push(splitCig[1]);
            }
          }
          return memo;
        }, []));
        debug('Criteo - run > process bids done');
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$2, ThirdParty.ACTIVITY_READY, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$2, timeStart);
        return {
          'cig': output.join(',') || NL
        };
      }).catch(function (error) {
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$2, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$2, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error,
          payload: {
            'cig': NL
          }
        });
      });
    }
  }]);
  return Criteo;
}(ThirdParty);

Criteo.TOKEN = THIRD_PARTY_TOKEN$2;

var THIRD_PARTY_TOKEN$3 = 'factual';

var Factual = function (_ThirdParty) {
  inherits(Factual, _ThirdParty);

  function Factual(configs) {
    classCallCheck(this, Factual);

    var _this = possibleConstructorReturn(this, (Factual.__proto__ || Object.getPrototypeOf(Factual)).call(this));

    _this.cfgs = validateConfigs(configs);
    debug('Construct factual');
    return _this;
  }

  createClass(Factual, [{
    key: 'getCustParams',
    value: function getCustParams() {
      return Factual.custParams;
    }
  }, {
    key: 'validateConfig',
    value: function validateConfig(config) {
      this.isConfigValid = !!(config && config.params && config.params.lat && config.params.long && config.params.userId) || false;

      return this.isConfigValid;
    }
  }, {
    key: 'bid',
    value: function bid() {
      if (this.validateConfig(this.cfgs)) {
        // TODO realisation for sync bidProcess
        this.bidProcess();
      }

      return Promise$1.resolve({});
    }
  }, {
    key: 'bidProcess',
    value: function bidProcess() {
      var _this2 = this;

      var timeStart = void 0;
      var timer = void 0;

      ThirdParty.startActivity(THIRD_PARTY_TOKEN$3);
      var lat = this.cfgs.params.lat;
      var long = this.cfgs.params.long;
      var time = new Date().toISOString();

      time = time.replace(/\..*/, 'Z'); // Remove decimal value in seconds
      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          debug(THIRD_PARTY_TOKEN$3 + ' > bid > timed out');
          reject({ reason: 'timeout' });
        }, _this2.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        debug('Factual - run > load script');
        // window.bar.event('gps-location', 'gps-location', { lat, long });

        var req = new XMLHttpRequest();

        req.open('Redirectc1f0.html', 'https://location.wfxtriggers.com/geopulse/7620026f-cfb6-4d0c-9f8e-434ff0cd34d0?audience=true&amp;proximity=true', true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.onreadystatechange = function () {
          if (req.readyState === 4 && req.status === 200) {
            clearTimeout(timer);
            ThirdParty.progressActivity(THIRD_PARTY_TOKEN$3, ThirdParty.ACTIVITY_READY, timeStart);
            resolve(req.responseText);
          } else if (req.status >= 400) {
            reject({ reason: 'response failure' });
          }
        };
        try {
          timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN$3, ThirdParty.ACTIVITY_REQUEST).timeEnd;
          req.send('latitude=' + lat + '&longitude=' + long + '&timestamp=' + time + ('&twc-full=true&set=true&user-id=' + _this2.cfgs.params.userId));
        } catch (e) {
          reject({ reason: e });
        }
      }).then(function (data) {
        var proximityArray = [];
        var audienceArray = [];
        var set = [];

        var factual = JSON.parse(data);
        var proximity = factual && factual.proximity;
        var l = proximity && proximity.length < 25 ? proximity.length : 25 || 0;

        for (var i = 0; i < l; i++) {
          proximityArray.push(encodeURIComponent(proximity[i].filter));
        }
        var fgeo = proximityArray.join(',');

        // audience data is available in both audience and set
        // however, have only seen it in set
        var audience = factual && factual.set;

        l = audience && audience.length < 10 ? audience.length : 10 || 0;
        for (var _i = 0; _i < l; _i++) {
          audienceArray.push(encodeURIComponent(set[_i].group));
        }
        var faud = audienceArray.join(',');

        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$3, timeStart);
        Factual.custParams = { fgeo: fgeo, faud: faud };

        return Promise$1.resolve({ fgeo: fgeo, faud: faud });
      }).catch(function (error) {
        clearTimeout(timer);
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$3, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$3, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error
        });
      });
    }
  }]);
  return Factual;
}(ThirdParty);

Factual.TOKEN = THIRD_PARTY_TOKEN$3;
Factual.custParams = {};

var gptScript = '../www.googletagservices.com/tag/js/gpt.js';
var lsWeatherScript = '../js-sec.indexww.com/ht/p/182970-177411895682027.js';

var getLsScript = function getLsScript(url) {
  return url || lsWeatherScript;
};

var _instance = null;

var BaseConfig = function () {
  createClass(BaseConfig, null, [{
    key: "instance",
    value: function instance(settings) {
      if (_instance == null) {
        _instance = new BaseConfig(settings);
      }

      return _instance;
    }
  }]);

  function BaseConfig() {
    var _this = this;

    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, BaseConfig);

    Object.keys(settings).forEach(function (item) {
      _this[item] = settings[item];
    });
  }

  createClass(BaseConfig, [{
    key: "get",
    value: function get(key, defaultValue) {
      return this[key] || defaultValue;
    }
  }]);
  return BaseConfig;
}();

/**
 * Created by sherwoos on 8/26/16.
 */

var THIRD_PARTY_TOKEN$4 = 'index';

var IndexExchange = function (_ThirdParty) {
  inherits(IndexExchange, _ThirdParty);

  function IndexExchange(configs, useLsScript) {
    classCallCheck(this, IndexExchange);

    var _this = possibleConstructorReturn(this, (IndexExchange.__proto__ || Object.getPrototypeOf(IndexExchange)).call(this));

    var conf = BaseConfig.instance();

    _this.cfgs = validateConfigs(configs);
    _this.useLsScript = useLsScript;
    _this.url = getLsScript(conf.lsScriptUrl);
    debug('Construct Index Exchange');
    return _this;
  }

  createClass(IndexExchange, [{
    key: 'bid',
    value: function bid() {
      var _this2 = this;

      IndexExchange.BIDDING_DONE = false;

      debug('Index Exchange - run');

      var timer = void 0;
      var timeStart = void 0;

      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          reject({ reason: 'timeout' });
        }, _this2.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN$4, ThirdParty.ACTIVITY_REQUEST).timeEnd;

        var lightSpeed = window.index_headertag_lightspeed;

        if (!lightSpeed) {
          loadScript(_this2.url, { 'async': _this2.cfgs.async }).then(function () {
            debug('Index Exchange - run > script loaded');
            debug('Index Exchange - run > index_headertag_lightspeed', [window.index_headertag_lightspeed]);

            _this2.bidProcess(resolve);
          });
        } else {
          _this2.bidProcess(resolve);
        }
      }).then(function () {
        clearTimeout(timer);

        IndexExchange.BIDDING_DONE = true;

        debug('MT execLightSpeed -- add_session_end_hook');
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$4, ThirdParty.ACTIVITY_READY, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$4, timeStart);
        return {};
      }).catch(function (error) {
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$4, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$4, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error,
          payload: {}
        });
      });
    }
  }, {
    key: 'bidProcess',
    value: function bidProcess(resolve) {
      var lightSpeed = window.index_headertag_lightspeed;

      lightSpeed.add_session_end_hook(function () {
        resolve();
      }, true);

      lightSpeed.refresh();
    }
  }]);
  return IndexExchange;
}(ThirdParty);

IndexExchange.BIDDING_DONE = false;
IndexExchange.TOKEN = THIRD_PARTY_TOKEN$4;

IndexExchange.afterSlots = function (slots) {
  var lightSpeed = window.index_headertag_lightspeed;

  debug('MT execLightSpeed -- add_session_end_hook', [slots]);
  lightSpeed.set_slot_targeting(slots);
  debug('MT - execLightSpeed -- set_slot_targeting');
};

var THIRD_PARTY_TOKEN$5 = 'wfxtg';

/* Private helper functions. Do not need to be exported. */
function getVal(scatterSegs, idx, key, prop) {
  return scatterSegs[idx] && scatterSegs[idx][key] && scatterSegs[idx][key][0] && scatterSegs[idx][key][0][prop] || [];
}

/* End: Private helper functions */

var WeatherFxTriggers = function (_ThirdParty) {
  inherits(WeatherFxTriggers, _ThirdParty);

  function WeatherFxTriggers(configs) {
    classCallCheck(this, WeatherFxTriggers);

    var _this2 = possibleConstructorReturn(this, (WeatherFxTriggers.__proto__ || Object.getPrototypeOf(WeatherFxTriggers)).call(this));

    _this2.cfgs = validateConfigs(configs);
    debug('Construct WeatherFX Triggers');
    return _this2;
  }

  createClass(WeatherFxTriggers, [{
    key: 'bid',
    value: function bid() {
      var _this3 = this;

      if (WeatherFxTriggers.CURRENT_LOCATION !== this.cfgs.params.activeLocation) {
        WeatherFxTriggers.SPA_DATA = null;
      }

      WeatherFxTriggers.CURRENT_LOCATION = this.cfgs.params.activeLocation;

      if (WeatherFxTriggers.SPA_DATA) {
        return Promise$1.resolve(WeatherFxTriggers.SPA_DATA);
      }

      debug('WeatherFX Triggers - run');
      var timeStart = void 0;
      var timer = void 0;

      var _this = this;

      ThirdParty.startActivity(THIRD_PARTY_TOKEN$5);
      return new Promise$1(function (resolve, reject) {
        timer = setTimeout(function () {
          reject({ reason: 'timeout' });
        }, _this3.cfgs.timeout || DEFAULT_BIDDER_TIMEOUT);

        debug('WeatherFX Triggers - run > load script');
        timeStart = ThirdParty.progressActivity(THIRD_PARTY_TOKEN$5, ThirdParty.ACTIVITY_REQUEST).timeEnd;

        _this.bidProcess().then(function (data) {
          return resolve(data);
        });
      }).then(function (wfxtg) {
        debug('WeatherFX Triggers - run > load script done');
        clearTimeout(timer);

        debug('WeatherFX Triggers - run - done');
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$5, ThirdParty.ACTIVITY_READY, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$5, timeStart);

        return wfxtg;
      }).catch(function (error) {
        ThirdParty.progressActivity(THIRD_PARTY_TOKEN$5, ThirdParty.ACTIVITY_TIMED_OUT, timeStart);
        ThirdParty.finishActivity(THIRD_PARTY_TOKEN$5, timeStart);
        return Promise$1.reject({
          status: 'error',
          error: error,
          payload: {
            'wfxtg': NL,
            'zcs': NL,
            'nzcs': NL,
            'cxtg': NL
          }
        });
      });
    }
  }, {
    key: 'bidProcess',
    value: function bidProcess() {
      var _this4 = this;

      return new Promise$1(function (resolve) {
        jsonp('//triggers.wfxtriggers.com/json/?resp_type=json&current=true' + '&acctid=' + _this4.cfgs.acctid + '&zcs=' + _this4.cfgs.params.activeLocation + '&nzcs=' + _this4.cfgs.params.activeLocation + '&callback=?', _this4.cfgs.async).then(function (data) {
          return resolve(data.wfxtg);
        });
      }).then(function (wfxtg) {
        var triggers = wfxtg || {};
        var scatterSegs = [].concat(triggers.scatterSegs || ['']);

        var result = {
          'wfxtg': [].concat(wfxtg.current || ['']).join(',') || NL,
          'zcs': getVal(scatterSegs, 0, 'zcs', 'segments').join(',') || NL,
          'nzcs': getVal(scatterSegs, 1, 'nzcs', 'segments').join(',') || NL,
          'cxtg': getVal(scatterSegs, 0, 'zcs', 'cxtg').join(',') || NL
        };

        if (wfxtg) {
          WeatherFxTriggers.SPA_DATA = result;
        }

        return result;
      });
    }
  }]);
  return WeatherFxTriggers;
}(ThirdParty);

WeatherFxTriggers.TOKEN = THIRD_PARTY_TOKEN$5;
WeatherFxTriggers.SPA_DATA = null;
WeatherFxTriggers.CURRENT_LOCATION = null;

var gptCmd = function gptCmd(cb) {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  return window.googletag.cmd.push(cb);
};

var refreshSlots = function refreshSlots($slots) {
  return gptCmd(function () {
    window.googletag.pubads().refresh($slots);
  });
};

var SUCCESS = [Promise$1.resolve({})];
var THIRD_PARTY = {};

// Custom Targeting parameters that will not be changed
// for the life of this instance.
// const CUST_PARAMS = {};

THIRD_PARTY[WeatherFxTriggers.TOKEN] = WeatherFxTriggers;
THIRD_PARTY[Criteo.TOKEN] = Criteo;
THIRD_PARTY[AmazonSlots.TOKEN] = AmazonSlots;
THIRD_PARTY[Lotame.TOKEN] = Lotame;
THIRD_PARTY[Factual.TOKEN] = Factual;
THIRD_PARTY[IndexExchange.TOKEN] = IndexExchange;

var MoneyTreeBase = function () {
  function MoneyTreeBase() {
    classCallCheck(this, MoneyTreeBase);

    this.asyncThirdParties = [];
    this.bidProcessPromises = {};
  }

  /**
   *  Returns a promise whose resolved value is the current set
   *  DFP defined Ad slots. The promise ensures that GPT is loaded
   *  before attempting to access the GPT Api in an unsafe manner.
   */


  createClass(MoneyTreeBase, [{
    key: 'getSlots',
    value: function getSlots() {
      return new Promise$1(function (resolve) {
        return gptCmd(function () {
          return resolve(window.googletag.pubads().getSlots() || []);
        });
      });
    }
  }, {
    key: 'isGptLoaded',
    value: function isGptLoaded() {
      return window.googletag && window.googletag.apiReady;
    }
  }, {
    key: 'isGptPubadsReady',
    value: function isGptPubadsReady() {
      return window.googletag && window.googletag.pubadsReady;
    }

    /**
     * Executes the configured third party services. Call this method prior to shake()
     * to aquire third party targeting parameter.
     *
     * @param bidderConfigs [Object]
     */

  }, {
    key: 'startBidding',
    value: function startBidding() {
      var _this = this;

      var bidderConfigs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.asyncThirdParties = [];
      debug('Money Maker - startBidding', bidderConfigs);
      var iou = [].concat(SUCCESS).concat(bidderConfigs.map(function (bidder) {
        return _this.bid(bidder.id, bidder);
      }));

      return Promise$1.all(iou).then(function () {
        var asyncCustParams = {};

        _this.asyncThirdParties.forEach(function (item) {
          Object.assign(asyncCustParams, item.getCustParams());
        });

        var targetingParams = Object.assign.apply(Object, [{}, asyncCustParams].concat(toConsumableArray(arguments.length <= 0 ? undefined : arguments[0])));

        debug('MT - execThirdParties - done', [targetingParams]);
        return targetingParams;
      });
    }
  }, {
    key: 'biddingSlotLevel',
    value: function biddingSlotLevel(thirdPartyConfigs) {
      var _this2 = this;

      var slotLevelBidders = thirdPartyConfigs.filter(function (bidder) {
        return THIRD_PARTY[bidder.id] && THIRD_PARTY[bidder.id].afterSlots;
      });

      var iou = [].concat(SUCCESS).concat(slotLevelBidders.map(function (bidder) {
        return _this2.bid(bidder.id, bidder);
      }));

      return Promise$1.all(iou);
    }
  }, {
    key: 'biddingAfterSlots',
    value: function biddingAfterSlots(thirdPartyConfigs, slots) {
      var afterSlotBidders = thirdPartyConfigs.filter(function (bidder) {
        return THIRD_PARTY[bidder.id] && THIRD_PARTY[bidder.id].afterSlots && THIRD_PARTY[bidder.id].BIDDING_DONE;
      });

      afterSlotBidders.map(function (bidder) {
        return THIRD_PARTY[bidder.id].afterSlots(slots);
      });
    }

    /**
     * Alias for startBidding
     */

  }, {
    key: 'execThirdParties',
    value: function execThirdParties() {
      var thirdPartyConfigs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      return this.startBidding(thirdPartyConfigs);
    }

    /**
     * Execute third party service as defined by the id using the
     * supplied config data.
     */

  }, {
    key: 'bid',
    value: function bid(id, configs) {
      var _this3 = this;

      var thirdParty = THIRD_PARTY[id] && new THIRD_PARTY[id](configs);

      if (thirdParty && thirdParty.cfgs.asyncRequest) {
        this.asyncThirdParties.push(thirdParty);
      }
      debug('MT - execThirdParty - ', [thirdParty]);
      if (thirdParty) {
        return new Promise$1(function (resolve) {
          thirdParty.run().then(function (data) {
            debug('MT - run - done', [id, data]);
            _this3.AUDIT.thirdPartyTargeting[id] = data;

            if (thirdParty.bidProcessPromise) {
              _this3.bidProcessPromises[thirdParty.cfgs.id] = thirdParty.bidProcessPromise;
            }

            resolve(data);
            thirdParty.finish();
          }).catch(function (err) {
            if (thirdParty.bidProcessPromise) {
              _this3.bidProcessPromises[thirdParty.cfgs.id] = thirdParty.bidProcessPromise;
            }
            thirdParty.finish();
            warn('MT - run - failed execution', [id, err]);
            _this3.AUDIT.thirdPartyTargeting[id] = err;
            resolve(err.payload || {});
          });
        });
      }

      debug('MT - execThirdParty - done - no thirdParty for id %s', [id]);
      this.AUDIT.thirdPartyTargeting[id] = {
        status: 'error',
        error: {
          reason: 'does not exist'
        } };

      return SUCCESS[0];
    }

    /**
     * Alias for MoneyTree.bid()
     * @param id [String]
     * @param configs [Object]
     */

  }, {
    key: 'execThirdParty',
    value: function execThirdParty(id, configs) {
      return this.bid(id, configs);
    }
  }, {
    key: 'initVendorScript',
    value: function initVendorScript() {}
  }]);
  return MoneyTreeBase;
}();

var Monitor = function () {
  function Monitor() {
    classCallCheck(this, Monitor);
  }

  createClass(Monitor, null, [{
    key: 'init',
    value: function init() {
      MoneyTree.Activity = [];
      ThirdParty.Activity = [];
      Monitor.activityStartTime = Monitor.startActivity().startTime;
      Monitor.dirty = false;
      Monitor.requestHandled = false;
    }
  }, {
    key: 'monitorSlotRenderEnded',
    value: function monitorSlotRenderEnded(evt) {
      var slot = evt.slot,
          creativeId = evt.creativeId,
          lineItemId = evt.lineItemId;

      var sponsorId = slot.getSlotElementId();

      if (!Monitor.requestHandled) {
        Monitor.progressActivity('ad.request', 'Time it takes to fire ad call and get back a rendered ad.');
        Monitor.requestHandled = true;
      }
      Monitor.progressActivity('ad.' + sponsorId + '.render', sponsorId + '|cid:' + creativeId + '|lid:' + lineItemId);
    }
  }, {
    key: 'monitorSlotOnload',
    value: function monitorSlotOnload(evt) {
      var slot = evt.slot;

      var sponsorId = slot.getSlotElementId();

      Monitor.progressActivity('ad.' + sponsorId + '.display', sponsorId, Monitor.activityStartTime);
    }
  }, {
    key: 'monitorSlotImpressionViewable',
    value: function monitorSlotImpressionViewable(evt) {
      var slot = evt.slot;

      var sponsorId = slot.getSlotElementId();

      Monitor.countActivity('ad.' + sponsorId + '.viewable');
    }
  }, {
    key: 'monitorGptActivity',
    value: function monitorGptActivity() {
      if (!Monitor.listenersAttached) {
        window.googletag.pubads().addEventListener('slotRenderEnded', Monitor.monitorSlotRenderEnded);
        window.googletag.pubads().addEventListener('slotOnload', Monitor.monitorSlotOnload);
        window.googletag.pubads().addEventListener('impressionViewable', Monitor.monitorSlotImpressionViewable);

        Monitor.listenersAttached = true;
      }
    }
  }, {
    key: 'monitorPubAdsCall',
    value: function monitorPubAdsCall() {
      if (!Monitor.dirty) {
        Monitor.dirty = Monitor.progressActivity('ad.pubadsCall', 'pubadsCall');
      }
    }
  }, {
    key: 'startActivity',
    value: function startActivity() {
      var startIndex = MoneyTree.Activity.push(activityTimer('ad.start', 'New page view'));

      debug('MoneyTree.startActivity', MoneyTree.Activity);
      return MoneyTree.Activity[startIndex - 1];
    }
  }, {
    key: 'progressActivity',
    value: function progressActivity(token, description) {
      MoneyTree.Activity.push(activityTimer(token, description));
      debug('MoneyTree.progressActivity', [token, description, MoneyTree.Activity]);
    }
  }, {
    key: 'countActivity',
    value: function countActivity(token) {
      MoneyTree.Activity.push(activityCounter(token));
      debug('MoneyTree.progressActivity', [token, MoneyTree.Activity]);
    }
  }]);
  return Monitor;
}();

Monitor.dirty = false;

Monitor.listenersAttached = false;

Monitor.activityStartTime = null;

var getScreenSize = function getScreenSize() {
  var browserWidth = window.innerWidth || document.body.clientWidth;

  if (browserWidth < 768) return 'mobile';
  if (browserWidth < 1025) return 'tablet';
  return 'desktop';
};

var labContent = {
  reset: function reset() {
    var labContent = getScreenSize() === 'mobile' ? '#mobileWeb_labContent' : '#labContent';
    var labContentLandscape = getScreenSize() === 'mobile' ? '#mobileWeb_labContentLandscape' : null;
    var labBG = getScreenSize() === 'mobile' ? '#mobileWeb_labBG' : '#labBG';

    try {
      var elLabContent = document.querySelector(labContent);
      var elLabBG = document.querySelector(labBG);
      var elLabContentLandscape = document.querySelector(labContentLandscape);

      if (elLabContent) {
        elLabContent.parentNode.removeChild(elLabContent);
        elLabBG.removeAttribute('style');
      }
      if (elLabContentLandscape) {
        elLabContentLandscape.parentNode.removeChild(elLabContentLandscape);
      }
    } catch (err) {
      error('labContent reset failed', [err]);
    }
  }
};

/**
 * MoneyTree: This Ads controller class can be used indepently to request
 * Ads for the page. This implementation uses GPT or
 * the Lightspeed library provided by Index Exchange.
 *
 *  Tight Coupling:
 *    Google -- GPT: TODO: abstract???
 *    IndexExchange -- Lightspeed: TODO: abstract???
 */
var TfmMoneyTreeAdapter = function (_MoneyTreeBase) {
  inherits(TfmMoneyTreeAdapter, _MoneyTreeBase);

  /**
   * @param useLightSpeed [Boolean] Flag to indicate wether too use LightSpeed.
   *        Default to true.
   * @param NCTAU [String] Network Code, Targeted Ad Unit
   * @param deviceClass [String] mobile, tablet, desktop
   */
  function TfmMoneyTreeAdapter() {
    classCallCheck(this, TfmMoneyTreeAdapter);

    var _this = possibleConstructorReturn(this, (TfmMoneyTreeAdapter.__proto__ || Object.getPrototypeOf(TfmMoneyTreeAdapter)).call(this));

    debug('MoneyTree - create.');
    _this.indexExchPromise = Promise$1.reject().catch();
    _this.TFMtags = [];
    return _this;
  }

  /**
   * Call reset to setup for a new pageview.
   */


  createClass(TfmMoneyTreeAdapter, [{
    key: 'reset',
    value: function reset(NCTAU, deviceClass) {
      this.NCTAU = NCTAU;
      this.deviceClass = deviceClass;
      // delete window.TFM;
      if (this.isGptPubadsReady()) {
        gptCmd(function () {
          labContent.reset();
          window.googletag.pubads().getSlots().forEach(function (slot) {
            return window.TFM.Tag.destroy(slot.getSlotElementId());
          });

          window.googletag.pubads().updateCorrelator();
        });
      }
      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];

      Monitor.init();

      this.AUDIT = {
        positions: [],
        slots: [],
        customTargeting: [],
        thirdPartyTargeting: {},
        NCTAU: NCTAU
      };

      gptCmd(function () {
        Monitor.monitorGptActivity();
      });

      this.initVendorScript();

      return this;
    }
  }, {
    key: 'prepareAdSlots',
    value: function prepareAdSlots() {
      // TFM will not use prepareAdSlots
      // debug('prepareAdSlots', this.NCTAU, positions);
      // initSlots(this.NCTAU, positions);
      return this;
    }

    /**
     * Request creatives. shake your money tree.
     *
     * @param $positions [Array]
     * @param $custParams [Array]
     * @param mergeParams [Boolean]. Hook for AdScript shake call where Object.assign is not supported
     */

    // TODO: need new method for lazyload ads.

  }, {
    key: 'shake',
    value: function shake($positions, $custParams, mergeParams) {
      var custParam = $custParams;

      if (mergeParams) {
        custParam = getFullObject(Object.assign.apply(Object, [{}].concat(toConsumableArray($custParams))));
      }

      gptCmd(function () {
        makeItRain(custParam);
      });

      // TODO: May screw up timing for lazy-load or second-batch Ads.
      this.readyPromise = loadSlots($positions);

      return this.readyPromise;
    }
  }, {
    key: 'displayAdPositions',
    value: function displayAdPositions(positions) {
      var _this2 = this;

      var $promise = this.readyPromise || Promise$1.resolve({});

      $promise.then(function () {
        Promise$1.all([_this2.GPTContainerPromise, _this2.TFMEnginePromise]).then(function () {
          positions.forEach(function (position) {
            _this2.TFMtags.push(window.TFM.Tag.getAdTag(position.string, position.id));
          });
          Monitor.monitorPubAdsCall();
        });
      });
    }
  }, {
    key: 'displayAd',
    value: function displayAd(positionId) {
      Promise$1.all([this.GPTContainerPromise, this.TFMEnginePromise]).then(function () {
        var TFM = window.TFM;

        TFM.Tag.getAdTag(positionId, positionId);
      });
    }
  }, {
    key: 'initVendorScript',
    value: function initVendorScript() {
      var NCTAUstr = this.NCTAU.adUnit + '/' + this.NCTAU.adZone;
      var adUnits = NCTAUstr && NCTAUstr.split('index.html');

      if (Array.isArray(adUnits)) {

        var l = adUnits.length;
        var i = void 0;

        for (i = 0; i < l; i++) {
          window['adsc_adunit' + (i + 1)] = adUnits[i];
        }
      }
      window.adsc_mode = 'infinite';
      window.adsc_layout = 'artikel';
      window.adsc_device = this.deviceClass === 'mobile' ? 'smartphone' : this.deviceClass;
      window.adsc_mobile = (this.deviceClass === 'mobile' || this.deviceClass === 'tablet') && true || false;
      gptCmd(function () {
        return window.googletag.pubads().collapseEmptyDivs();
      });

      if (!(window.TFM && window.TFM.apiReady)) {
        this.GPTContainerPromise = loadScript('../a.bf-ad.net/pubjs/weather/container.js');
        this.TFMEnginePromise = loadScript('../a.bf-ad.net/pubjs/weather/adengine.js');
      }
    }

    /**
     * Request creatives. shake your money tree.
     *
     * @param $positions [Array]
     * @param targetMap [Object] - hash map of key,value targeting pairs
     */

  }, {
    key: 'refresh',
    value: function refresh($positions, targetMap) {
      var _this3 = this;

      var positionIds = $positions.map(function (v) {
        return v.id;
      });

      gptCmd(function () {
        var $slots = window.googletag.pubads().getSlots().filter(function (slot) {
          return positionIds.indexOf(slot.getSlotElementId()) > -1;
        }) || [];

        if (!targetMap) return refreshSlots($slots);
        _this3.shake($positions, targetMap).then(function () {
          return refreshSlots($slots);
        });
      });
    }

    /**
     * Adding new slots. Use displayAdPositions. Keep for consistency with gptMoneyTree.
     */

  }, {
    key: 'addSlots',
    value: function addSlots() {
      return new Promise$1(function (resolve) {
        return resolve();
      });
    }
  }]);
  return TfmMoneyTreeAdapter;
}(MoneyTreeBase);

// const loadSlots = ($lightSpeedPromise, lightspeedRefreshCalled) => {
// TFM will not use lightSpeed

var loadSlots = function loadSlots() {
  // Not used by TFM
  firstView(); // TODO: convert to redux action
  debug('loadSlots');
  return new Promise$1(function (resolve) {
    return resolve();
  });
};

var makeItRain = function makeItRain(cashDrawer) {
  var TFM = window.TFM;

  (Object.keys(cashDrawer) || []).forEach(function (key) {
    return TFM.Tag.setTagVar(key, cashDrawer[key]);
  });
};

/**
 * MoneyTree: This Ads controller class can be used indepently or in conjunction with
 * the wxonwxoff library to request Ads for the page. This implementation uses GPT or
 * the Lightspeed library provided by Index Exchange.
 */
// Custom Targeting parameters that will not be changed
// for the life of this instance.
// const CUST_PARAMS = {};

var GptMoneyTreeAdapter = function (_MoneyTreeBase) {
  inherits(GptMoneyTreeAdapter, _MoneyTreeBase);

  /**
   * @param useLightSpeed [Boolean] Flag to indicate wether too use LightSpeed.
   *        Default to true.
   * @param NCTAU [Object] Network Code, Targeted Ad Unit
   * @param deviceClass [String] mobile, tablet, desktop
   */
  function GptMoneyTreeAdapter() {
    var useLightSpeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var useVendorScripts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    classCallCheck(this, GptMoneyTreeAdapter);

    var _this = possibleConstructorReturn(this, (GptMoneyTreeAdapter.__proto__ || Object.getPrototypeOf(GptMoneyTreeAdapter)).call(this));

    _this.useVendorScripts = useVendorScripts;

    // Reset GPT
    if (useVendorScripts) {
      _this.initVendorScript();
    }

    debug('MT - create.', [useLightSpeed]);
    // const browser = clientBrowserToAdTargeting();
    // const platform = deviceClassToAdPlatformTargeting(deviceClass);

    _this.vendorScriptLoadRequested = false;

    // These targeting params will are static throughout
    // the life of this instance.
    // CUST_PARAMS.browser = browser;
    // CUST_PARAMS.plat = platform;
    return _this;
  }

  /**
   * Call reset to setup for a new pageview.
   */


  createClass(GptMoneyTreeAdapter, [{
    key: 'reset',
    value: function reset(NCTAU, deviceClass) {
      var adsTest = adCookie();
      var networkCode = NCTAU.networkCode,
          adUnit = NCTAU.adUnit;

      var adsTestModifier = adsTest ? 'test_' : '';
      var NCAU_STR = networkCode + '/' + adsTestModifier + adUnit;

      // Cleanup any existing creatives
      if (this.isGptPubadsReady()) {
        gptCmd(function () {
          labContent.reset();
          window.googletag.destroySlots();
          window.googletag.pubads().updateCorrelator();
        });
      }

      if (!window.googletag) {
        window.googletag = {};
        window.googletag.cmd = [];
      }

      // Reset Metrics
      Monitor.init();

      // Start gathering GPT activity data
      gptCmd(function () {
        Monitor.monitorGptActivity();
      });

      // Reset MoneyTree initial state
      this.NCTAU = NCTAU;
      this.deviceClass = deviceClass;
      this.adsTest = adsTest;
      this.firstView = firstView();
      this.partner = getUrlParameter('par') || partnerCookie();
      this.custParams = {
        adstest: this.adsTest || '',
        vw: '' + this.firstView || '',
        ad_unit: NCAU_STR,
        par: this.partner || ''
      };
      this.AUDIT = {
        positions: [],
        slots: [],
        customTargeting: [],
        thirdPartyTargeting: {},
        NCTAU: NCTAU
      };

      // Allow method call chaining
      return this;
    }

    /**
     *
     */

  }, {
    key: 'prepareAdSlots',
    value: function prepareAdSlots(positions, onSlotsHandler) {
      debug('MT - prepareAdSlots', [this.NCTAU, this.adsTest, positions]);
      var _NCTAU = this.NCTAU,
          networkCode = _NCTAU.networkCode,
          adUnit = _NCTAU.adUnit,
          adZone = _NCTAU.adZone;

      var adsTestModifier = !!this.adsTest ? 'test_' : '';
      var NCTAU_STR = networkCode + '/' + adsTestModifier + adUnit + '/' + adZone;
      var AUDIT = this.AUDIT;

      this.slotsReady = new Promise$1(function (resolve) {
        return gptCmd(function () {
          var slots = initGptSlots(NCTAU_STR, positions);

          AUDIT.NCTAU_STR = NCTAU_STR;
          AUDIT.positions.push(positions);
          AUDIT.slots.push(slots);

          onSlotsHandler(slots);

          resolve(slots);
        });
      });

      this.gptInitialized = true;

      return this;
    }

    /**
     * Request creatives. shake your money tree.
     *
     * @param $positions [Array]
     * @param $custParams [Array]
     * @param mergeParams [Boolean]. Hook for AdScript shake call where Object.assign is not supported
     */

  }, {
    key: 'shake',
    value: function shake($positions, $custParams, mergeParams) {
      var _this2 = this;

      var custParam = $custParams;

      if (mergeParams) {
        custParam = Object.assign.apply(Object, [{}].concat(toConsumableArray($custParams)));
      }
      return new Promise$1(function (resolve) {
        _this2.setupCustomTargeting(custParam);
        resolve();
      });
    }
  }, {
    key: 'displayAdPositions',
    value: function displayAdPositions(positions) {
      var positionIds = positions.map(function (position) {
        return position.id || position;
      });

      this.slotsReady.then(function () {
        gptCmd(function () {
          var gptSlotsToRefresh = [];
          var gptSlots = window.googletag.pubads().getSlots();

          positionIds.forEach(function (id) {
            gptSlots.forEach(function (slot) {
              if (slot.getSlotElementId() === id) {
                window.googletag.display(id);
                gptSlotsToRefresh.push(slot);
              }
            });
          });

          if (gptSlotsToRefresh.length) refreshSlots(gptSlotsToRefresh);
          Monitor.monitorPubAdsCall();
        });
      });
    }

    /**
     *
     */

  }, {
    key: 'displayAd',
    value: function displayAd(positionId) {
      var $promise = Promise$1.all([this.readyPromise || Promise$1.resolve({}), this.slotsReady || Promise$1.resolve({})]);

      $promise.then(function () {
        gptCmd(function () {
          window.googletag.display(positionId);
          Monitor.monitorPubAdsCall();
        });
      });
    }
  }, {
    key: 'initVendorScript',
    value: function initVendorScript() {
      if (!this.isGptLoaded() && !this.vendorScriptLoadRequested) {
        loadScript(gptScript, { 'async': true });
        this.vendorScriptLoadRequested = true;
      }
    }

    /**
     * Alias for MoneyTree.shake() method
     */

  }, {
    key: 'setupCustomTargeting',
    value: function setupCustomTargeting(custParams) {
      var _this3 = this;

      debug('MT - setupCustomTargeting', [custParams]);
      var customTargeting = getFullObject(Object.assign({},
      // CUST_PARAMS,
      this.custParams, custParams));

      gptCmd(function () {
        setupGptCustomTargeting(customTargeting);
        _this3.AUDIT.customTargeting.push(customTargeting);
      });

      return customTargeting;
    }

    /**
     * Request creatives. shake your money tree.
     *
     * @param $positions [Array]
     * @param targetMap [Object] - hash map of key,value targeting pairs
     */

  }, {
    key: 'refresh',
    value: function refresh($positions) {
      var _this4 = this;

      var targetMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var onSlotsHandler = arguments[2];

      var positionIds = $positions.map(function (v) {
        return v.id;
      });

      gptCmd(function () {
        var $slots = window.googletag.pubads().getSlots().filter(function (slot) {
          return positionIds.indexOf(slot.getSlotElementId()) > -1;
        }) || [];

        _this4.shake($positions, targetMap).then(function () {
          return onSlotsHandler($slots);
        }).then(function () {
          return refreshSlots($slots);
        });
      });
    }

    /**
     * Creates new slots
     *
     * @param $positions [Array]
     */

  }, {
    key: 'addSlots',
    value: function addSlots(biddingPromise, onSlotsHandler) {
      var _NCTAU2 = this.NCTAU,
          networkCode = _NCTAU2.networkCode,
          adUnit = _NCTAU2.adUnit,
          adZone = _NCTAU2.adZone;

      var adsTestModifier = !!this.adsTest ? 'test_' : '';
      var NCTAU_STR = networkCode + '/' + adsTestModifier + adUnit + '/' + adZone;

      if (!this.gptInitialized) {
        initGptSlots(NCTAU_STR, []);
        this.gptInitialized = true;
      }

      this.slotsReady = new Promise$1(function (resolve) {
        biddingPromise.then(function (results) {
          var $positions = results[0];

          gptCmd(function () {
            var slots = $positions.map(function ($position) {
              return window.googletag.defineSlot(NCTAU_STR, $position.sizes, $position.id).addService(window.googletag.pubads()).setTargeting('pos', $position.pos);
            });

            onSlotsHandler(slots);

            resolve();
          });
        });
      });

      return this;
    }
  }]);
  return GptMoneyTreeAdapter;
}(MoneyTreeBase);

// const deviceClassToAdPlatformTargeting = (deviceClass) => {
//   if (deviceClass === 'mobile') {
//     return 'wx_mw';
//   } else if (deviceClass === 'tablet') {
//     return 'wx_tab';
//   }
//
//   return 'wx';
// };

// const clientBrowserToAdTargeting = () => {
//   const userAgent = (typeof navigator !== 'undefined') && navigator.userAgent;
//   const browser = userAgent && userAgent.match(/chrome|firefox|safari|trident/i);
//
//   if (Array.isArray(browser)) {
//     switch (browser[0].toLowerCase()) {
//
//       case 'chrome':
//         return 'twcchrome';
//       case 'firefox':
//         return 'twcff';
//       case 'safari':
//         return 'twcsafari';
//       case 'trident':
//         return 'twcie';
//       default:
//         return 'twcnative';
//     }
//   }
//
//   return 'nl';
// };

var initGptSlots = function initGptSlots(NCTAU, $positions) {
  var conf = BaseConfig.instance();
  var positions = $positions;
  var haveCompanion = positions.some(function (item) {
    return item.companion;
  });

  var slots = positions.map(function (position) {
    var slot = window.googletag.defineSlot(NCTAU, position.sizes, position.id).addService(window.googletag.pubads());

    if (position.companion) {
      slot.addService(window.googletag.companionAds());
    }
    slot.setTargeting('pos', position.pos);

    if (position.custTargeting) {
      Object.keys(position.custTargeting).forEach(function (key) {
        return slot.setTargeting(key, position.custTargeting[key]);
      });
    }

    return slot;
  });

  window.googletag.pubads().collapseEmptyDivs();
  if (haveCompanion) {
    window.googletag.companionAds().setRefreshUnfilledSlots(true);
    window.googletag.pubads().enableVideoAds();
  }
  if (conf.enableSingleRequest) {
    window.googletag.pubads().enableSingleRequest();
  }
  window.googletag.pubads().enableAsyncRendering();
  window.googletag.pubads().disableInitialLoad();
  window.googletag.enableServices();

  return slots;
};

var setupGptCustomTargeting = function setupGptCustomTargeting(params) {
  debug('MT - setupGptCustomTargeting - custom targeting', [params]);
  (Object.keys(params) || []).forEach(function (key) {
    return window.googletag.pubads().setTargeting(key, params[key]);
  });

  return params;
};

var adapterFactory = (function (useLightSpeed, useVendorScripts, useLsScript, locale) {
  switch (locale) {
    case 'de-DE':
      return new TfmMoneyTreeAdapter(useLightSpeed);
    default:
      return new GptMoneyTreeAdapter(useLightSpeed, useVendorScripts, useLsScript);
  }
});

var MoneyTree = function () {
  function MoneyTree(adapter) {
    classCallCheck(this, MoneyTree);

    this.adapter = adapter;
  }

  createClass(MoneyTree, [{
    key: "shake",
    value: function shake($positions, $custParams) {
      var mergeParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return this.adapter.shake($positions, $custParams, mergeParams);
    }
  }, {
    key: "reset",
    value: function reset(NCTAU, deviceClass) {
      return this.adapter.reset(NCTAU, deviceClass);
    }
  }, {
    key: "prepareAdSlots",
    value: function prepareAdSlots(positions, onSlotsHandler) {
      return this.adapter.prepareAdSlots(positions, onSlotsHandler);
    }
  }, {
    key: "displayAdPositions",
    value: function displayAdPositions(positions) {
      return this.adapter.displayAdPositions(positions);
    }
  }, {
    key: "refresh",
    value: function refresh(positions, targetMap, onSlotsHandler) {
      return this.adapter.refresh(positions, targetMap, onSlotsHandler);
    }

    // ???

  }, {
    key: "displayAd",
    value: function displayAd(positionId) {
      return this.adapter.displayAd(positionId);
    }
  }, {
    key: "addSlots",
    value: function addSlots(biddingPromise, onSlotsHandler) {
      return this.adapter.addSlots(biddingPromise, onSlotsHandler);
    }
  }, {
    key: "startBidding",
    value: function startBidding(thirdPartyConfigs) {
      return this.adapter.startBidding(thirdPartyConfigs);
    }
  }, {
    key: "execThirdParties",
    value: function execThirdParties(thirdPartyConfigs) {
      return this.adapter.execThirdParties(thirdPartyConfigs);
    }
  }, {
    key: "biddingAfterSlots",
    value: function biddingAfterSlots(thirdPartyConfigs, slots) {
      return this.adapter.biddingAfterSlots(thirdPartyConfigs, slots);
    }
  }, {
    key: "biddingSlotLevel",
    value: function biddingSlotLevel(thirdPartyConfigs) {
      return this.adapter.biddingSlotLevel(thirdPartyConfigs);
    }
  }, {
    key: "getBidProcessPromise",
    value: function getBidProcessPromise(id) {
      return this.adapter.bidProcessPromises[id];
    }
  }]);
  return MoneyTree;
}();

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

var __moduleExports = isObject$1;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var __moduleExports$3 = freeGlobal$1;

var freeGlobal = __moduleExports$3;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

var __moduleExports$2 = root$1;

var root = __moduleExports$2;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function now() {
  return root.Date.now();
};

var __moduleExports$1 = now$1;

var root$2 = __moduleExports$2;

/** Built-in value references. */
var _Symbol2 = root$2.Symbol;

var __moduleExports$7 = _Symbol2;

var _Symbol$1 = __moduleExports$7;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var __moduleExports$8 = getRawTag$1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString$1.call(value);
}

var __moduleExports$9 = objectToString$1;

var _Symbol = __moduleExports$7;
var getRawTag = __moduleExports$8;
var objectToString = __moduleExports$9;
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';
/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

var __moduleExports$6 = baseGetTag$1;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

var __moduleExports$10 = isObjectLike$1;

var baseGetTag = __moduleExports$6;
var isObjectLike = __moduleExports$10;
/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

var __moduleExports$5 = isSymbol$1;

var isObject$2 = __moduleExports;
var isSymbol = __moduleExports$5;
/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$2(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$2(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var __moduleExports$4 = toNumber$1;

var isObject = __moduleExports;
var now = __moduleExports$1;
var toNumber = __moduleExports$4;
/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var __moduleExports$11 = arrayEach$1;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor$1(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var __moduleExports$15 = createBaseFor$1;

var createBaseFor = __moduleExports$15;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor$1 = createBaseFor();

var __moduleExports$14 = baseFor$1;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var __moduleExports$18 = baseTimes$1;

var baseGetTag$2 = __moduleExports$6;
var isObjectLike$3 = __moduleExports$10;
/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$3(value) && baseGetTag$2(value) == argsTag;
}

var __moduleExports$20 = baseIsArguments$1;

var baseIsArguments = __moduleExports$20;
var isObjectLike$2 = __moduleExports$10;
/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$1 = baseIsArguments(function () {
    return arguments;
}()) ? baseIsArguments : function (value) {
    return isObjectLike$2(value) && hasOwnProperty$2.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

var __moduleExports$19 = isArguments$1;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$2 = Array.isArray;

var __moduleExports$21 = isArray$2;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var __moduleExports$23 = stubFalse;

var __moduleExports$22 = createCommonjsModule(function (module, exports) {
  var root = __moduleExports$2,
      stubFalse = __moduleExports$23;

  /** Detect free variable `exports`. */
  var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

var __moduleExports$24 = isIndex$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var __moduleExports$27 = isLength$1;

var baseGetTag$3 = __moduleExports$6;
var isLength = __moduleExports$27;
var isObjectLike$4 = __moduleExports$10;
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
    return isObjectLike$4(value) && isLength(value.length) && !!typedArrayTags[baseGetTag$3(value)];
}

var __moduleExports$26 = baseIsTypedArray$1;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary$1(func) {
  return function (value) {
    return func(value);
  };
}

var __moduleExports$28 = baseUnary$1;

var __moduleExports$29 = createCommonjsModule(function (module, exports) {
  var freeGlobal = __moduleExports$3;

  /** Detect free variable `exports`. */
  var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = function () {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  module.exports = nodeUtil;
});

var baseIsTypedArray = __moduleExports$26;
var baseUnary = __moduleExports$28;
var nodeUtil = __moduleExports$29;
/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var __moduleExports$25 = isTypedArray$1;

var baseTimes = __moduleExports$18;
var isArguments = __moduleExports$19;
var isArray$1 = __moduleExports$21;
var isBuffer = __moduleExports$22;
var isIndex = __moduleExports$24;
var isTypedArray = __moduleExports$25;
/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

var __moduleExports$17 = arrayLikeKeys$1;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;

  return value === proto;
}

var __moduleExports$31 = isPrototype$1;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

var __moduleExports$33 = overArg$1;

var overArg = __moduleExports$33;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$1 = overArg(Object.keys, Object);

var __moduleExports$32 = nativeKeys$1;

var isPrototype = __moduleExports$31;
var nativeKeys = __moduleExports$32;
/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var __moduleExports$30 = baseKeys$1;

var baseGetTag$4 = __moduleExports$6;
var isObject$3 = __moduleExports;
var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
    if (!isObject$3(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag$4(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var __moduleExports$35 = isFunction$1;

var isFunction = __moduleExports$35;
var isLength$2 = __moduleExports$27;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength$2(value.length) && !isFunction(value);
}

var __moduleExports$34 = isArrayLike$1;

var arrayLikeKeys = __moduleExports$17;
var baseKeys = __moduleExports$30;
var isArrayLike = __moduleExports$34;
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

var __moduleExports$16 = keys$1;

var baseFor = __moduleExports$14;
var keys = __moduleExports$16;
/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn$1(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

var __moduleExports$13 = baseForOwn$1;

var isArrayLike$2 = __moduleExports$34;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach$1(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike$2(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var __moduleExports$36 = createBaseEach$1;

var baseForOwn = __moduleExports$13;
var createBaseEach = __moduleExports$36;
/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach$1 = createBaseEach(baseForOwn);

var __moduleExports$12 = baseEach$1;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$1(value) {
  return value;
}

var __moduleExports$38 = identity$1;

var identity = __moduleExports$38;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction$1(value) {
  return typeof value == 'function' ? value : identity;
}

var __moduleExports$37 = castFunction$1;

var arrayEach = __moduleExports$11;
var baseEach = __moduleExports$12;
var castFunction = __moduleExports$37;
var isArray = __moduleExports$21;
/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

var forEach_1 = forEach;

var root$3 = __moduleExports$2;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$3['__core-js_shared__'];

var __moduleExports$49 = coreJsData$1;

var coreJsData = __moduleExports$49;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

var __moduleExports$48 = isMasked$1;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

var __moduleExports$50 = toSource$1;

var isFunction$2 = __moduleExports$35;
var isMasked = __moduleExports$48;
var isObject$4 = __moduleExports;
var toSource = __moduleExports$50;
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$6 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$4(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

var __moduleExports$47 = baseIsNative$1;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var __moduleExports$51 = getValue$1;

var baseIsNative = __moduleExports$47;
var getValue = __moduleExports$51;
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var __moduleExports$46 = getNative$1;

var getNative = __moduleExports$46;

/* Built-in method references that are verified to be native. */
var nativeCreate$1 = getNative(Object, 'create');

var __moduleExports$45 = nativeCreate$1;

var nativeCreate = __moduleExports$45;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

var __moduleExports$44 = hashClear$1;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var __moduleExports$52 = hashDelete$1;

var nativeCreate$2 = __moduleExports$45;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

var __moduleExports$53 = hashGet$1;

var nativeCreate$3 = __moduleExports$45;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$3 ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
}

var __moduleExports$54 = hashHas$1;

var nativeCreate$4 = __moduleExports$45;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$4 && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}

var __moduleExports$55 = hashSet$1;

var hashClear = __moduleExports$44;
var hashDelete = __moduleExports$52;
var hashGet = __moduleExports$53;
var hashHas = __moduleExports$54;
var hashSet = __moduleExports$55;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear;
Hash$1.prototype['delete'] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;

var __moduleExports$43 = Hash$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

var __moduleExports$57 = listCacheClear$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || value !== value && other !== other;
}

var __moduleExports$60 = eq$1;

var eq = __moduleExports$60;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var __moduleExports$59 = assocIndexOf$1;

var assocIndexOf = __moduleExports$59;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var __moduleExports$58 = listCacheDelete$1;

var assocIndexOf$2 = __moduleExports$59;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

var __moduleExports$61 = listCacheGet$1;

var assocIndexOf$3 = __moduleExports$59;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$3(this.__data__, key) > -1;
}

var __moduleExports$62 = listCacheHas$1;

var assocIndexOf$4 = __moduleExports$59;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$4(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var __moduleExports$63 = listCacheSet$1;

var listCacheClear = __moduleExports$57;
var listCacheDelete = __moduleExports$58;
var listCacheGet = __moduleExports$61;
var listCacheHas = __moduleExports$62;
var listCacheSet = __moduleExports$63;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear;
ListCache$1.prototype['delete'] = listCacheDelete;
ListCache$1.prototype.get = listCacheGet;
ListCache$1.prototype.has = listCacheHas;
ListCache$1.prototype.set = listCacheSet;

var __moduleExports$56 = ListCache$1;

var getNative$2 = __moduleExports$46;
var root$4 = __moduleExports$2;
/* Built-in method references that are verified to be native. */
var Map$1 = getNative$2(root$4, 'Map');

var __moduleExports$64 = Map$1;

var Hash = __moduleExports$43;
var ListCache = __moduleExports$56;
var Map = __moduleExports$64;
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

var __moduleExports$42 = mapCacheClear$1;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

var __moduleExports$67 = isKeyable$1;

var isKeyable = __moduleExports$67;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

var __moduleExports$66 = getMapData$1;

var getMapData = __moduleExports$66;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var __moduleExports$65 = mapCacheDelete$1;

var getMapData$2 = __moduleExports$66;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}

var __moduleExports$68 = mapCacheGet$1;

var getMapData$3 = __moduleExports$66;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$3(this, key).has(key);
}

var __moduleExports$69 = mapCacheHas$1;

var getMapData$4 = __moduleExports$66;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  var data = getMapData$4(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var __moduleExports$70 = mapCacheSet$1;

var mapCacheClear = __moduleExports$42;
var mapCacheDelete = __moduleExports$65;
var mapCacheGet = __moduleExports$68;
var mapCacheHas = __moduleExports$69;
var mapCacheSet = __moduleExports$70;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear;
MapCache$1.prototype['delete'] = mapCacheDelete;
MapCache$1.prototype.get = mapCacheGet;
MapCache$1.prototype.has = mapCacheHas;
MapCache$1.prototype.set = mapCacheSet;

var __moduleExports$41 = MapCache$1;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var __moduleExports$71 = setCacheAdd$1;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas$1(value) {
  return this.__data__.has(value);
}

var __moduleExports$72 = setCacheHas$1;

var MapCache = __moduleExports$41;
var setCacheAdd = __moduleExports$71;
var setCacheHas = __moduleExports$72;
/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache$1(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache();
    while (++index < length) {
        this.add(values[index]);
    }
}

// Add methods to `SetCache`.
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
SetCache$1.prototype.has = setCacheHas;

var __moduleExports$40 = SetCache$1;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var __moduleExports$75 = baseFindIndex$1;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN$1(value) {
  return value !== value;
}

var __moduleExports$76 = baseIsNaN$1;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf$1(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var __moduleExports$77 = strictIndexOf$1;

var baseFindIndex = __moduleExports$75;
var baseIsNaN = __moduleExports$76;
var strictIndexOf = __moduleExports$77;
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$1(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}

var __moduleExports$74 = baseIndexOf$1;

var baseIndexOf = __moduleExports$74;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$1(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

var __moduleExports$73 = arrayIncludes$1;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith$1(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var __moduleExports$78 = arrayIncludesWith$1;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas$1(cache, key) {
  return cache.has(key);
}

var __moduleExports$79 = cacheHas$1;

var getNative$3 = __moduleExports$46;
var root$5 = __moduleExports$2;
/* Built-in method references that are verified to be native. */
var Set$1 = getNative$3(root$5, 'Set');

var __moduleExports$81 = Set$1;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$2() {
  // No operation performed.
}

var __moduleExports$82 = noop$2;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray$2(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

var __moduleExports$83 = setToArray$2;

var Set = __moduleExports$81;
var noop$1 = __moduleExports$82;
var setToArray$1 = __moduleExports$83;
/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet$1 = !(Set && 1 / setToArray$1(new Set([, -0]))[1] == INFINITY) ? noop$1 : function (values) {
  return new Set(values);
};

var __moduleExports$80 = createSet$1;

var SetCache = __moduleExports$40;
var arrayIncludes = __moduleExports$73;
var arrayIncludesWith = __moduleExports$78;
var cacheHas = __moduleExports$79;
var createSet = __moduleExports$80;
var setToArray = __moduleExports$83;
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq$1(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = iteratee ? [] : result;
  }
  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var __moduleExports$39 = baseUniq$1;

var baseUniq = __moduleExports$39;

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
}

var uniq_1 = uniq;

var adsPositions = [{
  "DESKTOP_BANNER_ANY": {
    "pos": "DESKTOP_BANNER_ANY",
    "sizes": []
  }
}, {
  "DESKTOP_RECTANGLE_ANY": {
    "pos": "DESKTOP_RECTANGLE_ANY",
    "sizes": []
  }
}, {
  "DT_BrandingBar": {
    "pos": "dt_bb",
    "sizes": [[970, 66]],
    "device": ["tablet", "desktop"]
  }
}, {
  "DT_CustomFrame": {
    "pos": "dt_cfr",
    "sizes": [[1002, 793]]
  }
}, {
  "DT_Hidden": {
    "pos": "dt_hdn",
    "sizes": [[1, 1]]
  }
}, {
  "DT_Leader": {
    "pos": "dt_ldr",
    "sizes": [[728, 91]]
  }
}, {
  "DT_MedRect": {
    "pos": "dt_300",
    "sizes": [[300, 251]]
  }
}, {
  "INT_AdvertorialIB": {
    "pos": "INT_AdvertorialIB",
    "sizes": [[300, 150]]
  }
}, {
  "INT_BottomLeader": {
    "pos": "int_midldr",
    "sizes": [[728, 91]]
  }
}, {
  "INT_BottomText": {
    "pos": "int_btxt",
    "sizes": [[765, 30]]
  }
}, {
  "INT_ContextualAds": {
    "pos": "int_contextualads",
    "sizes": [[300, 251]]
  }
}, {
  "INT_HeaderSpon": {
    "pos": "int_hs",
    "sizes": [[150, 60]]
  }
}, {
  "INT_Hidden": {
    "pos": "int_hdn",
    "sizes": [[1, 1]]
  }
}, {
  "INT_Local428": {
    "pos": "int_lnv",
    "sizes": [[468, 60], [428, 60]]
  }
}, {
  "INT_MFWLogo": {
    "pos": "int_mfwlogo",
    "sizes": [[125, 33], [101, 13]]
  }
}, {
  "INT_Micro300_1": {
    "pos": "int_mid300",
    "sizes": [[300, 25]]
  }
}, {
  "INT_Micro300_2": {
    "pos": "int_ms300",
    "sizes": [[300, 251]]
  }
}, {
  "INT_Middle300": {
    "pos": "int_mid300",
    "sizes": [[300, 251]]
  }
}, {
  "INT_MidText": {
    "pos": "int_mtxt",
    "sizes": [[765, 30]]
  }
}, {
  "INT_PageCounter": {
    "pos": "int_pc",
    "sizes": [[1, 1]]
  }
}, {
  "INT_PaidSearch": {
    "pos": "int_pds",
    "sizes": [[300, 251]]
  }
}, {
  "INT_PanelFeature": {
    "pos": "int_pnl",
    "sizes": [[200, 80]]
  }
}, {
  "INT_PhotoBannerPlus": {
    "pos": "int_t3lb",
    "sizes": [[300, 251], [980, 551]]
  }
}, {
  "INT_POI1": {
    "pos": "int_poi",
    "sizes": [[88, 31]]
  }
}, {
  "INT_Spon300": {
    "pos": "int_spon300",
    "sizes": [[300, 251]]
  }
}, {
  "INT_Spotlight": {
    "pos": "int_sl",
    "sizes": [[180, 35], [190, 36], [300, 36]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "INT_Tile1": {
    "pos": "int_t1",
    "sizes": [[125, 125]]
  }
}, {
  "INT_Tile2": {
    "pos": "int_t2",
    "sizes": [[125, 125]]
  }
}, {
  "INT_Tile3": {
    "pos": "int_t3",
    "sizes": [[125, 125]]
  }
}, {
  "INT_Top300Small": {
    "pos": "int_300sm",
    "sizes": [[300, 251]]
  }
}, {
  "INT_Top300Variable": {
    "pos": "int_300var",
    "sizes": [[300, 600], [300, 251]]
  }
}, {
  "INT_TopLeader": {
    "pos": "int_ldr",
    "sizes": [[728, 91]]
  }
}, {
  "INT_TopLeaderPlus": {
    "pos": "int_ldrplus",
    "sizes": [[728, 91], [1280, 90]]
  }
}, {
  "INT_TopText": {
    "pos": "int_ttxt",
    "sizes": [[765, 30]]
  }
}, {
  "INT_Video": {
    "pos": "int_vid",
    "sizes": [[640, 480], [640, 360]]
  }
}, {
  "INT_WindowShade": {
    "pos": "int_ws",
    "sizes": [[970, 66]]
  }
}, {
  "INT_WxSpon": {
    "pos": "int_wxs",
    "sizes": [[88, 31]]
  }
}, {
  "MW3_Bottom": {
    "pos": "mw3_bot",
    "sizes": [[300, 50], [320, 51], [320, 50]]
  }
}, {
  "MW3_Middle": {
    "pos": "mw3_mid",
    "sizes": [[300, 50]]
  }
}, {
  "MW3_Top": {
    "pos": "mw3_top",
    "sizes": [[300, 50], [300, 251], [300, 250]]
  }
}, {
  "MW4_Hidden": {
    "pos": "mw4_hdn",
    "sizes": [[1, 1]]
  }
}, {
  "MW4_Mid": {
    "pos": "mw4_mid",
    "sizes": [[320, 51], [320, 50], [300, 251], [300, 250]]
  }
}, {
  "MW4_PageCounter": {
    "pos": "mw4_pc",
    "sizes": [[1, 1]]
  }
}, {
  "MW4_Top": {
    "pos": "mw4_top",
    "sizes": [[300, 50], [320, 51], [320, 50]]
  }
}, {
  "MW4_Top_1": {
    "pos": "mw4_top",
    "sizes": [[300, 50], [320, 51], [320, 50]]
  }
}, {
  "MW4_Top_2": {
    "pos": "mw4_top",
    "sizes": [[320, 51], [320, 50]]
  }
}, {
  "MW4_Top300variable": {
    "pos": "mw4_300var",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_AdsRefreshCounter": {
    "pos": "wx_arc",
    "sizes": [[1, 1]]
  }
}, {
  "WX_Background": {
    "pos": "wx_background",
    "sizes": [[1, 1]]
  }
}, {
  "WX_Banner": {
    "pos": "wx_ban",
    "sizes": [[1280, 90]]
  }
}, {
  "WX_Bot300": {
    "pos": "wx_bot300",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Bot300_1": {
    "pos": "wx_bot300_1",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_CobrandSpotlight": {
    "pos": "wx_cobrasl",
    "sizes": [[180, 35], [190, 36]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_CommuterFcstSpotlight": {
    "pos": "wx_commutesl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_ContentAd": {
    "pos": "wx_cad",
    "sizes": [[320, 160]]
  }
}, {
  "WX_ConvoStarter": {
    "pos": "wx_cstr",
    "sizes": [[270, 75]]
  }
}, {
  "WX_CustomInterstitial": {
    "pos": "wx_300var",
    "sizes": [[300, 251], [300, 250], [980, 551]]
  }
}, {
  "WX_CustomSpotlight": {
    "pos": "wx_sl4",
    "sizes": [[300, 36]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_DDISpotlight": {
    "pos": "wx_ddisl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_Driver1": {
    "pos": "wx_d1",
    "sizes": [[453, 142], [485, 50], [150, 300], [130, 280], [980, 64]]
  }
}, {
  "WX_DriverTablet": {
    "pos": "wx_d2",
    "sizes": [[728, 91]]
  }
}, {
  "WX_DriverUnit": {
    "pos": "wx_du",
    "sizes": [[728, 91], [665, 90], [980, 64], [11, 46]],
    "device": ["desktop"]
  }
}, {
  "WX_DriverUnitTablet": {
    "pos": "wx_dutab",
    "sizes": [[320, 51], [320, 50]],
    "device": ["tablet"]
  }
}, {
  "WX_Dual300Spon": {
    "pos": "wx_dual300",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_DVFeature": {
    "pos": "wx_dvf",
    "sizes": [[605, 150]]
  }
}, {
  "WX_FarmingSpotlight": {
    "pos": "wx_farmsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_FlipAd": {
    "pos": "wx_fad",
    "sizes": [[190, 36]]
  }
}, {
  "WX_Header": {
    "pos": "wx_hdr",
    "sizes": [[150, 60]]
  }
}, {
  "WX_Hidden": {
    "pos": "wx_hdn",
    "sizes": [[1, 1]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_HomePushdown": {
    "pos": "wx_hc_hdrspon",
    "sizes": [[980, 520]]
  }
}, {
  "Wx_HouseMiniDriver": {
    "pos": "wx_hmd",
    "sizes": [[300, 50]]
  }
}, {
  "WX_HouseSkinnyDriver": {
    "pos": "wx_hsd",
    "sizes": [[636, 50]]
  }
}, {
  "WX_LargeTile": {
    "pos": "wx_lt",
    "sizes": [[155, 155], [135, 155]]
  }
}, {
  "WX_Leaderboard": {
    "pos": "wx_ldr",
    "sizes": [[728, 91], [728, 92], [728, 50]],
    "device": ["tablet"]
  }
}, {
  "WX_LocSpon": {
    "pos": "wx_locspon",
    "sizes": [[255, 44]]
  }
}, {
  "WX_MFWLocal": {
    "pos": "wx_mfwlocal",
    "sizes": [[300, 251]]
  }
}, {
  "WX_MFWLogo": {
    "pos": "wx_mfwlogo",
    "sizes": [[320, 51], [320, 50]]
  }
}, {
  "WX_Mid_No_ROS": {
    "pos": "wx_mid_no_ros",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Mid_No_ROS_B": {
    "pos": "wx_mid_no_ros_b",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Mid300": {
    "pos": "wx_mid300",
    "sizes": [[300, 251], [300, 250], [320, 300]]
  }
}, {
  "WX_Mid300_b": {
    "pos": "wx_mid300_b",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "wx_mid300_chat": {
    "pos": "wx_300chat",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_MiniBrandingBar": {
    "pos": "wx_mbb",
    "sizes": [[300, 72]]
  }
}, {
  "WX_MiniDriver1": {
    "pos": "wx_md1",
    "sizes": [[270, 75], [234, 60], [300, 80]]
  }
}, {
  "WX_MiniDriver2": {
    "pos": "wx_md2",
    "sizes": [[270, 75], [234, 60], [300, 80]]
  }
}, {
  "WX_MiniMid300": {
    "pos": "wx_minimid300",
    "sizes": [[300, 200]]
  }
}, {
  "WX_OnTV": {
    "pos": "wx_ontv",
    "sizes": [[300, 251], [274, 66], [274, 182]]
  }
}, {
  "WX_OutdoorEntSpotlight": {
    "pos": "wx_outentsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_PaidSearch": {
    "pos": "wx_pds",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_ParticipatingSponsor1": {
    "pos": "wx_ps1",
    "sizes": [[300, 251], [300, 250], [300, 100]]
  }
}, {
  "WX_ParticipatingSponsor2": {
    "pos": "wx_ps2",
    "sizes": [[300, 100]]
  }
}, {
  "WX_ParticipatingSponsor3": {
    "pos": "wx_ps3",
    "sizes": [[300, 100]]
  }
}, {
  "WX_Partner": {
    "pos": "wx_ptr",
    "sizes": [[7, 7]]
  }
}, {
  "WX_PointOfInterest1": {
    "pos": "wx_poi1",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_PointOfInterest2": {
    "pos": "wx_poi2",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_PointOfInterest3": {
    "pos": "wx_poi3",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_PointOfInterest4": {
    "pos": "wx_poi4",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_PointOfInterest5": {
    "pos": "wx_poi5",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_PointOfInterest6": {
    "pos": "wx_poi6",
    "sizes": [[250, 30], [35, 35], [75, 50]]
  }
}, {
  "WX_POISpotlight": {
    "pos": "wx_sl5",
    "sizes": [[300, 36]]
  }
}, {
  "WX_PollenCastSpotlight": {
    "pos": "wx_plncstsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_PreRoll": {
    "pos": "wx_prer",
    "sizes": [[8, 8]]
  }
}, {
  "WX_ProjOfWeekSpotlight": {
    "pos": "wx_projofweeksl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_Search": {
    "pos": "wx_srch",
    "sizes": [[336, 290]]
  }
}, {
  "WX_SearchTop": {
    "pos": "wx_srchtop",
    "sizes": [[585, 238]]
  }
}, {
  "WX_ShowSpon": {
    "pos": "wx_show",
    "sizes": [[210, 60]]
  }
}, {
  "WX_SocialPhotosSpotlight": {
    "pos": "wx_photosl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_SocialSevere": {
    "pos": "wx_socsev",
    "sizes": [[162, 35], [190, 36], [320, 50], [91, 24]]
  }
}, {
  "WX_SocialSevere_2": {
    "pos": "wx_socsev",
    "sizes": [[162, 35], [190, 36], [320, 50], [91, 24]]
  }
}, {
  "WX_SocialSevere_3": {
    "pos": "wx_socsev",
    "sizes": [[162, 35], [190, 36], [320, 50], [91, 24]]
  }
}, {
  "WX_SocialSevere_B": {
    "pos": "wx_socsev_b",
    "sizes": [[162, 35], [190, 36], [320, 50], [91, 24]]
  }
}, {
  "WX_SocialSevereDriver": {
    "pos": "wx_socsevdrvr",
    "sizes": [[320, 65]]
  }
}, {
  "WX_SocialSpotlight": {
    "pos": "wx_sl2",
    "sizes": [[180, 35], [265, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_SponsoredStories": {
    "pos": "wx_sponstories",
    "sizes": [[205, 185], [320, 80]]
  }
}, {
  "WX_TabletSponsoredStories": {
    "pos": "wx_nativestories",
    "sizes": [[205, 185], [320, 80]],
    "device": ["tablet"]
  }
}, {
  "WX_StormRespondSpotlight": {
    "pos": "wx_stormrespondsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_StormSpotLight": {
    "pos": "wx_stormsl",
    "sizes": [[300, 36], [180, 35], [190, 36]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_SummerMemories": {
    "pos": "wx_summermems",
    "sizes": [[180, 35]]
  }
}, {
  "WX_Tag": {
    "pos": "wx_tag",
    "sizes": [[1, 1]]
  }
}, {
  "WX_TestSpotlight": {
    "pos": "ws_tsl",
    "sizes": [[300, 36]]
  }
}, {
  "WX_Tile1": {
    "pos": "wx_t1",
    "sizes": [[125, 125]]
  }
}, {
  "WX_Tile2": {
    "pos": "wx_t2",
    "sizes": [[125, 125]]
  }
}, {
  "WX_Tile3": {
    "pos": "wx_t3",
    "sizes": [[125, 125]]
  }
}, {
  "WX_Top300Small": {
    "pos": "wx_300sm",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Top300Small_1": {
    "pos": "wx_300sm",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Top300Variable": {
    "pos": "wx_300var",
    "sizes": [[300, 600], [300, 251], [300, 250], [300, 1050], [300, 276]]
  }
}, {
  "WX_Video_Embed_Lg": {
    "pos": "wx_videoemlg",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_Embed_Md": {
    "pos": "wx_videoemmd",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_Embed_Sm": {
    "pos": "wx_videoemsm",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_MidSm_RR": {
    "pos": "wx_videomidsm_rr",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_Player": {
    "pos": "wx_prer",
    "sizes": [[640, 480], [640, 360]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_Video_Top_Lg": {
    "pos": "preroll=true",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_TopLg": {
    "pos": "wx_videotoplg",
    "sizes": [[640, 480]]
  }
}, {
  "WX_Video_TopSm_RR": {
    "pos": "wx_videotopsm",
    "sizes": [[640, 480]]
  }
}, {
  "WX_VideoCompanion": {
    "pos": "wx_videocomp",
    "sizes": [[300, 250]],
    "companion": true
  }
}, {
  "WX_VideoCompanion_test1": {
    "pos": "wx_videocomptest",
    "sizes": [[300, 60]]
  }
}, {
  "WX_VideoMobile": {
    "pos": "wx_vidmob;preroll=true",
    "sizes": [[640, 480], [640, 360], [400, 300]]
  }
}, {
  "WX_VideoResponsive": {
    "pos": "wx_videorespond",
    "sizes": [[640, 480]]
  }
}, {
  "WX_VideoSpotlight": {
    "pos": "wx_sl3",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_Wallpaper": {
    "pos": "wx_wlpr",
    "sizes": [[1, 1]]
  }
}, {
  "WX_WeatherReadyAutoSpotlight": {
    "pos": "wx_wxreadyauto",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WeatherReadySpotlight": {
    "pos": "wx_wreadysl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WeatherVenturesSpotlight": {
    "pos": "wx_wventuresl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WebSearch": {
    "pos": "wx_websrch",
    "sizes": [[336, 290]]
  }
}, {
  "WX_WindowShade": {
    "pos": "wx_ws",
    "sizes": [[300, 276], [728, 91], [728, 50], [970, 250]],
    "device": ["desktop"]
  }
}, {
  "WX_WindowShadeToday": {
    "pos": "wx_ws",
    "sizes": [[300, 276], [728, 91], [728, 90], [728, 50]],
    "device": ["desktop"]
  }
}, {
  "WX_WXPartner1": {
    "pos": "wx_wp1",
    "sizes": [[234, 60], [300, 80]]
  }
}, {
  "WX_WXPartner2": {
    "pos": "wx_wp2",
    "sizes": [[234, 60], [300, 80]]
  }
}, {
  "WX_WXPartner3": {
    "pos": "wx_wp3",
    "sizes": [[234, 60], [300, 80]]
  }
}, {
  "WX_WXPartner4": {
    "pos": "wx_wp4",
    "sizes": [[234, 60]]
  }
}, {
  "WX_WxSpon": {
    "pos": "wx_wxs",
    "sizes": [[88, 31]]
  }
}, {
  "WX_SpotLight": {
    "pos": "wx_sl",
    "sizes": [[180, 35], [190, 36], [300, 36], [320, 60]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_EditorialLG": {
    "pos": "wx_edlg",
    "sizes": [[679, 600]]
  }
}, {
  "WX_EditorialSM": {
    "pos": "wx_edsm",
    "sizes": [[424, 434]]
  }
}, {
  "WX_HuntingFishingSpotlight": {
    "pos": "wx_huntfishsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_AllergyTrackerSpotlight": {
    "pos": "wx_allergytrackersl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WeekendTileCardSpotlight": {
    "pos": "wx_tilewcardsl",
    "sizes": [[120, 45]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WeekendTileListSpotlight": {
    "pos": "wx_tilewlistsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_LifestyleSpotlight": {
    "pos": "wx_lifestylesl",
    "sizes": [[180, 35]],
    "device": ["desktop", "tablet", "mobile"]
  }
}, {
  "WX_HurricaneWeekSpotlight": {
    "pos": "wx_hurricaneweeksl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_WeatherVenturesLogo": {
    "pos": "wx_wxventurelogo",
    "sizes": [[300, 36]]
  }
}, {
  "MW4_SpotLight": {
    "pos": "mw4_sl",
    "sizes": [[320, 51], [320, 50]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_CobrandSpotlight2": {
    "pos": "wx_cobrasl2",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_FallForFallSpotlight": {
    "pos": "wx_fallforfallsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_Bot3x1": {
    "pos": "wx_bot3x1",
    "sizes": [[300, 100], [300, 251], [300, 250]]
  }
}, {
  "MW_Position1": {
    "pos": "mw_p1",
    "sizes": [[320, 51], [320, 50], [300, 45]],
    "device": ["mobile"]
  }
}, {
  "MW_Position2": {
    "pos": "mw_p2",
    "sizes": [[300, 251], [300, 250]],
    "device": ["mobile"]
  }
}, {
  "MW_Position3": {
    "pos": "mw_p3",
    "sizes": [[300, 251], [300, 250]],
    "device": ["mobile"]
  }
}, {
  "MW_Position4": {
    "pos": "mw_p4",
    "sizes": [[300, 251], [300, 250]],
    "device": ["mobile"]
  }
}, {
  "MW_Position5": {
    "pos": "mw_p5",
    "sizes": [[300, 251], [300, 250]],
    "device": ["mobile"]
  }
}, {
  "MW_BottomSmall": {
    "pos": "mw_p3",
    "sizes": [[320, 51], [320, 50], [300, 45]],
    "device": ["mobile"]
  }
}, {
  "WX_StormCentralSpotlight": {
    "pos": "wx_stormcentralsl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_BottomLeader": {
    "pos": "wx_botldr",
    "sizes": [[728, 91], [728, 90]]
  }
}, {
  "WX_Bot300AdX1": {
    "pos": "wx_adx1",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_Bot300AdX2": {
    "pos": "wx_adx2",
    "sizes": [[300, 251], [300, 251]]
  }
}, {
  "WX_Bot300AdX3": {
    "pos": "wx_adx3",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_BottomLeaderTablet": {
    "pos": "wx_botldrtab",
    "sizes": [[320, 51], [320, 50]]
  }
}, {
  "WX_ArticleContentAd": {
    "pos": "wx_acw",
    "sizes": [[320, 80]]
  }
}, {
  "MW_ArticleContentAd": {
    "pos": "mw_acw",
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "WX_LSAllergySpotlight": {
    "pos": "wx_allergylssl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_LSFarmingSpotlight": {
    "pos": "wx_farmlssl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_NativeStories": {
    "pos": "wx_nativestories",
    "sizes": [[320, 80]],
    "device": ["desktop", "tablet", "mobile"]
  }
}, {
  "WX_PromoDriver1": {
    "pos": "wx_promodriver1",
    "sizes": [[285, 100]]
  }
}, {
  "WX_MidLeader": {
    "pos": "wx_midldr",
    "sizes": [[728, 91], [728, 90], [970, 90]],
    "device": ["desktop"]
  }
}, {
  "WX_CountdownPromoSpotlight": {
    "pos": "wx_countdownpromosl",
    "sizes": [[180, 35]],
    "device": ["mobile", "tablet", "desktop"]
  }
}, {
  "WX_ContentFeed1": {
    "pos": "wx_cf1",
    "sizes": [[363, 320]]
  }
}, {
  "WX_ContentFeed2": {
    "pos": "wx_cf2",
    "sizes": [[363, 320]]
  }
}, {
  "WX_ContentFeed3": {
    "pos": "wx_cf3",
    "sizes": [[363, 320]]
  }
}, {
  "MW_ContentFeed1": {
    "pos": "mw_cf1",
    "sizes": [[310, 260]],
    "device": ["mobile"]
  }
}, {
  "MW_ContentFeed2": {
    "pos": "mw_cf2",
    "sizes": [[310, 260]],
    "device": ["mobile"]
  }
}, {
  "MW_ContentFeed3": {
    "pos": "mw_cf3",
    "sizes": [[310, 260]],
    "device": ["mobile"]
  }
}, {
  "WX_BillBoard": {
    "pos": "wx_billbrd",
    "sizes": [[970, 250]]
  }
}, {
  "": {
    "sizes": []
  }
}, {
  "WX_PageCounter": {
    "sizes": [[1, 1]]
  }
}, {
  "WX_SkyScraper": {
    "sizes": [[160, 600]]
  }
}, {
  "MW_Position5": {
    "sizes": [[300, 251], [300, 250]]
  }
}, {
  "MW_ContentFeed2": {
    "sizes": [[310, 260]]
  }
}, {
  "MW_ContentFeed3": {
    "sizes": [[310, 260]]
  }
}];;

var AdsPositionConfig = function () {
  function AdsPositionConfig(config) {
    var _this = this;

    classCallCheck(this, AdsPositionConfig);

    this.hash = {};

    config.forEach(function (value) {
      var id = Object.keys(value)[0];

      var intSizes = [];
      var intArr = void 0;

      value[id].sizes.forEach(function (arr) {
        intArr = [];
        arr.forEach(function (elem) {
          intArr.push(elem / 1);
        });
        intSizes.push(intArr);
      });

      _this.hash[id] = {
        id: id,
        pos: value[id].pos,
        sizes: intSizes,
        device: value[id].device || ['desktop', 'tablet'],
        companion: value[id].companion || false
      };
    });
  }

  createClass(AdsPositionConfig, [{
    key: 'getPositionById',
    value: function getPositionById(id, locale, screenSize) {
      var _this2 = this;

      var positions = [];

      id = Array.isArray(id) ? id : [id];
      id.forEach(function (item) {
        if (_this2.hash[item] && (typeof screenSize === 'undefined' || _this2.hash[item].device.indexOf(screenSize) > -1)) {
          positions.push(_this2.hash[item]);
        }
      });

      return Promise$1.resolve(positions);
    }
  }]);
  return AdsPositionConfig;
}();

function apc (config) {
  return new AdsPositionConfig(config || adsPositions);
}

var PositionProvider = function () {
  function PositionProvider(locale) {
    classCallCheck(this, PositionProvider);

    this.locale = locale;
    this.adsPositionConfig = apc();
  }

  // abstract


  createClass(PositionProvider, [{
    key: 'preparePositions',
    value: function preparePositions(positionIds, isSeparate, screenSize) {
      return Promise$1.resolve({ positionIds: positionIds, isSeparate: isSeparate, screenSize: screenSize });
    }
  }, {
    key: 'fetchPositionIds',
    value: function fetchPositionIds(config, isSeparate) {
      return Promise$1.resolve(this.getAds(config.regions, isSeparate));
    }
  }, {
    key: 'getAds',
    value: function getAds(regions, isSeparate) {
      return isSeparate ? this.getSeparateAds(regions) : this.getAllAds(regions);
    }

    // abstract

  }, {
    key: 'getAllAds',
    value: function getAllAds(regions) {
      return [regions];
    }

    // abstract

  }, {
    key: 'getSeparateAds',
    value: function getSeparateAds(regions) {
      return { regions: regions };
    }
  }, {
    key: 'getPositionById',
    value: function getPositionById(_ref) {
      var id = _ref.id,
          locale = _ref.locale,
          screenSize = _ref.screenSize;

      return this.adsPositionConfig.getPositionById(id, locale, screenSize);
    }
  }]);
  return PositionProvider;
}();

var LSGlobalPosProvider = function (_PositionProvider) {
  inherits(LSGlobalPosProvider, _PositionProvider);

  function LSGlobalPosProvider() {
    classCallCheck(this, LSGlobalPosProvider);
    return possibleConstructorReturn(this, (LSGlobalPosProvider.__proto__ || Object.getPrototypeOf(LSGlobalPosProvider)).apply(this, arguments));
  }

  createClass(LSGlobalPosProvider, [{
    key: 'preparePositions',
    value: function preparePositions(positionIds, isSeparate, screenSize) {
      var locale = this.locale;

      if (isSeparate) {
        return Promise$1.all([this.getPositionById({
          id: positionIds.static, locale: locale, screenSize: screenSize
        }), this.getPositionById({
          id: positionIds.lazy, locale: locale, screenSize: screenSize
        })]);
      }

      return this.getPositionById({ id: positionIds, locale: locale, screenSize: screenSize });
    }
  }, {
    key: 'getAllAds',
    value: function getAllAds(regions) {
      var ids = [];

      forEach_1(regions, function (region) {
        forEach_1(region, function (component) {
          // A component is a 'MiniPanel' determine
          // if any children are 'Ad'
          if (component.component === 'MiniPanel') {
            var children = component.children;

            forEach_1(children, function (child) {
              if (child.component === 'Ad') {
                ids.push(child.props.id);
              }
            });
          }
          if (component.component === 'Ad') {
            ids.push(component.props.id);
          }
        });
      });

      return uniq_1(ids);
    }
  }, {
    key: 'getSeparateAds',
    value: function getSeparateAds(regions) {
      var _this2 = this;

      var ids = [];
      var lazyIds = [];

      forEach_1(regions, function (region) {
        forEach_1(region, function (component) {
          _this2.collectAd(component, lazyIds, ids);

          // Ads could be wrapped in a MiniPanel
          // Check children of MiniPanel for Ad
          if (component.component === 'MiniPanel') {
            var children = component.children;

            forEach_1(children, function (child) {
              _this2.collectAd(child, lazyIds, ids);
            });
          }
        });
      });

      return {
        static: uniq_1(ids),
        lazy: uniq_1(lazyIds)
      };
    }
  }, {
    key: 'collectAd',
    value: function collectAd(item, lazyIds, ids) {
      if (item.component === 'Ad' && item.props.lazyload) {
        lazyIds.push(item.props.id);
      } else if (item.component === 'Ad') {
        ids.push(item.props.id);
      }
    }
  }]);
  return LSGlobalPosProvider;
}(PositionProvider);

var LSGermanPosProvider = function (_PositionProvider) {
  inherits(LSGermanPosProvider, _PositionProvider);

  function LSGermanPosProvider() {
    classCallCheck(this, LSGermanPosProvider);
    return possibleConstructorReturn(this, (LSGermanPosProvider.__proto__ || Object.getPrototypeOf(LSGermanPosProvider)).apply(this, arguments));
  }

  createClass(LSGermanPosProvider, [{
    key: 'preparePositions',
    value: function preparePositions(positionIds, isSeparate, screenSize) {
      return Promise$1.resolve(isSeparate ? [this.filterByScreenSize(positionIds.static, screenSize), this.filterByScreenSize(positionIds.lazy, screenSize)] : this.filterByScreenSize(positionIds, screenSize));
    }
  }, {
    key: 'getAllAds',
    value: function getAllAds(regions) {
      var ids = [];

      forEach_1(regions, function (region) {
        forEach_1(region, function (component) {
          if (component.component === 'Ad') {
            ids.push({
              id: component.props.id,
              string: component.props.string
            });
          }
        });
      });

      return ids;
    }
  }, {
    key: 'getSeparateAds',
    value: function getSeparateAds(regions) {
      var ids = [];
      var lazyIds = [];

      forEach_1(regions, function (region) {
        forEach_1(region, function (component) {
          if (component.component === 'Ad' && component.props.lazyload) {
            lazyIds.push({
              id: component.props.id,
              string: component.props.string
            });
          } else if (component.component === 'Ad') {
            ids.push({
              id: component.props.id,
              string: component.props.string
            });
          }
        });
      });

      return {
        static: ids,
        lazy: lazyIds
      };
    }
  }, {
    key: 'filterByScreenSize',
    value: function filterByScreenSize(arr, screenSize) {
      if (typeof screenSize === 'undefined') {
        return arr;
      }

      var _screenSize = screenSize === 'mobile' ? 'SMARTPHONE' : screenSize.toUpperCase();

      return arr.filter(function (item) {
        return typeof item.string === 'string' && item.string.indexOf(_screenSize) > -1;
      });
    }
  }]);
  return LSGermanPosProvider;
}(PositionProvider);

var LSProviderFactory = function () {
  function LSProviderFactory() {
    classCallCheck(this, LSProviderFactory);
  }

  createClass(LSProviderFactory, null, [{
    key: 'build',
    value: function build(locale) {
      switch (locale) {
        case 'de-DE':
          return new LSGermanPosProvider(locale);
        default:
          return new LSGlobalPosProvider(locale);
      }
    }
  }]);
  return LSProviderFactory;
}();

var BaseConfigProcessor = function () {
  function BaseConfigProcessor(locale, config) {
    classCallCheck(this, BaseConfigProcessor);

    this.locale = locale;
    this.config = config;
  }

  // used only by nerf


  createClass(BaseConfigProcessor, [{
    key: 'getAds',
    value: function getAds() {
      return [];
    }
  }, {
    key: 'preparePositions',
    value: function preparePositions(_ref) {
      var positions = _ref.positions,
          isSeparate = _ref.isSeparate,
          screenSize = _ref.screenSize;

      if (this.config.preparePositions) {
        if (typeof this.config.preparePositions === 'function') {
          return this.config.preparePositions({ positions: positions, isSeparate: isSeparate, screenSize: screenSize });
        } else if (_typeof(this.config.preparePositions) === 'object') {
          return this.config.preparePositions;
        }
      }

      return positions || [];
    }
  }, {
    key: 'getCustParams',
    value: function getCustParams() {
      var custParams = {};

      if (this.config.getCustParams) {
        if (typeof this.config.getCustParams === 'function') {
          custParams = this.config.getCustParams();
        } else if (_typeof(this.config.getCustParams) === 'object') {
          custParams = this.config.getCustParams;
        }
      }

      if (this.config.getClientBrowser) {
        custParams.browser = this.getClientBrowser();
      }

      return custParams;
    }
  }, {
    key: 'getClientBrowser',
    value: function getClientBrowser() {
      if (this.config.getClientBrowser) {
        if (typeof this.config.getClientBrowser === 'function') {
          return this.config.getClientBrowser();
        } else if (typeof this.config.getClientBrowser === 'string') {
          return this.config.getClientBrowser;
        }
      }

      return '';
    }
  }, {
    key: 'getAdUnit',
    value: function getAdUnit(locale) {
      var deviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'desktop';

      if (this.config.getAdUnit) {
        if (typeof this.config.getAdUnit === 'function') {
          return this.config.getAdUnit(locale, deviceType);
        } else if (_typeof(this.config.getAdUnit) === 'object') {
          return this.config.getAdUnit;
        }
      }

      return {
        adUnit: '',
        networkCode: ''
      };
    }
  }, {
    key: 'getFirstAdId',
    value: function getFirstAdId(locale) {
      var deviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'desktop';
      // eslint-disable-line no-unused-vars
      return '';
    }
  }]);
  return BaseConfigProcessor;
}();

var _instance$1 = null;
var LOCAL_SUITE_FIRST_AD_ID = 'WX_Top300Variable';
var LOCAL_SUITE_MOBILE_FIRST_AD_ID = 'MW_Position1';

var LocalSuiteConfigProcessor = function (_BaseConfigProcessor) {
  inherits(LocalSuiteConfigProcessor, _BaseConfigProcessor);
  createClass(LocalSuiteConfigProcessor, null, [{
    key: 'instance',
    value: function instance(locale) {
      if (_instance$1 == null || locale && _instance$1.locale !== locale) {
        _instance$1 = new LocalSuiteConfigProcessor(locale);
      }

      return _instance$1;
    }
  }]);

  function LocalSuiteConfigProcessor(locale) {
    classCallCheck(this, LocalSuiteConfigProcessor);

    var _this = possibleConstructorReturn(this, (LocalSuiteConfigProcessor.__proto__ || Object.getPrototypeOf(LocalSuiteConfigProcessor)).call(this, locale, {}));

    _this.posProvider = LSProviderFactory.build(locale);
    return _this;
  }

  createClass(LocalSuiteConfigProcessor, [{
    key: 'getAds',
    value: function getAds(_ref) {
      var config = _ref.config,
          isSeparate = _ref.isSeparate,
          positionIds = _ref.positionIds;

      var posProvider = this.posProvider;

      if (positionIds) {
        return posProvider.preparePositions(positionIds);
      }

      return posProvider.fetchPositionIds(config, isSeparate).then(function (positions) {
        return positions;
      });
    }
  }, {
    key: 'preparePositions',
    value: function preparePositions(_ref2) {
      var positions = _ref2.positions,
          isSeparate = _ref2.isSeparate,
          screenSize = _ref2.screenSize;

      return this.posProvider.preparePositions(positions, isSeparate, screenSize);
    }
  }, {
    key: 'getCustParams',
    value: function getCustParams() {
      return {
        refurl: 'weather',
        browser: this.getClientBrowser(),
        plat: this.getDeviceClass()
      };
    }
  }, {
    key: 'getClientBrowser',
    value: function getClientBrowser() {
      var userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
      var browser = userAgent && userAgent.match(/chrome|firefox|safari|trident/i);

      if (Array.isArray(browser)) {
        switch (browser[0].toLowerCase()) {

          case 'chrome':
            return 'twcchrome';
          case 'firefox':
            return 'twcff';
          case 'safari':
            return 'twcsafari';
          case 'trident':
            return 'twcie';
          default:
            return 'twcnative';
        }
      }

      return 'nl';
    }
  }, {
    key: 'getDeviceClass',
    value: function getDeviceClass() {
      if (typeof window === 'undefined') return '';

      var device = getScreenSize();

      if (device === 'tablet') {
        return 'wx_tab';
      } else if (device === 'mobile') {
        return 'wx_mw';
      }

      return 'wx';
    }
  }, {
    key: 'getAdUnit',
    value: function getAdUnit(locale) {
      var deviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'desktop';

      var adUnit = void 0;
      var networkCode = void 0;
      var adUnitDefaultPrefixes = {
        desktop: 'web_weather_',
        tablet: 'tablet_weather_',
        mobile: 'mobile_smart_'
      };

      switch (locale) {
        case 'de-DE':
          adUnit = 'wx_digital';
          networkCode = '/3673';
          break;
        case 'en-US':
          adUnit = adUnitDefaultPrefixes[deviceType] + locale.substr(3).toLowerCase();
          networkCode = '/7646';
          break;
        default:
          adUnit = adUnitDefaultPrefixes[deviceType] + locale.replace('-', '_').toLowerCase();
          networkCode = '/7646';
      }

      return {
        adUnit: adUnit,
        networkCode: networkCode
      };
    }
  }, {
    key: 'getFirstAdId',
    value: function getFirstAdId(locale) {
      var deviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'desktop';

      if (locale !== 'de-DE') {
        if (deviceType === 'desktop' || deviceType === 'tablet') {
          return LOCAL_SUITE_FIRST_AD_ID;
        } else if (deviceType === 'mobile') {
          return LOCAL_SUITE_MOBILE_FIRST_AD_ID;
        }
      }

      return '';
    }
  }]);
  return LocalSuiteConfigProcessor;
}(BaseConfigProcessor);

var priorInstance = null;
var priorLocale = null;
var priorConfig = null;

var AdsConfigProcessor = function () {
  function AdsConfigProcessor() {
    classCallCheck(this, AdsConfigProcessor);
  }

  createClass(AdsConfigProcessor, null, [{
    key: 'instance',
    value: function instance() {
      return priorInstance;
    }
  }, {
    key: 'setup',
    value: function setup(locale) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'localsuite';

      if (typeof config === 'string') {
        if (config === 'localsuite') {
          priorInstance = LocalSuiteConfigProcessor.instance(locale);
        }
      } else if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
        AdsConfigProcessor.buildConfigProcessor(locale, config);
      }
    }
  }, {
    key: 'buildConfigProcessor',
    value: function buildConfigProcessor(locale, config) {
      if (!priorInstance || locale !== priorLocale || JSON.stringify(config) !== priorConfig) {
        priorLocale = locale;
        priorConfig = JSON.stringify(config);

        priorInstance = new BaseConfigProcessor(locale, config);
      }
    }
  }]);
  return AdsConfigProcessor;
}();

function AdModel(ad) {
  this.ad = ad;
  this.adFrame = null;
  this.observer = null;
}
AdModel.prototype = {
  onDomMutation: function onDomMutation() {
    var adFrame = this.ad.querySelector('iframe');

    if (adFrame) {
      this.ad.adFrame = adFrame;
      adFrame.addEventListener('load', this.updateAdHeight.bind(this), true);
    } else {
      this.updateAdHeight();
    }
  },
  updateAdHeight: function updateAdHeight() {
    var ad = this.ad.adFrame || this.ad;
    var params = ad.getBoundingClientRect();

    this.ad.parentNode.style.height = params.height + 'px';
  }
};

// example of o cookie
// o = 4G,US,desktop,AssetsWC,wifi,US,33.7486,-84.3884

/**
 * This method return the O cookie data as an object if its been set
 * @return {object}
 */
var getOCookieData = function getOCookieData() {
  var oCookie = getCookie('o');

  if (!oCookie) {
    return null;
  }
  var oCookieObj = {};
  var tempArr = oCookie && oCookie.split(',');

  oCookieObj.connectionSpeed = tempArr[0] || null;
  oCookieObj.localeGroup = tempArr[1] || null;
  oCookieObj.deviceClass = tempArr[2] || null;
  oCookieObj.twcPhrel = tempArr[3] || null;
  oCookieObj.connection = tempArr[4] || null;
  oCookieObj.geoIPCountryCode = tempArr[5] || null;
  if (tempArr[6] && tempArr[7]) {
    oCookieObj.geoIPGeocode = tempArr[6] + ',' + tempArr[7];
  } else {
    oCookieObj.geoIPGeocode = null;
  }
  return oCookieObj;
};

var filterThirdParty = function filterThirdParty() {
  var thirdParties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return thirdParties.filter(function (item) {
    var passed = true;

    if (item.conditions) {
      Object.keys(item.conditions).some(function (prop) {
        switch (prop) {
          case 'screenSize':
            {
              passed = item.conditions[prop].indexOf(getScreenSize()) >= 0;
              break;
            }
          case 'countryCode':
            {
              var esidata = getOCookieData() || {};

              passed = esidata.geoIPCountryCode === item.conditions[prop];
              break;
            }
          default:
        }

        return !passed;
      });
    }

    return passed;
  });
};

var prepareThirdParty = function prepareThirdParty() {
  var thirdParties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  thirdParties.forEach(function (item) {
    if (item.prepare) {
      Object.keys(item.prepare).forEach(function (key) {
        switch (key) {
          case 'jStorageFactual':
            {
              var prepareObject = item.prepare[key];
              var location = jStorage.get(prepareObject.location[0]) || jStorage.get(prepareObject.location[1]) || {};
              var coords = location.coords;
              var userId = jStorage.get(prepareObject.userId);
              var isFresh = Math.floor(Date.now() / 1000) < location.currentTime + prepareObject.timePeriod;

              if (coords && userId && isFresh) {
                item.params.lat = coords.lat.toFixed(5);
                item.params.long = coords.long.toFixed(5);
                item.params.userId = userId;
              }
              break;
            }
          default:
        }
      });
    }
  });

  return thirdParties;
};

function callQueue(obj, name) {
  var tMo = typeof obj !== 'undefined' ? obj : null;
  var cmds = [].concat(tMo && tMo[name] || []);

  cmds.forEach(function (cd) {
    return cd();
  });

  obj[name] = {
    'push': function push(cb) {
      return typeof cb === 'function' && cb.call();
    }
  };
}

// import adsInitialConfig from './configServices/adsInitialConfig';
function adProvider (mt) {
  return {
    allPositions: [],
    displayed: [],
    toDisplay: [],
    thirdParties: [],
    _NCTAU: {},
    _custParams: {},

    start: function start(_ref) {
      var _this2 = this;

      var adZone = _ref.adZone,
          locale = _ref.locale,
          thirdParties = _ref.thirdParties,
          custParams = _ref.custParams,
          pageAdPositions = _ref.pageAdPositions,
          staticAdPositions = _ref.staticAdPositions,
          processStatic = _ref.processStatic,
          adConfig = _ref.adConfig,
          _ref$deferDisplay = _ref.deferDisplay,
          deferDisplay = _ref$deferDisplay === undefined ? false : _ref$deferDisplay;

      AdsConfigProcessor.setup(locale, adConfig);

      var screenSize = getScreenSize();
      // const { adUnit, networkCode } = adsInitialConfig(locale, screenSize);

      var _AdsConfigProcessor$i = AdsConfigProcessor.instance().getAdUnit(locale, screenSize),
          adUnit = _AdsConfigProcessor$i.adUnit,
          networkCode = _AdsConfigProcessor$i.networkCode;

      this.firstAdID = AdsConfigProcessor.instance().getFirstAdId(locale, screenSize);

      // var adConfigs = pageAdPositions.concat(staticAdPositions);
      var NCTAU = {
        networkCode: networkCode,
        adUnit: adUnit,
        adZone: adZone
      };

      var _preparedTP = prepareThirdParty(thirdParties);
      var _thirdParties = filterThirdParty(_preparedTP);

      this.thirdParties = _thirdParties;

      this._NCTAU = NCTAU;

      var _this = this;

      return Promise$1.all([this.requestPositions(locale, uniquePositions(pageAdPositions)), this.requestPositions(locale, uniquePositions(staticAdPositions))]).then(function (results) {
        var nonStaticPos = results[0];
        var staticPos = results[1];
        var allPositions = nonStaticPos.concat(staticPos);

        _this.allPositions = allPositions;

        return mt.reset(NCTAU, screenSize).execThirdParties(_thirdParties).then(function (thirdPartyAdParams) {
          var adTargeting = [AdsConfigProcessor.instance().getCustParams(), thirdPartyAdParams, custParams];

          _this2._custParams = adTargeting.reduce(function (obj, item) {
            return Object.assign(obj, item);
          }, {});
          callQueue(window.twcMoney, 'bfq');

          if (allPositions.length > 0) {
            mt.shake(allPositions, adTargeting, true).then(function () {
              mt.prepareAdSlots(allPositions, function (slots) {
                mt.biddingAfterSlots(_thirdParties, slots);
              });

              if (processStatic) {
                window.twcMoney.moneyTree().watchStaticAds(staticAdPositions);
                _this.display(staticPos);
              }

              if (!deferDisplay) {
                _this.processDisplayQueue();
              }
            });
          } else if (!deferDisplay) {
            _this.processDisplayQueue();
          }
        });
      });
    },
    requestPositions: function requestPositions(locale, positions) {
      var screenSize = getScreenSize();

      if (!positions || !Array.isArray(positions) || positions.length === 0) {
        return Promise$1.resolve([]);
      }

      return AdsConfigProcessor.instance().preparePositions({ positions: positions, isSeparate: false, screenSize: screenSize });
    },
    display: function display(positions) {
      var conf = BaseConfig.instance();

      if (!Array.isArray(positions)) {
        positions = [positions];
      }

      if (conf.enableSingleRequest) {
        this.displayTogether(positions);
      } else {
        this.displaySeparate(positions);
      }
    },
    displaySeparate: function displaySeparate(positions) {
      var _this3 = this;

      if (positions.length > 0) {
        this.toDisplay = this.toDisplay.concat(positions);

        if (this.firstAdID) {
          var firstAdPresent = this.allPositions.filter(function (item) {
            return item.id === _this3.firstAdID;
          }).length;

          var firstAdToBeDisplayed = this.toDisplay.filter(function (item) {
            return item.id === _this3.firstAdID;
          }).length;

          var firstAdDisplayed = this.displayed.filter(function (item) {
            return item.id === _this3.firstAdID;
          }).length;

          if (firstAdToBeDisplayed) {
            this.toDisplay.sort(function (a, b) {
              if (b.id === _this3.firstAdID) {
                return 1;
              }

              if (a.id === _this3.firstAdID) {
                return -1;
              }

              return 0;
            });
          }

          if (!firstAdPresent || firstAdToBeDisplayed || firstAdDisplayed) {
            this.processDisplay();
          }
        } else {
          this.processDisplay();
        }
      }
    },
    displayTogether: function displayTogether(positions) {
      if (!this.debouncedDisplay) {
        this.debouncedDisplay = debounce_1(this.processDisplay.bind(this), 15);
      }

      if (positions.length > 0) {
        this.toDisplay = this.toDisplay.concat(positions);

        this.debouncedDisplay();
      }
    },
    processDisplay: function processDisplay() {
      var allPositions = this.allPositions;
      var allPosMap = allPositions.map(function (item) {
        return item.id;
      });
      var displayedMap = this.displayed.map(function (item) {
        return item.id;
      });
      var newPositions = this.toDisplay.filter(function (item) {
        return allPosMap.indexOf(item.id) > -1;
      }).filter(function (item) {
        return displayedMap.indexOf(item.id) === -1;
      });

      this.displayed = this.displayed.concat(newPositions);

      this.toDisplay = [];

      return mt.displayAdPositions(newPositions);
    },
    onRoute: function onRoute() {
      this.firstAdID = '';
      this.toDisplay = [];
      this.allPositions = [];
      this.displayed = [];
      this.thirdParties = [];
      window.twcMoney.displayQueue = [];
      window.twcMoney.bfq = [];
    },
    processDisplayQueue: function processDisplayQueue() {
      try {
        var tMo = typeof twcMoney !== 'undefined' ? window.twcMoney : null;
        var cmds = [].concat(tMo && tMo.displayQueue || []);

        cmds.forEach(function (cd) {
          return cd();
        });

        window.twcMoney.displayQueue = {
          'push': function push(cb) {
            return typeof cb === 'function' && cb.call();
          }
        };
      } catch (err) {
        console.log('Avoid calling processDisplayQueue twice on same page');
      }
    },
    addSlots: function addSlots(locale, positions) {
      var _this4 = this;

      var positionsPromise = this.requestPositions(locale, positions).then(function (additionalPositions) {
        var allPosMap = _this4.allPositions.map(function (item) {
          return item.id;
        });
        var missingPositions = additionalPositions.filter(function (pos) {
          return !allPosMap.includes(pos.id);
        });

        if (!missingPositions.length) return;

        var biddingPromise = mt.biddingSlotLevel(_this4.thirdParties);

        mt.addSlots(Promise$1.all([positionsPromise, biddingPromise]), function (slots) {
          mt.biddingAfterSlots(_this4.thirdParties, slots);
        });

        _this4.allPositions = _this4.allPositions.concat(missingPositions);

        return missingPositions;
      });
    },
    watchStaticAds: function watchStaticAds(staticAdPositions) {
      var mapAllAds = this.allPositions.map(function (item) {
        return item.id;
      });
      var staticAds = staticAdPositions.filter(function (item) {
        return mapAllAds.indexOf(item) > -1;
      });

      staticAds.forEach(function (item) {
        var el = document.getElementById(item);

        if (el) {
          var model = new AdModel(el);
          var observer = new MutationObserver(model.onDomMutation.bind(model));

          observer.observe(model.ad, { childList: true, subtree: true });
          model.observer = observer;
        }
      });
    },


    get NCTAU() {
      return this._NCTAU;
    },

    refresh: function refresh(positions, targetMap) {
      var _this5 = this;

      return mt.biddingSlotLevel(this.thirdParties).then(function () {
        return mt.refresh(positions, targetMap, function (slots) {
          mt.biddingAfterSlots(_this5.thirdParties, slots);
        });
      });
    },
    removeDisplayedPosition: function removeDisplayedPosition(pos) {
      if (typeof pos !== 'string') return;

      this.displayed = this.displayed.filter(function (item) {
        return item.id !== pos;
      });
    },
    getBidProcessPromise: function getBidProcessPromise(id) {
      return mt.getBidProcessPromise(id) || Promise$1.resolve();
    }
  };
}

MoneyTree.Activity = [];

var $$bills = void 0;
var moneyTree = function moneyTree() {
  var sdkConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!$$bills) {
    var defaultValue = {
      useLightSpeed: true,
      useVendorScripts: true,
      useLsScript: true,
      enableSingleRequest: true

      /*  locale
      env
      lsScriptUrl */
    };

    var conf = BaseConfig.instance(Object.assign({}, defaultValue, sdkConfig));
    var adapter = adapterFactory(conf.useLightSpeed, conf.useVendorScripts, conf.useLsScript, conf.locale);

    // $$bills = new MoneyTree(adapter);
    $$bills = adProvider(new MoneyTree(adapter));
  }
  return $$bills;
};

var cmd = {
  'push': function push(cb) {
    return typeof cb === 'function' && cb.call();
  }
};

var tMo = typeof twcMoney !== 'undefined' ? window.twcMoney : null;
var cmds = [].concat(tMo && tMo.cmd || []);

// Process commands that were queued before the library was done loading asynchronously.
setTimeout(function () {
  return function () {
    cmds.forEach(function (proc) {
      cmd.push(proc);
    });
    return true;
  }();
});

var NCTAU = function NCTAU() {
  if (!!$$bills) {
    return $$bills.NCTAU;
  }

  return {};
};

/**
 * Created by sherwoos on 8/26/16.
 */

var THIRD_PARTY_TOKEN$6 = 'openx';

var OpenX = function (_ThirdParty) {
  inherits(OpenX, _ThirdParty);

  function OpenX(configs) {
    classCallCheck(this, OpenX);

    var _this = possibleConstructorReturn(this, (OpenX.__proto__ || Object.getPrototypeOf(OpenX)).call(this));

    _this.cfgs = validateConfigs(configs);
    debug('Construct OpenX');
    return _this;
  }

  createClass(OpenX, [{
    key: 'bid',
    value: function bid() {
      var _this2 = this;

      debug('OpenX > bid');
      return new Promise$1(function (resolve) {
        var timer = setTimeout(function () {
          return resolve();
        }, _this2.cfgs.timeout || 2000);
        var isDesktop = window.innerWidth > 1024;
        var nc = isDesktop ? '7646-weatherBW' : '7646-weatherMW';

        debug('OpenX > bid > load script');
        loadScript('//weatherus-d.openx.net/w/1.0/jstag?nc=' + nc, { 'async': _this2.cfgs.async }).then(function () {
          debug('OpenX > bid > load script success > done');
          clearTimeout(timer);
          resolve();
        });
      });
    }
  }]);
  return OpenX;
}(ThirdParty);

OpenX.TOKEN = THIRD_PARTY_TOKEN$6;

var __moduleExports$84 = settle;

function settle(promises) {
  return Promise.resolve(promises).then(_settle);
}

function _settle(promises) {
  if (!Array.isArray(promises)) throw new TypeError('Expected an array of Promises');

  return Promise.all(promises.map(_settlePromise));
}

function _settlePromise(promise) {
  return Promise.resolve(promise).then(_promiseResolved, _promiseRejected);
}

function _promiseResolved(result) {
  return {
    isFulfilled: _true,
    isRejected: _false,
    value: function value() {
      return result;
    },
    reason: _isFulfilled
  };
}

function _promiseRejected(err) {
  return {
    isFulfilled: _false,
    isRejected: _true,
    value: _isRejected,
    reason: function reason() {
      return err;
    }
  };
}

function _true() {
  return true;
}

function _false() {
  return false;
}

function _isRejected() {
  throw new Error('Promise is rejected');
}

function _isFulfilled() {
  throw new Error('Promise is fulfilled');
}

var index = __moduleExports$84;

// 7.2.1 RequireObjectCoercible(argument)
var __moduleExports$89 = function _defined(it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)
var defined = __moduleExports$89;
var __moduleExports$88 = function _toObject(it) {
  return Object(defined(it));
};

var hasOwnProperty$7 = {}.hasOwnProperty;
var __moduleExports$91 = function _has(it, key) {
  return hasOwnProperty$7.call(it, key);
};

var __moduleExports$94 = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var global$2 = __moduleExports$94;
var SHARED = '__core-js_shared__';
var store = global$2[SHARED] || (global$2[SHARED] = {});
var __moduleExports$93 = function _shared(key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var __moduleExports$95 = function _uid(key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = __moduleExports$93('keys');
var uid = __moduleExports$95;
var __moduleExports$92 = function _sharedKey(key) {
  return shared[key] || (shared[key] = uid(key));
};

var has = __moduleExports$91;
var toObject$1 = __moduleExports$88;
var IE_PROTO = __moduleExports$92('IE_PROTO');
var ObjectProto = Object.prototype;
var __moduleExports$90 = Object.getPrototypeOf || function (O) {
  O = toObject$1(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

var __moduleExports$98 = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.4.0' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var __moduleExports$100 = function _aFunction(it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = __moduleExports$100;
var __moduleExports$99 = function _ctx(fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

var __moduleExports$104 = function _isObject(it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

var isObject$5 = __moduleExports$104;
var __moduleExports$103 = function _anObject(it) {
  if (!isObject$5(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var __moduleExports$107 = function _fails(exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var __moduleExports$106 = !__moduleExports$107(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

var isObject$6 = __moduleExports$104;
var document$1 = __moduleExports$94.document;
var is = isObject$6(document$1) && isObject$6(document$1.createElement);
var __moduleExports$108 = function _domCreate(it) {
  return is ? document$1.createElement(it) : {};
};

var __moduleExports$105 = !__moduleExports$106 && !__moduleExports$107(function () {
  return Object.defineProperty(__moduleExports$108('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$7 = __moduleExports$104;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var __moduleExports$109 = function _toPrimitive(it, S) {
  if (!isObject$7(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject$7(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject$7(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject$7(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject = __moduleExports$103;
var IE8_DOM_DEFINE = __moduleExports$105;
var toPrimitive = __moduleExports$109;
var dP$1 = Object.defineProperty;
var f = __moduleExports$106 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP$1(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var __moduleExports$102 = {
  f: f
};

var __moduleExports$110 = function _propertyDesc(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var dP = __moduleExports$102;
var createDesc = __moduleExports$110;
var __moduleExports$101 = __moduleExports$106 ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var global$3 = __moduleExports$94;
var core$1 = __moduleExports$98;
var ctx = __moduleExports$99;
var hide = __moduleExports$101;
var PROTOTYPE = 'prototype';
var $export$1 = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      IS_WRAP = type & $export.W,
      exports = IS_GLOBAL ? core$1 : core$1[name] || (core$1[name] = {}),
      expProto = exports[PROTOTYPE],
      target = IS_GLOBAL ? global$3 : IS_STATIC ? global$3[name] : (global$3[name] || {})[PROTOTYPE],
      key,
      own,
      out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$3)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function F(a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();
            case 1:
              return new C(a);
            case 2:
              return new C(a, b);
          }return new C(a, b, c);
        }return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
      // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1; // forced
$export$1.G = 2; // global
$export$1.S = 4; // static
$export$1.P = 8; // proto
$export$1.B = 16; // bind
$export$1.W = 32; // wrap
$export$1.U = 64; // safe
$export$1.R = 128; // real proto method for `library`
var __moduleExports$97 = $export$1;

var $export = __moduleExports$97;
var core = __moduleExports$98;
var fails = __moduleExports$107;
var __moduleExports$96 = function _objectSap(KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY],
      exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};

var toObject = __moduleExports$88;
var $getPrototypeOf = __moduleExports$90;
__moduleExports$96('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

var __moduleExports$86 = __moduleExports$98.Object.getPrototypeOf;

var __moduleExports$85 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$86, __esModule: true };
});

unwrapExports(__moduleExports$85);

var __moduleExports$111 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  exports.default = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
});

unwrapExports(__moduleExports$111);

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var __moduleExports$118 = function _toInteger(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

var toInteger = __moduleExports$118;
var defined$1 = __moduleExports$89;
// true  -> String#at
// false -> String#codePointAt
var __moduleExports$117 = function _stringAt(TO_STRING) {
  return function (that, pos) {
    var s = String(defined$1(that)),
        i = toInteger(pos),
        l = s.length,
        a,
        b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var __moduleExports$120 = true;

var __moduleExports$121 = __moduleExports$101;

var __moduleExports$122 = {};

var toString = {}.toString;

var __moduleExports$130 = function _cof(it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __moduleExports$130;
var __moduleExports$129 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

var IObject = __moduleExports$129;
var defined$2 = __moduleExports$89;
var __moduleExports$128 = function _toIobject(it) {
  return IObject(defined$2(it));
};

var toInteger$1 = __moduleExports$118;
var min = Math.min;
var __moduleExports$132 = function _toLength(it) {
  return it > 0 ? min(toInteger$1(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$2 = __moduleExports$118;
var max = Math.max;
var min$1 = Math.min;
var __moduleExports$133 = function _toIndex(index, length) {
  index = toInteger$2(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

var toIObject$1 = __moduleExports$128;
var toLength = __moduleExports$132;
var toIndex = __moduleExports$133;
var __moduleExports$131 = function _arrayIncludes(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject$1($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

var has$2 = __moduleExports$91;
var toIObject = __moduleExports$128;
var arrayIndexOf = __moduleExports$131(false);
var IE_PROTO$2 = __moduleExports$92('IE_PROTO');
var __moduleExports$127 = function _objectKeysInternal(object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO$2) has$2(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has$2(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

// IE 8- don't enum bug keys
var __moduleExports$134 = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

var $keys = __moduleExports$127;
var enumBugKeys$1 = __moduleExports$134;
var __moduleExports$126 = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys$1);
};

var dP$2 = __moduleExports$102;
var anObject$2 = __moduleExports$103;
var getKeys = __moduleExports$126;
var __moduleExports$125 = __moduleExports$106 ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$2(O);
  var keys = getKeys(Properties),
      length = keys.length,
      i = 0,
      P;
  while (length > i) {
    dP$2.f(O, P = keys[i++], Properties[P]);
  }return O;
};

var __moduleExports$135 = __moduleExports$94.document && document.documentElement;

var anObject$1 = __moduleExports$103;
var dPs = __moduleExports$125;
var enumBugKeys = __moduleExports$134;
var IE_PROTO$1 = __moduleExports$92('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE$1 = 'prototype';
// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __moduleExports$108('iframe'),
      i = enumBugKeys.length,
      lt = '<',
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  __moduleExports$135.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE$1][enumBugKeys[i]];
  }return _createDict();
};

var __moduleExports$124 = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = anObject$1(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

var __moduleExports$137 = createCommonjsModule(function (module) {
  var store = __moduleExports$93('wks'),
      uid = __moduleExports$95,
      _Symbol = __moduleExports$94.Symbol,
      USE_SYMBOL = typeof _Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
  };

  $exports.store = store;
});

var def = __moduleExports$102.f;
var has$3 = __moduleExports$91;
var TAG = __moduleExports$137('toStringTag');
var __moduleExports$136 = function _setToStringTag(it, tag, stat) {
  if (it && !has$3(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var create = __moduleExports$124;
var descriptor = __moduleExports$110;
var setToStringTag$1 = __moduleExports$136;
var IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__moduleExports$101(IteratorPrototype, __moduleExports$137('iterator'), function () {
  return this;
});

var __moduleExports$123 = function _iterCreate(Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag$1(Constructor, NAME + ' Iterator');
};

var LIBRARY = __moduleExports$120;
var $export$2 = __moduleExports$97;
var redefine = __moduleExports$121;
var hide$1 = __moduleExports$101;
var has$1 = __moduleExports$91;
var Iterators = __moduleExports$122;
var $iterCreate = __moduleExports$123;
var setToStringTag = __moduleExports$136;
var getPrototypeOf$1 = __moduleExports$90;
var ITERATOR = __moduleExports$137('iterator');
var BUGGY = !([].keys && 'next' in [].keys());
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';
var returnThis = function returnThis() {
  return this;
};

var __moduleExports$119 = function _iterDefine(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator',
      DEF_VALUES = DEFAULT == VALUES,
      VALUES_BUG = false,
      proto = Base.prototype,
      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
      $default = $native || getMethod(DEFAULT),
      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
      methods,
      key,
      IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf$1($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has$1(IteratorPrototype, ITERATOR)) hide$1(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide$1(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export$2($export$2.P + $export$2.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = __moduleExports$117(true);

// 21.1.3.27 String.prototype[@@iterator]()
__moduleExports$119(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t,
      index = this._i,
      point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var __moduleExports$140 = function _addToUnscopables() {/* empty */};

var __moduleExports$141 = function _iterStep(done, value) {
  return { value: value, done: !!done };
};

var addToUnscopables = __moduleExports$140;
var step = __moduleExports$141;
var Iterators$2 = __moduleExports$122;
var toIObject$2 = __moduleExports$128;
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var __moduleExports$139 = __moduleExports$119(Array, 'Array', function (iterated, kind) {
  this._t = toIObject$2(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t,
      kind = this._k,
      index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators$2.Arguments = Iterators$2.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var global$4 = __moduleExports$94;
var hide$2 = __moduleExports$101;
var Iterators$1 = __moduleExports$122;
var TO_STRING_TAG = __moduleExports$137('toStringTag');
for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
  var NAME = collections[i],
      Collection = global$4[NAME],
      proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide$2(proto, TO_STRING_TAG, NAME);
  Iterators$1[NAME] = Iterators$1.Array;
}

var f$1 = __moduleExports$137;

var __moduleExports$142 = {
	f: f$1
};

var __moduleExports$115 = __moduleExports$142.f('iterator');

var __moduleExports$114 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$115, __esModule: true };
});

unwrapExports(__moduleExports$114);

var __moduleExports$146 = createCommonjsModule(function (module) {
  var META = __moduleExports$95('meta'),
      isObject = __moduleExports$104,
      has = __moduleExports$91,
      setDesc = __moduleExports$102.f,
      id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !__moduleExports$107(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function setMeta(it) {
    setDesc(it, META, { value: {
        i: 'O' + ++id, // object ID
        w: {} // weak collections IDs
      } });
  };
  var fastKey = function fastKey(it, create) {
    // return primitive with prefix
    if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
      // return object ID
    }return it[META].i;
  };
  var getWeak = function getWeak(it, create) {
    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
      // return hash weak collections IDs
    }return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function onFreeze(it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
});

var global$6 = __moduleExports$94;
var core$2 = __moduleExports$98;
var LIBRARY$1 = __moduleExports$120;
var wksExt$1 = __moduleExports$142;
var defineProperty$1 = __moduleExports$102.f;
var __moduleExports$147 = function _wksDefine(name) {
  var $Symbol = core$2.Symbol || (core$2.Symbol = LIBRARY$1 ? {} : global$6.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$1($Symbol, name, { value: wksExt$1.f(name) });
};

var getKeys$1 = __moduleExports$126;
var toIObject$4 = __moduleExports$128;
var __moduleExports$148 = function _keyof(object, el) {
  var O = toIObject$4(object),
      keys = getKeys$1(O),
      length = keys.length,
      index = 0,
      key;
  while (length > index) {
    if (O[key = keys[index++]] === el) return key;
  }
};

var f$2 = Object.getOwnPropertySymbols;

var __moduleExports$150 = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var __moduleExports$151 = {
	f: f$3
};

var getKeys$2 = __moduleExports$126;
var gOPS = __moduleExports$150;
var pIE = __moduleExports$151;
var __moduleExports$149 = function _enumKeys(it) {
  var result = getKeys$2(it),
      getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it),
        isEnum = pIE.f,
        i = 0,
        key;
    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }return result;
};

// 7.2.2 IsArray(argument)
var cof$1 = __moduleExports$130;
var __moduleExports$152 = Array.isArray || function isArray(arg) {
  return cof$1(arg) == 'Array';
};

var $keys$2 = __moduleExports$127;
var hiddenKeys = __moduleExports$134.concat('length', 'prototype');
var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys$2(O, hiddenKeys);
};

var __moduleExports$154 = {
  f: f$5
};

var toIObject$5 = __moduleExports$128;
var gOPN$1 = __moduleExports$154.f;
var toString$1 = {}.toString;
var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$5(it));
};

var __moduleExports$153 = {
  f: f$4
};

var pIE$1 = __moduleExports$151;
var createDesc$2 = __moduleExports$110;
var toIObject$6 = __moduleExports$128;
var toPrimitive$2 = __moduleExports$109;
var has$5 = __moduleExports$91;
var IE8_DOM_DEFINE$1 = __moduleExports$105;
var gOPD$1 = Object.getOwnPropertyDescriptor;
var f$6 = __moduleExports$106 ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIObject$6(O);
  P = toPrimitive$2(P, true);
  if (IE8_DOM_DEFINE$1) try {
    return gOPD$1(O, P);
  } catch (e) {/* empty */}
  if (has$5(O, P)) return createDesc$2(!pIE$1.f.call(O, P), O[P]);
};

var __moduleExports$155 = {
  f: f$6
};

var global$5 = __moduleExports$94;
var has$4 = __moduleExports$91;
var DESCRIPTORS = __moduleExports$106;
var $export$3 = __moduleExports$97;
var redefine$1 = __moduleExports$121;
var META = __moduleExports$146.KEY;
var $fails = __moduleExports$107;
var shared$1 = __moduleExports$93;
var setToStringTag$2 = __moduleExports$136;
var uid$1 = __moduleExports$95;
var wks = __moduleExports$137;
var wksExt = __moduleExports$142;
var wksDefine = __moduleExports$147;
var keyOf = __moduleExports$148;
var enumKeys = __moduleExports$149;
var isArray$3 = __moduleExports$152;
var anObject$3 = __moduleExports$103;
var toIObject$3 = __moduleExports$128;
var toPrimitive$1 = __moduleExports$109;
var createDesc$1 = __moduleExports$110;
var _create = __moduleExports$124;
var gOPNExt = __moduleExports$153;
var $GOPD = __moduleExports$155;
var $DP = __moduleExports$102;
var $keys$1 = __moduleExports$126;
var gOPD = $GOPD.f;
var dP$3 = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global$5.Symbol;
var $JSON = global$5.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared$1('symbol-registry');
var AllSymbols = shared$1('symbols');
var OPSymbols = shared$1('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global$5.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP$3({}, 'a', {
    get: function get() {
      return dP$3(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$3(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$3(ObjectProto$1, key, protoDesc);
} : dP$3;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol$2 = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  anObject$3(it);
  key = toPrimitive$1(key, true);
  anObject$3(D);
  if (has$4(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has$4(it, HIDDEN)) dP$3(it, HIDDEN, createDesc$1(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has$4(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc$1(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP$3(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject$3(it);
  var keys = enumKeys(P = toIObject$3(P)),
      i = 0,
      l = keys.length,
      key;
  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive$1(key, true));
  if (this === ObjectProto$1 && has$4(AllSymbols, key) && !has$4(OPSymbols, key)) return false;
  return E || !has$4(this, key) || !has$4(AllSymbols, key) || has$4(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject$3(it);
  key = toPrimitive$1(key, true);
  if (it === ObjectProto$1 && has$4(AllSymbols, key) && !has$4(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has$4(AllSymbols, key) && !(has$4(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject$3(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (!has$4(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1,
      names = gOPN(IS_OP ? OPSymbols : toIObject$3(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (has$4(AllSymbols, key = names[i++]) && (IS_OP ? has$4(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid$1(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function $set(value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (has$4(this, HIDDEN) && has$4(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc$1(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine$1($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __moduleExports$154.f = gOPNExt.f = $getOwnPropertyNames;
  __moduleExports$151.f = $propertyIsEnumerable;
  __moduleExports$150.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__moduleExports$120) {
    redefine$1(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export$3($export$3.G + $export$3.W + $export$3.F * !USE_NATIVE, { Symbol: $Symbol });

for (var symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
  wks(symbols[i++]);
}for (var symbols = $keys$1(wks.store), i$1 = 0; symbols.length > i$1;) {
  wksDefine(symbols[i$1++]);
}$export$3($export$3.S + $export$3.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has$4(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key) {
    if (isSymbol$2(key)) return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});

$export$3($export$3.S + $export$3.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export$3($export$3.S + $export$3.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol$2(it)) return; // IE8 returns string on undefined
    var args = [it],
        i = 1,
        replacer,
        $replacer;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray$3(replacer)) replacer = function replacer(key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol$2(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || __moduleExports$101($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag$2($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag$2(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag$2(global$5.JSON, 'JSON', true);



var es6_object_toString = Object.freeze({

});

__moduleExports$147('asyncIterator');

__moduleExports$147('observable');

var __moduleExports$144 = __moduleExports$98.Symbol;

var __moduleExports$143 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$144, __esModule: true };
});

unwrapExports(__moduleExports$143);

var __moduleExports$113 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _iterator = __moduleExports$114;

  var _iterator2 = _interopRequireDefault(_iterator);

  var _symbol = __moduleExports$143;

  var _symbol2 = _interopRequireDefault(_symbol);

  var _typeof$$ = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  };

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = typeof _symbol2.default === "function" && _typeof$$(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof$$(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof$$(obj);
  };
});

unwrapExports(__moduleExports$113);

var __moduleExports$112 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _typeof2 = __moduleExports$113;

  var _typeof3 = _interopRequireDefault(_typeof2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  };
});

unwrapExports(__moduleExports$112);

var isObject$8 = __moduleExports$104;
var anObject$4 = __moduleExports$103;
var check = function check(O, proto) {
  anObject$4(O);
  if (!isObject$8(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var __moduleExports$162 = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = __moduleExports$99(Function.call, __moduleExports$155.f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export$4 = __moduleExports$97;
$export$4($export$4.S, 'Object', { setPrototypeOf: __moduleExports$162.set });

var __moduleExports$160 = __moduleExports$98.Object.setPrototypeOf;

var __moduleExports$159 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$160, __esModule: true };
});

unwrapExports(__moduleExports$159);

var $export$5 = __moduleExports$97;
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export$5($export$5.S, 'Object', { create: __moduleExports$124 });

var $Object = __moduleExports$98.Object;
var __moduleExports$164 = function create(P, D) {
  return $Object.create(P, D);
};

var __moduleExports$163 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$164, __esModule: true };
});

unwrapExports(__moduleExports$163);

var __moduleExports$158 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _setPrototypeOf = __moduleExports$159;

  var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

  var _create = __moduleExports$163;

  var _create2 = _interopRequireDefault(_create);

  var _typeof2 = __moduleExports$113;

  var _typeof3 = _interopRequireDefault(_typeof2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }

    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  };
});

unwrapExports(__moduleExports$158);

var $export$6 = __moduleExports$97;
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export$6($export$6.S + $export$6.F * !__moduleExports$106, 'Object', { defineProperty: __moduleExports$102.f });

var $Object$1 = __moduleExports$98.Object;
var __moduleExports$169 = function defineProperty(it, key, desc) {
  return $Object$1.defineProperty(it, key, desc);
};

var __moduleExports$168 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$169, __esModule: true };
});

unwrapExports(__moduleExports$168);

var __moduleExports$167 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _defineProperty = __moduleExports$168;

  var _defineProperty2 = _interopRequireDefault(_defineProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (obj, key, value) {
    if (key in obj) {
      (0, _defineProperty2.default)(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };
});

unwrapExports(__moduleExports$167);

var getKeys$3 = __moduleExports$126;
var gOPS$1 = __moduleExports$150;
var pIE$2 = __moduleExports$151;
var toObject$2 = __moduleExports$88;
var IObject$1 = __moduleExports$129;
var $assign = Object.assign;
// should work with symbols and should have deterministic property order (V8 bug)
var __moduleExports$175 = !$assign || __moduleExports$107(function () {
  var A = {},
      B = {},
      S = Symbol(),
      K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject$2(target),
      aLen = arguments.length,
      index = 1,
      getSymbols = gOPS$1.f,
      isEnum = pIE$2.f;
  while (aLen > index) {
    var S = IObject$1(arguments[index++]),
        keys = getSymbols ? getKeys$3(S).concat(getSymbols(S)) : getKeys$3(S),
        length = keys.length,
        j = 0,
        key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)
var $export$7 = __moduleExports$97;

$export$7($export$7.S + $export$7.F, 'Object', { assign: __moduleExports$175 });

var __moduleExports$173 = __moduleExports$98.Object.assign;

var __moduleExports$172 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$173, __esModule: true };
});

unwrapExports(__moduleExports$172);

var __moduleExports$171 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _assign = __moduleExports$172;

  var _assign2 = _interopRequireDefault(_assign);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
});

unwrapExports(__moduleExports$171);

var cof$2 = __moduleExports$130;
var TAG$1 = __moduleExports$137('toStringTag');
var ARG = cof$2(function () {
  return arguments;
}()) == 'Arguments';
// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

var __moduleExports$179 = function _classof(it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
  // builtinTag case
  : ARG ? cof$2(O)
  // ES3 arguments fallback
  : (B = cof$2(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var __moduleExports$180 = function _anInstance(it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

// call something on iterator step with safe closing on error
var anObject$5 = __moduleExports$103;
var __moduleExports$182 = function _iterCall(iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject$5(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject$5(ret.call(iterator));
    throw e;
  }
};

var Iterators$3 = __moduleExports$122;
var ITERATOR$1 = __moduleExports$137('iterator');
var ArrayProto = Array.prototype;
var __moduleExports$183 = function _isArrayIter(it) {
  return it !== undefined && (Iterators$3.Array === it || ArrayProto[ITERATOR$1] === it);
};

var classof$1 = __moduleExports$179;
var ITERATOR$2 = __moduleExports$137('iterator');
var Iterators$4 = __moduleExports$122;
var __moduleExports$184 = __moduleExports$98.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2] || it['@@iterator'] || Iterators$4[classof$1(it)];
};

var __moduleExports$181 = createCommonjsModule(function (module) {
  var ctx = __moduleExports$99,
      call = __moduleExports$182,
      isArrayIter = __moduleExports$183,
      anObject = __moduleExports$103,
      toLength = __moduleExports$132,
      getIterFn = __moduleExports$184,
      BREAK = {},
      RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : getIterFn(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        index = 0,
        length,
        step,
        iterator,
        result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
      result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = call(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
});

var anObject$6 = __moduleExports$103;
var aFunction$2 = __moduleExports$100;
var SPECIES = __moduleExports$137('species');
var __moduleExports$185 = function _speciesConstructor(O, D) {
  var C = anObject$6(O).constructor,
      S;
  return C === undefined || (S = anObject$6(C)[SPECIES]) == undefined ? D : aFunction$2(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var __moduleExports$187 = function _invoke(fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

var ctx$2 = __moduleExports$99;
var invoke = __moduleExports$187;
var html = __moduleExports$135;
var cel = __moduleExports$108;
var global$8 = __moduleExports$94;
var process$2 = global$8.process;
var setTask = global$8.setImmediate;
var clearTask = global$8.clearImmediate;
var MessageChannel$1 = global$8.MessageChannel;
var counter = 0;
var queue$1 = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function run() {
  var id = +this;
  if (queue$1.hasOwnProperty(id)) {
    var fn = queue$1[id];
    delete queue$1[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue$1[++counter] = function () {
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue$1[id];
  };
  // Node.js 0.8-
  if (__moduleExports$130(process$2) == 'process') {
    defer = function defer(id) {
      process$2.nextTick(ctx$2(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel$1) {
    channel = new MessageChannel$1();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx$2(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global$8.addEventListener && typeof postMessage == 'function' && !global$8.importScripts) {
    defer = function defer(id) {
      global$8.postMessage(id + '', '*');
    };
    global$8.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx$2(run, id, 1), 0);
    };
  }
}
var __moduleExports$186 = {
  set: setTask,
  clear: clearTask
};

var global$9 = __moduleExports$94;
var macrotask = __moduleExports$186.set;
var Observer = global$9.MutationObserver || global$9.WebKitMutationObserver;
var process$3 = global$9.process;
var Promise$2 = global$9.Promise;
var isNode$1 = __moduleExports$130(process$3) == 'process';
var __moduleExports$188 = function _microtask() {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode$1 && (parent = process$3.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function notify() {
      process$3.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$2 && Promise$2.resolve) {
    var promise = Promise$2.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global$9, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

var hide$3 = __moduleExports$101;
var __moduleExports$189 = function _redefineAll(target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];else hide$3(target, key, src[key]);
  }return target;
};

var global$10 = __moduleExports$94;
var core$3 = __moduleExports$98;
var dP$4 = __moduleExports$102;
var DESCRIPTORS$1 = __moduleExports$106;
var SPECIES$1 = __moduleExports$137('species');
var __moduleExports$190 = function _setSpecies(KEY) {
  var C = typeof core$3[KEY] == 'function' ? core$3[KEY] : global$10[KEY];
  if (DESCRIPTORS$1 && C && !C[SPECIES$1]) dP$4.f(C, SPECIES$1, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

var ITERATOR$3 = __moduleExports$137('iterator');
var SAFE_CLOSING = false;
try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

var __moduleExports$191 = function _iterDetect(exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7],
        iter = arr[ITERATOR$3]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR$3] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

var LIBRARY$2 = __moduleExports$120;
var global$7 = __moduleExports$94;
var ctx$1 = __moduleExports$99;
var classof = __moduleExports$179;
var $export$8 = __moduleExports$97;
var isObject$9 = __moduleExports$104;
var aFunction$1 = __moduleExports$100;
var anInstance = __moduleExports$180;
var forOf = __moduleExports$181;
var speciesConstructor = __moduleExports$185;
var task = __moduleExports$186.set;
var microtask = __moduleExports$188();
var PROMISE = 'Promise';
var TypeError$1 = global$7.TypeError;
var $Promise = global$7[PROMISE];
var process$1 = global$7.process;
var isNode = classof(process$1) == 'process';
var empty = function empty() {/* empty */};
var Internal;
var GenericPromiseCapability;
var Wrapper;
var USE_NATIVE$1 = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[__moduleExports$137('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject$9(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError$1('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global$7, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
        if (isNode) {
          process$1.emit('unhandledRejection', value, promise);
        } else if (handler = global$7.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global$7.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global$7, function () {
    var handler;
    if (isNode) {
      process$1.emit('rejectionHandled', promise);
    } else if (handler = global$7.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx$1($resolve, wrapper, 1), ctx$1($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction$1(executor);
    Internal.call(this);
    try {
      executor(ctx$1($resolve, this, 1), ctx$1($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = __moduleExports$189($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process$1.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx$1($resolve, promise, 1);
    this.reject = ctx$1($reject, promise, 1);
  };
}

$export$8($export$8.G + $export$8.W + $export$8.F * !USE_NATIVE$1, { Promise: $Promise });
__moduleExports$136($Promise, PROMISE);
__moduleExports$190(PROMISE);
Wrapper = __moduleExports$98[PROMISE];

// statics
$export$8($export$8.S + $export$8.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export$8($export$8.S + $export$8.F * (LIBRARY$2 || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export$8($export$8.S + $export$8.F * !(USE_NATIVE$1 && __moduleExports$191(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});

var __moduleExports$177 = __moduleExports$98.Promise;

var __moduleExports$176 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$177, __esModule: true };
});

unwrapExports(__moduleExports$176);

var __moduleExports$192 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.__esModule = true;

  var _defineProperty = __moduleExports$168;

  var _defineProperty2 = _interopRequireDefault(_defineProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        (0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
});

unwrapExports(__moduleExports$192);

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

var fetch$1 = Object.freeze({

});

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.

var __moduleExports$194 = self.fetch.bind(self);

var __moduleExports$195 = createCommonjsModule(function (module, exports) {
  /*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   3.3.1
   */

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
  })(commonjsGlobal, function () {
    'use strict';

    function objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
    }

    function isFunction(x) {
      return typeof x === 'function';
    }

    var _isArray = undefined;
    if (!Array.isArray) {
      _isArray = function _isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      _isArray = Array.isArray;
    }

    var isArray = _isArray;

    var len = 0;
    var vertxNext = undefined;
    var customSchedulerFn = undefined;

    var asap = function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (customSchedulerFn) {
          customSchedulerFn(flush);
        } else {
          scheduleFlush();
        }
      }
    };

    function setScheduler(scheduleFn) {
      customSchedulerFn = scheduleFn;
    }

    function setAsap(asapFn) {
      asap = asapFn;
    }

    var browserWindow = typeof window !== 'undefined' ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

    // node
    function useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function () {
        return $inject_process_nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      return function () {
        vertxNext(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function () {
        node.data = iterations = ++iterations % 2;
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function () {
        return channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      // Store setTimeout reference so es6-promise will be unaffected by
      // other code modifying setTimeout (like sinon.useFakeTimers())
      var globalSetTimeout = setTimeout;
      return function () {
        return globalSetTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];

        callback(arg);

        queue[i] = undefined;
        queue[i + 1] = undefined;
      }

      len = 0;
    }

    function attemptVertx() {
      try {
        var r = commonjsRequire;
        var vertx = r('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush = undefined;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
      scheduleFlush = attemptVertx();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function then(onFulfillment, onRejection) {
      var _arguments = arguments;

      var parent = this;

      var child = new this.constructor(noop);

      if (child[PROMISE_ID] === undefined) {
        makePromise(child);
      }

      var _state = parent._state;

      if (_state) {
        (function () {
          var callback = _arguments[_state - 1];
          asap(function () {
            return invokeCallback(_state, child, callback, parent._result);
          });
        })();
      } else {
        subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }

    /**
      `Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        resolve(1);
      });

      promise.then(function(value){
        // value === 1
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.resolve(1);

      promise.then(function(value){
        // value === 1
      });
      ```

      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    function resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(noop);
      _resolve(promise, object);
      return promise;
    }

    var PROMISE_ID = Math.random().toString(36).substring(16);

    function noop() {}

    var PENDING = void 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var GET_THEN_ERROR = new ErrorObject();

    function selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        GET_THEN_ERROR.error = error;
        return GET_THEN_ERROR;
      }
    }

    function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then) {
      asap(function (promise) {
        var sealed = false;
        var error = tryThen(then, thenable, function (value) {
          if (sealed) {
            return;
          }
          sealed = true;
          if (thenable !== value) {
            _resolve(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function (reason) {
          if (sealed) {
            return;
          }
          sealed = true;

          _reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          _reject(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        _reject(promise, thenable._result);
      } else {
        subscribe(thenable, undefined, function (value) {
          return _resolve(promise, value);
        }, function (reason) {
          return _reject(promise, reason);
        });
      }
    }

    function handleMaybeThenable(promise, maybeThenable, then$$) {
      if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        if (then$$ === GET_THEN_ERROR) {
          _reject(promise, GET_THEN_ERROR.error);
        } else if (then$$ === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then$$)) {
          handleForeignThenable(promise, maybeThenable, then$$);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function _resolve(promise, value) {
      if (promise === value) {
        _reject(promise, selfFulfillment());
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value, getThen(value));
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) {
        return;
      }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length !== 0) {
        asap(publish, promise);
      }
    }

    function _reject(promise, reason) {
      if (promise._state !== PENDING) {
        return;
      }
      promise._state = REJECTED;
      promise._result = reason;

      asap(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var _subscribers = parent._subscribers;
      var length = _subscribers.length;

      parent._onerror = null;

      _subscribers[length] = child;
      _subscribers[length + FULFILLED] = onFulfillment;
      _subscribers[length + REJECTED] = onRejection;

      if (length === 0 && parent._state) {
        asap(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) {
        return;
      }

      var child = undefined,
          callback = undefined,
          detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function ErrorObject() {
      this.error = null;
    }

    var TRY_CATCH_ERROR = new ErrorObject();

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value = undefined,
          error = undefined,
          succeeded = undefined,
          failed = undefined;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          _reject(promise, cannotReturnOwn());
          return;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        _resolve(promise, value);
      } else if (failed) {
        _reject(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        _reject(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value) {
          _resolve(promise, value);
        }, function rejectPromise(reason) {
          _reject(promise, reason);
        });
      } catch (e) {
        _reject(promise, e);
      }
    }

    var id = 0;
    function nextId() {
      return id++;
    }

    function makePromise(promise) {
      promise[PROMISE_ID] = id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this._input = input;
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        _reject(this.promise, validationError());
      }
    }

    function validationError() {
      return new Error('Array Methods must be provided an Array');
    };

    Enumerator.prototype._enumerate = function () {
      var length = this.length;
      var _input = this._input;

      for (var i = 0; this._state === PENDING && i < length; i++) {
        this._eachEntry(_input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function (entry, i) {
      var c = this._instanceConstructor;
      var resolve$$ = c.resolve;

      if (resolve$$ === resolve) {
        var _then = getThen(entry);

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise) {
          var promise = new c(noop);
          handleMaybeThenable(promise, entry, _then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$) {
            return resolve$$(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function (state, i, value) {
      var promise = this.promise;

      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          _reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function (promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    /**
      `Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = resolve(2);
      let promise3 = resolve(3);
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = reject(new Error("2"));
      let promise3 = reject(new Error("3"));
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    function all(entries) {
      return new Enumerator(this, entries).promise;
    }

    /**
      `Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.

      Example:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```

      `Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      An example real-world use case is implementing timeouts:

      ```javascript
      Promise.race([ajax('foo.json'), timeout(5000)])
      ```

      @method race
      @static
      @param {Array} promises array of promises to observe
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    function race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!isArray(entries)) {
        return new Constructor(function (_, reject) {
          return reject(new TypeError('You must pass an array to race.'));
        });
      } else {
        return new Constructor(function (resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }

    /**
      `Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop);
      _reject(promise, reason);
      return promise;
    }

    function needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      let promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          let xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = resolve;
    Promise.reject = reject;
    Promise._setScheduler = setScheduler;
    Promise._setAsap = setAsap;
    Promise._asap = asap;

    Promise.prototype = {
      constructor: Promise,

      /**
        The primary way of interacting with a promise is through its `then` method,
        which registers callbacks to receive either a promise's eventual value or the
        reason why the promise cannot be fulfilled.

        ```js
        findUser().then(function(user){
          // user is available
        }, function(reason){
          // user is unavailable, and you are given the reason why
        });
        ```

        Chaining
        --------

        The return value of `then` is itself a promise.  This second, 'downstream'
        promise is resolved with the return value of the first promise's fulfillment
        or rejection handler, or rejected if the handler throws an exception.

        ```js
        findUser().then(function (user) {
          return user.name;
        }, function (reason) {
          return 'default name';
        }).then(function (userName) {
          // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
          // will be `'default name'`
        });

        findUser().then(function (user) {
          throw new Error('Found user, but still unhappy');
        }, function (reason) {
          throw new Error('`findUser` rejected and we're unhappy');
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
          // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
        });
        ```
        If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

        ```js
        findUser().then(function (user) {
          throw new PedagogicalException('Upstream error');
        }).then(function (value) {
          // never reached
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // The `PedgagocialException` is propagated all the way down to here
        });
        ```

        Assimilation
        ------------

        Sometimes the value you want to propagate to a downstream promise can only be
        retrieved asynchronously. This can be achieved by returning a promise in the
        fulfillment or rejection handler. The downstream promise will then be pending
        until the returned promise is settled. This is called *assimilation*.

        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // The user's comments are now available
        });
        ```

        If the assimliated promise rejects, then the downstream promise will also reject.

        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // If `findCommentsByAuthor` fulfills, we'll have the value here
        }, function (reason) {
          // If `findCommentsByAuthor` rejects, we'll have the reason here
        });
        ```

        Simple Example
        --------------

        Synchronous Example

        ```javascript
        let result;

        try {
          result = findResult();
          // success
        } catch(reason) {
          // failure
        }
        ```

        Errback Example

        ```js
        findResult(function(result, err){
          if (err) {
            // failure
          } else {
            // success
          }
        });
        ```

        Promise Example;

        ```javascript
        findResult().then(function(result){
          // success
        }, function(reason){
          // failure
        });
        ```

        Advanced Example
        --------------

        Synchronous Example

        ```javascript
        let author, books;

        try {
          author = findAuthor();
          books  = findBooksByAuthor(author);
          // success
        } catch(reason) {
          // failure
        }
        ```

        Errback Example

        ```js

        function foundBooks(books) {

        }

        function failure(reason) {

        }

        findAuthor(function(author, err){
          if (err) {
            failure(err);
            // failure
          } else {
            try {
              findBoooksByAuthor(author, function(books, err) {
                if (err) {
                  failure(err);
                } else {
                  try {
                    foundBooks(books);
                  } catch(reason) {
                    failure(reason);
                  }
                }
              });
            } catch(error) {
              failure(err);
            }
            // success
          }
        });
        ```

        Promise Example;

        ```javascript
        findAuthor().
          then(findBooksByAuthor).
          then(function(books){
            // found books
        }).catch(function(reason){
          // something went wrong
        });
        ```

        @method then
        @param {Function} onFulfilled
        @param {Function} onRejected
        Useful for tooling.
        @return {Promise}
      */
      then: then,

      /**
        `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
        as the catch block of a try/catch statement.

        ```js
        function findAuthor(){
          throw new Error('couldn't find that author');
        }

        // synchronous
        try {
          findAuthor();
        } catch(reason) {
          // something went wrong
        }

        // async with promises
        findAuthor().catch(function(reason){
          // something went wrong
        });
        ```

        @method catch
        @param {Function} onRejection
        Useful for tooling.
        @return {Promise}
      */
      'catch': function _catch(onRejection) {
        return this.then(null, onRejection);
      }
    };

    function polyfill() {
      var local = undefined;

      if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
      } else if (typeof self !== 'undefined') {
        local = self;
      } else {
        try {
          local = Function('return this')();
        } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
        }
      }

      var P = local.Promise;

      if (P) {
        var promiseToString = null;
        try {
          promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
          // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
          return;
        }
      }

      local.Promise = Promise;
    }

    polyfill();
    // Strange compat..
    Promise.polyfill = polyfill;
    Promise.Promise = Promise;

    return Promise;
  });
  });

var __moduleExports$197 = function parseCacheControl(field) {

  if (typeof field !== 'string') {
    return null;
  }

  /*
    Cache-Control   = 1#cache-directive
    cache-directive = token [ "=" ( token / quoted-string ) ]
    token           = [^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+
    quoted-string   = "(?:[^"\\]|\\.)*"
  */

  //                             1: directive                                        =   2: token                                              3: quoted-string
  var regex = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;

  var header = {};
  var err = field.replace(regex, function ($0, $1, $2, $3) {
    var value = $2 || $3;
    header[$1] = value ? value.toLowerCase() : true;
    return '';
  });

  if (header['max-age']) {
    try {
      var maxAge = parseInt(header['max-age'], 10);
      if (isNaN(maxAge)) {
        return null;
      }

      header['max-age'] = maxAge;
    } catch (err) {}
  }

  return err ? null : header;
};

var __moduleExports$196 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _promise = __moduleExports$176;

  var _promise2 = _interopRequireDefault(_promise);

  var _parseCacheControl = __moduleExports$197;

  var _parseCacheControl2 = _interopRequireDefault(_parseCacheControl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var cachedFetch = function cachedFetch(url, cacheConfig, options) {
    var CacheProvider = cacheConfig.CacheProvider,
        ttl = cacheConfig.ttl;

    return CacheProvider.get(url).then(function (cached) {

      if (cached) {
        var response = new Response(cached);

        return _promise2.default.resolve(response);
      }

      // clean up this old key
      CacheProvider.delete(url);

      return fetch(url, options).then(function (response) {
        if (response.status === 200) {
          (function () {
            var cacheControl = response.headers.get('cache-control');
            var cacheControlObj = (0, _parseCacheControl2.default)(cacheControl);
            var maxAge = cacheControlObj && cacheControlObj['max-age'];
            var dateHeader = response.headers.get('date');
            var date = dateHeader ? new Date(dateHeader).getTime() : new Date().getTime();
            var _ttl = ttl || maxAge;

            // There is a .json() instead of .text() but
            // we're going to store it in sessionStorage as
            // string anyway.
            // If we don't clone the response, it will be
            // consumed by the time it's returned. This
            // way we're being un-intrusive.
            if (_ttl) {
              response.clone().text().then(function (content) {
                CacheProvider.set({
                  key: url,
                  content: content,
                  ttl: _ttl,
                  date: date
                });
              });
            }
          })();
        }
        return response;
      });
    });
  };

  exports.default = cachedFetch;
});

unwrapExports(__moduleExports$196);

var isArray$5 = __moduleExports$21;
var isSymbol$3 = __moduleExports$5;
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$1(value, object) {
  if (isArray$5(value)) {
    return false;
  }
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$3(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

var __moduleExports$201 = isKey$1;

var MapCache$2 = __moduleExports$41;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function memoized() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2)();
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = MapCache$2;

var __moduleExports$204 = memoize$1;

var memoize = __moduleExports$204;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped$1(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var __moduleExports$203 = memoizeCapped$1;

var memoizeCapped = __moduleExports$203;

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoizeCapped(function (string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

var __moduleExports$202 = stringToPath$1;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var __moduleExports$207 = arrayMap$1;

var _Symbol$2 = __moduleExports$7;
var arrayMap = __moduleExports$207;
var isArray$6 = __moduleExports$21;
var isSymbol$4 = __moduleExports$5;
/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol$2 ? _Symbol$2.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$6(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString$1) + '';
  }
  if (isSymbol$4(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}

var __moduleExports$206 = baseToString$1;

var baseToString = __moduleExports$206;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$3(value) {
  return value == null ? '' : baseToString(value);
}

var __moduleExports$205 = toString$3;

var isArray$4 = __moduleExports$21;
var isKey = __moduleExports$201;
var stringToPath = __moduleExports$202;
var toString$2 = __moduleExports$205;
/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$1(value, object) {
  if (isArray$4(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString$2(value));
}

var __moduleExports$200 = castPath$1;

var isSymbol$5 = __moduleExports$5;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$1(value) {
  if (typeof value == 'string' || isSymbol$5(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
}

var __moduleExports$208 = toKey$1;

var castPath = __moduleExports$200;
var toKey = __moduleExports$208;
/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet$1(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

var __moduleExports$199 = baseGet$1;

var baseGet = __moduleExports$199;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var __moduleExports$198 = get$1;

/*! https://mths.be/punycode v1.4.1 by @mathias */

/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error$1(type) {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
  var length = array.length;
  var result = [];
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  var parts = string.split('@');
  var result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  var labels = string.split('.');
  var encoded = map(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  var output = [],
      counter = 0,
      length = string.length,
      value,
      extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) {
        // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(input) {
  var n,
      delta,
      handledCPCount,
      basicLength,
      bias,
      j,
      m,
      q,
      k,
      t,
      currentValue,
      output = [],

  /** `inputLength` will hold the number of code points in `input`. */
  inputLength,

  /** Cached calculation results */
  handledCPCountPlusOne,
      baseMinusT,
      qMinusT;

  // Convert the input in UCS-2 to Unicode
  input = ucs2decode(input);

  // Cache the length
  inputLength = input.length;

  // Initialize the state
  n = initialN;
  delta = 0;
  bias = initialBias;

  // Handle the basic code points
  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  handledCPCount = basicLength = output.length;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {

    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow
    handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      error$1('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < n && ++delta > maxInt) {
        error$1('overflow');
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base;; /* no condition */k += base) {
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) {
            break;
          }
          qMinusT = q - t;
          baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function (string) {
    return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
  });
}

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isString(arg) {
  return typeof arg === 'string';
}

function isObject$10(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty$9(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray$9 = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return map$1(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray$9(obj[k])) {
        return map$1(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

function map$1(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse$2(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty$9(obj, k)) {
      obj[k] = v;
    } else if (isArray$9(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var url = {
  parse: parse,
  resolve: resolve,
  resolveObject: resolveObject,
  format: format,
  Url: Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i;
var portPattern = /:[0-9]*$/;
var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
var delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'];
var unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims);
var autoEscape = ['\''].concat(unwise);
var nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape);
var hostEndingChars = ['/', '?', '#'];
var hostnameMaxLen = 255;
var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
var unsafeProtocol = {
  'javascript': true,
  'javascript:': true
};
var hostlessProtocol = {
  'javascript': true,
  'javascript:': true
};
var slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
};
function parse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject$10(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  return parse$1(this, url, parseQueryString, slashesDenoteHost);
};

function parse$1(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError('Parameter \'url\' must be a string, not ' + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, 'index.html');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      self.path = rest;
      self.href = rest;
      self.pathname = simplePath[1];
      if (simplePath[2]) {
        self.search = simplePath[2];
        if (parseQueryString) {
          self.query = parse$2(self.search.substr(1));
        } else {
          self.query = self.search.substr(1);
        }
      } else if (parseQueryString) {
        self.search = '';
        self.query = {};
      }
      return self;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self.slashes = true;
    }
  }
  var i, hec, l, p;
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    self.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    parseHost(self);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    self.hostname = self.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = self.hostname[0] === '[' && self.hostname[self.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            self.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = '';
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname);
    }

    p = self.port ? ':' + self.port : '';
    var h = self.hostname || '';
    self.host = h + p;
    self.href += self.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2);
      if (rest[0] !== 'index.html') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    self.search = rest.substr(qm);
    self.query = rest.substr(qm + 1);
    if (parseQueryString) {
      self.query = parse$2(self.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = '';
    self.query = {};
  }
  if (rest) self.pathname = rest;
  if (slashedProtocol[lowerProto] && self.hostname && !self.pathname) {
    self.pathname = 'index.html';
  }

  //to support http.request
  if (self.pathname || self.search) {
    p = self.pathname || '';
    var s = self.search || '';
    self.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  self.href = format$1(self);
  return self;
}

// format a parsed object into a url string
function format(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = parse$1({}, obj);
  return format$1(obj);
}

function format$1(self) {
  var auth = self.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = self.protocol || '',
      pathname = self.pathname || '',
      hash = self.hash || '',
      host = false,
      query = '';

  if (self.host) {
    host = auth + self.host;
  } else if (self.hostname) {
    host = auth + (self.hostname.indexOf(':') === -1 ? self.hostname : '[' + this.hostname + ']');
    if (self.port) {
      host += ':' + self.port;
    }
  }

  if (self.query && isObject$10(self.query) && Object.keys(self.query).length) {
    query = stringify(self.query);
  }

  var search = self.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (self.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== 'index.html') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
}

Url.prototype.format = function () {
  return format$1(this);
};

function resolve(source, relative) {
  return parse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(parse(relative, false, true)).format();
};

function resolveObject(source, relative) {
  if (!source) return relative;
  return parse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = 'index.html';
    }

    result.href = result.format();
    return result;
  }
  var relPath;
  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('index.html');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('index.html');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === 'index.html',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === 'index.html',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('index.html') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split('index.html') || [];
  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  var authInHost;
  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== 'index.html')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('index.html').substr(-1) !== 'index.html') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === 'index.html';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('index.html');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  return parseHost(this);
};

function parseHost(self) {
  var host = self.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      self.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) self.hostname = host;
}



var url$1 = Object.freeze({
  parse: parse,
  resolve: resolve,
  resolveObject: resolveObject,
  format: format,
  default: url,
  Url: Url
});

var require$$0 = ( url$1 && url$1['default'] ) || url$1;

var __moduleExports$193 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __moduleExports$192;

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _CachedFetch = __moduleExports$196;

  var _CachedFetch2 = _interopRequireDefault(_CachedFetch);

  var _get = __moduleExports$198;

  var _get2 = _interopRequireDefault(_get);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var url = require$$0;

  var metrics = (0, _get2.default)(process, ['env', 'METRICS_ENABLED']);

  /**
   * Network Access Layer
   */

  var DalClient = function () {
    function DalClient() {
      (0, _classCallCheck3.default)(this, DalClient);
    }

    (0, _createClass3.default)(DalClient, null, [{
      key: 'execute',
      value: function execute(config) {
        var urlConfig = config.urlConfig,
            fetchParams = config.fetchParams,
            cacheConfig = config.cacheConfig;

        var urlString = url.format(urlConfig);
        var now = new Date().getTime();
        var urlId = '$M$|' + urlString + '+' + now;

        if (metrics) {
          console.time(urlId);
        }

        return DalClient.executeNetworkCall(urlString, cacheConfig, fetchParams).then(function (response) {
          if (metrics) {
            console.timeEnd(urlId);
          }

          return response;
        });
      }
    }, {
      key: 'executeNetworkCall',
      value: function executeNetworkCall(urlStr) {
        var cacheConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var fetchParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        return cacheConfig.CacheProvider ? (0, _CachedFetch2.default)(urlStr, cacheConfig, fetchParams) : fetch(urlStr, fetchParams);
      }
    }]);
    return DalClient;
  }();

  exports.default = DalClient;
});

unwrapExports(__moduleExports$193);

var toObject$3 = __moduleExports$88;
var $keys$3 = __moduleExports$126;
__moduleExports$96('keys', function () {
  return function keys(it) {
    return $keys$3(toObject$3(it));
  };
});

var __moduleExports$211 = __moduleExports$98.Object.keys;

var __moduleExports$210 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$211, __esModule: true };
});

unwrapExports(__moduleExports$210);

var anObject$7 = __moduleExports$103;
var get$2 = __moduleExports$184;
var __moduleExports$215 = __moduleExports$98.getIterator = function (it) {
  var iterFn = get$2(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject$7(iterFn.call(it));
};

var __moduleExports$214 = __moduleExports$215;

var __moduleExports$213 = createCommonjsModule(function (module) {
  module.exports = { "default": __moduleExports$214, __esModule: true };
});

unwrapExports(__moduleExports$213);

var getNative$4 = __moduleExports$46;

var defineProperty$5 = function () {
  try {
    var func = getNative$4(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

var __moduleExports$220 = defineProperty$5;

var defineProperty$4 = __moduleExports$220;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue$1(object, key, value) {
  if (key == '__proto__' && defineProperty$4) {
    defineProperty$4(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var __moduleExports$219 = baseAssignValue$1;

var baseAssignValue = __moduleExports$219;
var eq$2 = __moduleExports$60;
/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$9.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue$1(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$10.call(object, key) && eq$2(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

var __moduleExports$218 = assignValue$1;

var assignValue = __moduleExports$218;
var castPath$2 = __moduleExports$200;
var isIndex$2 = __moduleExports$24;
var isObject$11 = __moduleExports;
var toKey$2 = __moduleExports$208;
/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet$1(object, path, value, customizer) {
  if (!isObject$11(object)) {
    return object;
  }
  path = castPath$2(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey$2(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject$11(objValue) ? objValue : isIndex$2(path[index + 1]) ? [] : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var __moduleExports$217 = baseSet$1;

var baseSet = __moduleExports$217;

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set$1(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

var __moduleExports$216 = set$1;

var __moduleExports$209 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getTransform = exports.transformCompactResponse = undefined;

  var _typeof2 = __moduleExports$113;

  var _typeof3 = _interopRequireDefault(_typeof2);

  var _keys = __moduleExports$210;

  var _keys2 = _interopRequireDefault(_keys);

  var _getIterator2 = __moduleExports$213;

  var _getIterator3 = _interopRequireDefault(_getIterator2);

  var _get = __moduleExports$198;

  var _get2 = _interopRequireDefault(_get);

  var _set = __moduleExports$216;

  var _set2 = _interopRequireDefault(_set);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var transformCompactResponse = exports.transformCompactResponse = function transformCompactResponse(rawData) {
    /* eslint-disable */
    var result = [];

    if (!rawData) {
      return result;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var key = _step.value;

        if (Array.isArray(rawData[key])) {
          rawData[key].forEach(function (data, index) {
            result[index] = result[index] || {};
            result[index][key] = data;
          });
        } else if (rawData[key] !== null && (0, _typeof3.default)(rawData[key]) === 'object') {
          transformCompactResponse(rawData[key]).forEach(function (innerData, index) {
            result[index] = result[index] || {};
            result[index][key] = innerData;
          });
        }
      };

      for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(rawData)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return result;
    /* eslint-enable */
  };

  var getTransform = exports.getTransform = function getTransform(config) {
    return function (data) {
      config.fields.forEach(function (field) {
        (0, _set2.default)(data, field, transformCompactResponse((0, _get2.default)(data, field)));
      });

      return data;
    };
  };
});

unwrapExports(__moduleExports$209);

var __moduleExports$166 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _defineProperty2 = __moduleExports$167;

  var _defineProperty3 = _interopRequireDefault(_defineProperty2);

  var _extends3 = __moduleExports$171;

  var _extends4 = _interopRequireDefault(_extends3);

  var _typeof2 = __moduleExports$113;

  var _typeof3 = _interopRequireDefault(_typeof2);

  var _promise = __moduleExports$176;

  var _promise2 = _interopRequireDefault(_promise);

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __moduleExports$192;

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _DalClient = __moduleExports$193;

  var _DalClient2 = _interopRequireDefault(_DalClient);

  var _transform = __moduleExports$209;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  /**
   * Base Model
   *
   *
   */
  var BaseModel = function () {

    /**
     * @constructor
     * @param {Object} configs
     * @param cacheConfig
     */
    function BaseModel(configs) {
      var cacheConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      (0, _classCallCheck3.default)(this, BaseModel);

      this.urlConfig = configs;
      this.cacheConfig = cacheConfig;
    }

    (0, _createClass3.default)(BaseModel, [{
      key: 'setRawData',
      value: function setRawData(rawData) {
        this.rawData = rawData;
        return rawData;
      }
    }, {
      key: 'handleErrors',
      value: function handleErrors() {
        var _this = this;

        var formatter = this.getFormatter();

        return function (response) {

          // `raw` format means that we return Response object regardless its status.
          if (!response.ok && _this.format !== 'raw') {
            var _ret = function () {
              var responseClone = response.clone();

              return {
                v: formatter(response).catch(function () {
                  return responseClone.text();
                }).then(function (data) {
                  return _promise2.default.reject({
                    message: 'API call error',
                    data: data,
                    url: response.url
                  });
                })
              };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
          }
          return response;
        };
      }

      /**
       *
       * @param fetchParams
       * @returns {*}
       */

    }, {
      key: 'execute',
      value: function execute() {
        var _this2 = this;

        var fetchParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.urlConfig.query = (0, _extends4.default)((0, _defineProperty3.default)({}, this.apiKeyName, this.urlConfig.apiKey), fetchParams);
        if (this.format) {
          this.urlConfig.query.format = this.format;
        }

        this.urlConfig.pathname = this.resource;
        return _DalClient2.default.execute({ urlConfig: this.urlConfig, cacheConfig: this.cacheConfig, fetchParams: fetchParams }).then(this.handleErrors()).then(this.getFormatter()).then(function (data) {
          return _this2.setRawData(data);
        }).then(function (data) {
          return _this2.transform(data);
        });
      }
    }, {
      key: 'getFormatter',
      value: function getFormatter() {
        var _this3 = this;

        var params = this.urlConfig.query || {};
        var format = params.format || this.responseFormat;

        return function (response) {
          var result = void 0;

          switch (format) {
            case 'json':
              result = response.json();
              break;
            case 'raw':
              result = _promise2.default.resolve(response);
              _this3.transformConfig = false;
              break;
            default:
              result = response.text();
          }

          return result;
        };
      }
    }, {
      key: 'transform',
      value: function transform(data) {
        if (!this.transformConfig) {
          return data;
        }
        var transformFunc = (0, _transform.getTransform)(this.transformConfig);

        return transformFunc(data);
      }
    }]);
    return BaseModel;
  }();

  exports.default = BaseModel;
});

unwrapExports(__moduleExports$166);

var Observation_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __moduleExports$85;

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _possibleConstructorReturn2 = __moduleExports$112;

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __moduleExports$158;

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _BaseModel2 = __moduleExports$166;

  var _BaseModel3 = _interopRequireDefault(_BaseModel2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var Observation = function (_BaseModel) {
    (0, _inherits3.default)(Observation, _BaseModel);

    function Observation(configs, cacheConfig) {
      (0, _classCallCheck3.default)(this, Observation);

      var _this = (0, _possibleConstructorReturn3.default)(this, (Observation.__proto__ || (0, _getPrototypeOf2.default)(Observation)).call(this, configs, cacheConfig));

      _this.resource = '/v2/turbo/vt1observation';
      _this.format = 'json';
      _this.apiKeyName = 'apiKey';
      return _this;
    }

    return Observation;
  }(_BaseModel3.default);

  Observation.api = {
    type: 'sun',
    version: 'v2'
  };

  exports.default = Observation;
});

var Observation = unwrapExports(Observation_1);

var DailyForecast_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __moduleExports$85;

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _possibleConstructorReturn2 = __moduleExports$112;

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __moduleExports$158;

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _BaseModel2 = __moduleExports$166;

  var _BaseModel3 = _interopRequireDefault(_BaseModel2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var DailyForecast = function (_BaseModel) {
    (0, _inherits3.default)(DailyForecast, _BaseModel);

    function DailyForecast(configs, cacheConfig) {
      (0, _classCallCheck3.default)(this, DailyForecast);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DailyForecast.__proto__ || (0, _getPrototypeOf2.default)(DailyForecast)).call(this, configs, cacheConfig));

      _this.resource = '/v2/turbo/vt1dailyForecast';
      _this.format = 'json';
      _this.apiKeyName = 'apiKey';
      _this.transformConfig = {
        fields: ['vt1dailyForecast']
      };
      return _this;
    }

    return DailyForecast;
  }(_BaseModel3.default);

  DailyForecast.api = {
    type: 'sun',
    version: 'v2'
  };

  exports.default = DailyForecast;
});

var DailyForecast = unwrapExports(DailyForecast_1);

var PollenForecast_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __moduleExports$85;

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _possibleConstructorReturn2 = __moduleExports$112;

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __moduleExports$158;

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _BaseModel2 = __moduleExports$166;

  var _BaseModel3 = _interopRequireDefault(_BaseModel2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var PollenForecast = function (_BaseModel) {
    (0, _inherits3.default)(PollenForecast, _BaseModel);

    function PollenForecast(configs, cacheConfig) {
      (0, _classCallCheck3.default)(this, PollenForecast);

      var product = 'vt1pollenforecast';

      var _this = (0, _possibleConstructorReturn3.default)(this, (PollenForecast.__proto__ || (0, _getPrototypeOf2.default)(PollenForecast)).call(this, configs, cacheConfig));

      _this.resource = '/v2/turbo/' + product;
      _this.format = 'json';
      _this.apiKeyName = 'apiKey';
      _this.transformConfig = {
        fields: ['vt1pollenforecast']
      };
      return _this;
    }

    return PollenForecast;
  }(_BaseModel3.default);

  PollenForecast.api = {
    type: 'sun',
    version: 'v2'
  };

  exports.default = PollenForecast;
});

var PollenForecast = unwrapExports(PollenForecast_1);

var Alerts_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getPrototypeOf = __moduleExports$85;

  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

  var _classCallCheck2 = __moduleExports$111;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _possibleConstructorReturn2 = __moduleExports$112;

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits2 = __moduleExports$158;

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _BaseModel2 = __moduleExports$166;

  var _BaseModel3 = _interopRequireDefault(_BaseModel2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var Alerts = function (_BaseModel) {
    (0, _inherits3.default)(Alerts, _BaseModel);

    function Alerts(configs, cacheConfig) {
      (0, _classCallCheck3.default)(this, Alerts);

      var _this = (0, _possibleConstructorReturn3.default)(this, (Alerts.__proto__ || (0, _getPrototypeOf2.default)(Alerts)).call(this, configs, cacheConfig));

      _this.resource = '/v2/turbo/vt1alerts';
      _this.format = 'json';
      _this.apiKeyName = 'apiKey';
      _this.transformConfig = {
        fields: ['vt1alerts']
      };
      return _this;
    }

    return Alerts;
  }(_BaseModel3.default);

  Alerts.api = {
    type: 'sun',
    version: 'v2'
  };

  exports.default = Alerts;
});

var Alerts = unwrapExports(Alerts_1);

var instantiateModel_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = instantiateModel;
  /**
   * This is model factory. Model class reference has to be passed as well as API config.
   *
   * If you don't know API type and/or version which is used for a particular model then use config factory function as second argument.
   * Config factory is beeing called with API type and version and has to return API config object.
   *
   * Example of API config object:
   * @example
   * {
   *   apiKey: 'd522aa97197fd864d36b418f39ebb323',
   *   hostname: 'api.weather.com',
   *   protocol: 'https:'
   * }
   *
   * API type can be 'sun' or 'dsx', version: 'v1', 'v2',...
   *
   * @param {BaseModel} ModelClass
   * @param {Object|Function} config
   * @param cacheConfig
   */
  function instantiateModel(ModelClass, config, cacheConfig) {
    var apiConf = void 0;

    if (Array.isArray(ModelClass.api)) {
      apiConf = ModelClass.api.map(function (api) {
        var type = api.type,
            version = api.version;

        return typeof config === 'function' ? config(type, version) : config;
      });
    } else {
      var _ModelClass$api = ModelClass.api,
          type = _ModelClass$api.type,
          version = _ModelClass$api.version;

      apiConf = typeof config === 'function' ? config(type, version) : config;
    }

    return new ModelClass(apiConf, cacheConfig);
  }
});

var instantiateModel = unwrapExports(instantiateModel_1);

var convertTemperature = function convertTemperature(temp, unit) {
  return unit === 'e' ? Math.round((temp - 32) * 5 / 9) /* F to C */ : Math.round(temp * 9 / 5 + 32) /* C to F */;
};

var conditionToAdParam = function conditionToAdParam(val) {
  if ([31, 33].indexOf(val) !== -1) {
    return 'clr';
  } else if ([26, 27, 28, 29, 30].indexOf(val) !== -1) {
    return 'cld';
  } else if ([1, 2, 5, 6, 9, 11, 12, 39, 40, 45].indexOf(val) !== -1) {
    return 'rain';
  } else if ([13, 14, 15, 16, 41, 42, 43, 46].indexOf(val) !== -1) {
    return 'snow';
  } else if ([7, 8, 10, 18].indexOf(val) !== -1) {
    return 'ice';
  } else if ([32, 34, 36].indexOf(val) !== -1) {
    return 'sun';
  } else if ([0, 3, 4, 17, 35, 37, 38, 47].indexOf(val) !== -1) {
    return 'thdr';
  }
};

/**
 *
 */
var getTempIncF = function getTempIncF(val) {
  if (val < 20) {
    return 'fnnl';
  } else if (val >= 20 && val <= 24) {
    return '20l';
  } else if (val >= 25 && val <= 29) {
    return '20h';
  } else if (val >= 30 && val <= 34) {
    return '30l';
  } else if (val >= 35 && val <= 39) {
    return '30h';
  } else if (val >= 40 && val <= 44) {
    return '40l';
  } else if (val >= 45 && val <= 49) {
    return '40h';
  } else if (val >= 50 && val <= 54) {
    return '50l';
  } else if (val >= 55 && val <= 59) {
    return '50h';
  } else if (val >= 60 && val <= 64) {
    return '60l';
  } else if (val >= 65 && val <= 69) {
    return '60h';
  } else if (val >= 70 && val <= 74) {
    return '70l';
  } else if (val >= 75 && val <= 79) {
    return '70h';
  } else if (val >= 80 && val <= 84) {
    return '80l';
  } else if (val >= 85 && val <= 89) {
    return '80h';
  } else if (val >= 90 && val <= 94) {
    return '90l';
  } else if (val >= 95 && val <= 100) {
    return '90h';
  } else if (val > 100) {
    return 'fpnl';
  }
  return 'fnnl';
};

var getTempIncC = function getTempIncC(val) {
  var tempCVal = 'cpnl';

  if (val > 60) {
    tempCVal = 'cpnl';
  } else if (val % 2 === 0 && val >= 0) {
    tempCVal = val + 1 + 'ci';
  } else if (val % 2 !== 0 && val >= 0) {
    tempCVal = val + 'ci';
  } else if (val % 2 === 0 && val < 0 && val > -9) {
    tempCVal = val * -1 + 'nci';
  }

  return tempCVal;
};

var getTempInc = function getTempInc(val, scale) {
  if (typeof scale === 'undefined') {
    return 'fnnl';
  } else if (typeof val === 'undefined') {
    return scale === 'c' ? 'cnnl' : 'fnnl';
  }
  return scale === 'f' ? getTempIncF(val) : getTempIncC(val);
};

var temperatureToAdParam = function temperatureToAdParam(val) {
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.length === 2) {
    var tmpF = val[0];
    var tmpC = val[1];

    // set temperature increments
    var tempFVal = getTempInc(tmpF, 'f');

    // set fahrenheit unit
    var fUnit = tmpF >= 0 ? tmpF + 'f' : tmpF * -1 + 'nf';

    // set celsius unit
    var cUnit = tmpC >= 0 ? tmpC + 'c' : tmpC * -1 + 'nc';

    // set celsius increments
    var tempCVal = getTempIncC(tmpC);

    return tempFVal + ',' + fUnit + ',' + cUnit + ',' + tempCVal;
  }
  return val;
};

var tempR = function tempR() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var scale = obj.scale;
  var val = obj.val;

  if (scale === 'c') {
    val = val * 9 / 5 + 32;
  }

  if (typeof val === 'undefined') {
    return NL;
  }
  if (val <= 31) {
    return 'icy';
  } else if (val >= 32 && val <= 40) {
    return 'cold';
  } else if (val >= 41 && val <= 55) {
    return 'thaw';
  } else if (val >= 56 && val <= 69) {
    return 'cool';
  } else if (val >= 70 && val <= 79) {
    return 'mod';
  } else if (val >= 80 && val <= 89) {
    return 'warm';
  } else if (val >= 90 && val <= 100) {
    return 'hot';
  } else if (val >= 101) {
    return 'xhot';
  }

  return NL;
};

var tempRC = function tempRC() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var val = obj.val;

  if (typeof val === 'undefined') {
    return NL;
  }
  if (val <= 0) {
    return 'icy';
  } else if (val >= 1 && val <= 4) {
    return 'cold';
  } else if (val >= 5 && val <= 12) {
    return 'thaw';
  } else if (val >= 13 && val <= 20) {
    return 'cool';
  } else if (val >= 21 && val <= 25) {
    return 'mod';
  } else if (val >= 26 && val <= 31) {
    return 'warm';
  } else if (val >= 32 && val <= 38) {
    return 'hot';
  } else if (val >= 39) {
    return 'xhot';
  }

  return NL;
};

var snowToAdParam = function snowToAdParam(val) {
  var snw = NL;

  if (val >= 1 && val < 3) {
    snw = '1';
  } else if (val >= 3) {
    snw = '3';
  }

  return snw;
};

var snowR = function snowR(val) {
  if (typeof val === 'undefined') {
    return NL;
  }
  if (val >= 1 && val < 3) {
    return '1';
  } else if (val >= 3) {
    return '3';
  }
  return NL;
};

var humidityToAdParam = function humidityToAdParam(val) {
  return val >= 61 ? 'hi' : 'lo';
};

var windToAdParam = function windToAdParam(val) {
  var ret = NL;

  if (val >= 6 && val <= 29) {
    ret = 'lo';
  } else if (val >= 30) {
    ret = 'hi';
  }

  return ret;
};

var uvToAdParam = function uvToAdParam(val) {
  return val >= 5 ? 'hi' : NL;
};

/*
export const getSevere = (alerts, $) => {
  const alerts = [].concat(alerts || []);

  if(alerts && $.isArray(alerts) && alerts.length > 0) {
    var alertsInfo = [];
    for(var idx= 0, len=alerts.length; idx < len; idx++) {
      var alert = alerts[idx];
      if(alert && 'BEHdr' in alert && 'bEvent' in alert.BEHdr) {
        var alertEventMetaData = alert.BEHdr.bEvent;
        if('eSgnfcnc' in alertEventMetaData && 'ePhenom' in alertEventMetaData) {
          var phenomena = alertEventMetaData.ePhenom;
          var significance = alertEventMetaData.eSgnfcnc;
          var alertMap = [
            {
              regex : /(^|\s)(CF|LS|FA|FL|EL|FF|HY|TS|RP|TCL|TCO|TGR|TLM|TRA|TCW)(\s|$)/,
              key   : 'fld'
            },
            {
              regex : /(^|\s)(HU|HI|TI|TR|TTP|TY)(\s|$)/,
              key   : 'trop'
            },
            {
              regex : /(^|\s)(WC|SU|EW|FG|MF|AF|MH|BW|DS|DU|EC|EH|EW|FG|MF|FR|FW|FZ|GL|
                HF|HT|HW|HZ|LO|LW|MA|SE|MS|SM|UP|WI|ZF|TAD|TCA|TTW|TCD|TCE|TEQ|TEV|TLC|
                TLA|RB|SC|SI|SW|TNM|TST|TNS|TNU|TOF|TRE|TRF|TRH|TSS|TSG|TSL|TSP|TSF|TNO|
                TVO|TZO|TOZ|TAQ|TAP|TWA|THT|TFF|TWX)(\s|$)/,
              key   : 'oth'
            },
            {
              regex : /(^|\s)(SV|SW|SR|TLM|TSA|TRA|TTS)(\s|$)/,
              key   : 'thdr'
            },
            {
              regex : /(^|\s)(TO)(\s|$)/,
              key   : 'tor'
            },
            {
              regex : /(^|\s)(BZ|HS|IS|LB|LE|WS|ZR|TAV|WW|TSI|TFA|TLT|TAA)(\s|$)/,
              key   : 'wint'
            }
          ];
          for(var aidx=0, alen=alertMap.length; aidx < alen; aidx++) {
            if(phenomena.match(alertMap[aidx].regex)) {
              var key = alertMap[aidx].key;
              alertsInfo.push(key);
              alertsInfo.push(key + phenomena + significance);
              break;
            }
          }
        }
      }
    }
    return alertsInfo;
  }
  return 'nl';
}
*/

var barometerToAdParam = function barometerToAdParam(val) {
  var baro = NL;

  if (val === 0) {
    baro = 'stdy';
  } else if (val === 1) {
    baro = 'rsng';
  } else if (val === 2) {
    baro = 'fllng';
  }
  return baro;
};

var pollenToAdParam = function pollenToAdParam(highVal) {
  var pollen = 'me';

  if (isNaN(highVal)) {
    pollen = NL;
  } else if (highVal >= 4) {
    pollen = 'hi';
  } else if (highVal < 2) {
    pollen = 'lo';
  }

  return pollen;
};

var isEmptyObject = function isEmptyObject(obj) {
  return (Object.getOwnPropertyNames(obj) || []).length === 0;
};

var reduce3DayPrecipitation = function reduce3DayPrecipitation(prcp3Day, prcp3Night) {
  return prcp3Day.reduce(function (previous, current, idx) {
    var dIdx = idx * 2 + 1; // day param index
    var nIdx = dIdx + 1; // night param index
    var nCurrent = prcp3Night[idx]; // Night chance of precipitation

    previous[dIdx + ''] = current || 'nl';
    previous[nIdx + ''] = nCurrent || 'nl';
    previous.prcpStr += (current < 50 ? dIdx + '_0,' : dIdx + '_50,') + (nCurrent < 50 ? nIdx + '_0,' : nIdx + '_50,');
    return previous;
  }, { prcpStr: '' }) || { prcpStr: '' };
};

var reduce3DayConditions = function reduce3DayConditions(cond3Day, cond3Night) {
  return cond3Day.reduce(function (previous, current, idx) {
    var dCond = conditionToAdParam(current);
    var nCond = conditionToAdParam(cond3Night[idx]);

    previous['fc' + (idx * 2 + 1)] = dCond || 'nl';
    previous['fc' + (idx * 2 + 2)] = nCond || 'nl';
    return previous;
  }, {}) || {};
};

var ENGLISH = 'e';
var METRIC = 'm';
var sunObsToAdParams = function sunObsToAdParams() {
  var obs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var units = arguments[1];

  if (isEmptyObject(obs)) {
    warn('No obs data. Unable to determine obs targeting parameters.');
  }
  // var units, tempF, tempC, feelsLikeF, feelsLikeC, secondsToCache = 0;
  var tempF = units === ENGLISH ? obs.temperature : convertTemperature(obs.temperature, units);
  var tempC = units === METRIC ? obs.temperature : convertTemperature(obs.temperature, units);
  var feelsLikeF = units === ENGLISH ? obs.feelsLike : convertTemperature(obs.feelsLike, units);
  var feelsLikeC = units === METRIC ? obs.feelsLike : convertTemperature(obs.feelsLike, units);
  var hmid = humidityToAdParam(obs.humidity);
  var wind = windToAdParam(obs.windSpeed);
  var uv = uvToAdParam(obs.uvIndex);
  var tmp = temperatureToAdParam([tempF, tempC]);
  var tmpc = tempC + '';
  var tmpr = tempR({
    val: tempF + ''
  });
  var tmprc = tempRC({
    val: tempC + ''
  });
  var fltmpf = feelsLikeF + '';
  var fltmpc = feelsLikeC + '';

  /* not in turbo data. not needed per Pavan.*/
  var wxExtIcon = obs.iconExt ? obs.iconExt + '' : 'nl';
  var cnd = conditionToAdParam(obs.icon);
  var baro = barometerToAdParam(obs.barometerCode);
  var snw = snowToAdParam(obs.snowDepth);

  return {
    hmid: hmid,
    wind: wind,
    uv: uv,
    tmp: tmp,
    tmpc: tmpc,
    tmpr: tmpr,
    tmprc: tmprc,
    fltmpf: fltmpf,
    fltmpc: fltmpc,
    wxExtIcon: wxExtIcon,
    cnd: cnd,
    baro: baro,
    snw: snw
  };
};

var getTempEnglish = function getTempEnglish(data, units) {
  var temp = NL;

  if ((data || []).length > 0) {
    temp = Math.min.apply(null, units === ENGLISH ? data.slice(0, 3) : data.slice(0, 3).map(function (value) {
      return convertTemperature(value, units);
    })) || undefined;
  }
  return temp;
};

var getTempMetric = function getTempMetric(data, units) {
  var temp = NL;

  if ((data || []).length > 0) {
    temp = Math.max.apply(null, units === METRIC ? data.slice(0, 3) : data.slice(0, 3).map(function (value) {
      return convertTemperature(value, units);
    })) || undefined;
  }
  return temp;
};

var transformVt1DailyForecastData = function transformVt1DailyForecastData(data) {
  var props = ['precipPct', 'icon', 'temperature', 'phrase', 'snwQpf'];
  var day = data.map(function (v) {
    return v.day || {};
  }).reduce(function (m, v) {
    props.forEach(function (key) {
      return (m[key] || (m[key] = [])).push(v[key]);
    });
    return m;
  }, {});
  var night = data.map(function (v) {
    return v.night || {};
  }).reduce(function (m, v) {
    props.forEach(function (key) {
      return (m[key] || (m[key] = [])).push(v[key]);
    });
    return m;
  }, {});

  return {
    day: day,
    night: night
  };
};

var sunForecastToAdParams = function sunForecastToAdParams(data, units) {
  if (isEmptyObject(data)) {
    warn('No forecast data. Unable to determine forecast targeting parameters.');
    return {};
  }

  var dailyForecast = transformVt1DailyForecastData(data);
  var day = dailyForecast.day;
  var night = dailyForecast.night;

  /* extract precip params */
  var prcp3Day = day.precipPct.slice(0, 3);
  var prcp3Night = night.precipPct.slice(0, 3);
  var precip = reduce3DayPrecipitation(prcp3Day, prcp3Night);

  /* extract condition params */
  var cond3Day = day.icon.slice(0, 3);
  var cond3Night = night.icon.slice(0, 3);
  var cond = reduce3DayConditions(cond3Day, cond3Night);

  /* only ENGLISH or METRIC data in turbo call, not both */
  /* extract high temp ENGLISH */
  var highTemp = getTempEnglish(day.temperature, units);

  /* extract low temp ENGLISH */
  var lowTemp = getTempEnglish(night.temperature, units);

  /* extract high temp METRIC */
  var highTempC = getTempMetric(day.temperature, units);

  /* extract low temp METRIC */
  var lowTempC = getTempMetric(night.temperature, units);

  /* extract high snow */ /* data field not available in turbo dailyforecast data */
  var highSnow = Math.min.apply(null, [].concat(day.snwQfp || [], night.snwQfp || [])) || undefined;

  precip.prcpStr = precip.prcpStr.substr(0, precip.prcpStr.length - 1);
  var fhi = getTempInc(highTemp, 'f'); // tempH
  var fli = getTempInc(lowTemp, 'f'); // tempL
  var fhr = tempR({ val: highTemp }); // tempHR
  var flr = tempR({ val: highTemp }); // tempLR
  var fhic = highTempC; // tempCH
  var floc = lowTempC; // tempCL
  var fsnw = snowR(highSnow);
  var prcp = (precip || {}).prcpStr || '';
  var fc1 = (cond || {}).fc1 || '';
  var fc2 = (cond || {}).fc2 || '';
  var fc3 = (cond || {}).fc3 || '';

  return {
    fhi: fhi,
    fhr: fhr,
    fli: fli,
    flr: flr,
    fhic: fhic,
    floc: floc,
    fsnw: fsnw,
    prcp: prcp,
    fc1: fc1,
    fc2: fc2,
    fc3: fc3
  };
};

var alertMap = [{
  regex: /(^|\s)(CF|LS|FA|FL|EL|FF|HY|TS|RP|TCL|TCO|TGR|TLM|TRA|TCW)(\s|$)/,
  key: 'fld' }, {
  regex: /(^|\s)(HU|HI|TI|TR|TTP|TY)(\s|$)/,
  key: 'trop'
}, {
  regex: new RegExp('Errorbb15.html\n      FW|FZ|GL|HF|HT|HW|HZ|LO|LW|MA|SE|MS|SM|UP|WI|ZF|TAD|TCA|TTW|TCD|TCE|TEQ|\n      TEV|TLC|TLA|RB|SC|SI|SW|TNM|TST|TNS|TNU|TOF|TRE|TRF|TRH|TSS|TSG|TSL|TSP|\n      TSF|TNO|TVO|TZO|TOZ|TAQ|TAP|TWA|THT|TFF|TWX)(s|$)/'),
  key: 'oth'
}, {
  regex: /(^|\s)(SV|SW|SR|TLM|TSA|TRA|TTS)(\s|$)/,
  key: 'thdr'
}, {
  regex: /(^|\s)(TO)(\s|$)/,
  key: 'tor'
}, {
  regex: /(^|\s)(BZ|HS|IS|LB|LE|WS|ZR|TAV|WW|TSI|TFA|TLT|TAA)(\s|$)/,
  key: 'wint'
}];

var transformVt1Alerts = function transformVt1Alerts(data) {
  var keys = ['phenomenaCode'];
  var values = keys.map(function (k) {
    return data[k];
  }) || [];
  var alerts = values.reduce(function (m, val, idx) {
    if (val) {
      val.forEach(function (v, i) {
        var alert = m[i] || (m[i] = {});

        alert[keys[idx]] = v;
      });
    }
    return m;
  }, []);

  return alerts;
};

var sunAlertsToAdParams = function sunAlertsToAdParams() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (isEmptyObject(data)) {
    return { severe: NL };
  }

  var txAlerts = transformVt1Alerts(data) || [];
  var alerts = txAlerts.reduce(function (m) {
    var alert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref = alert || '',
        phenomenaCode = _ref.phenomenaCode;

    var filter = alertMap.find(function (r) {
      return phenomenaCode.match(r.regex);
    }) || {};
    var key = filter.key;


    if (key) {
      m.push(key);
    }
    return m;
  }, []) || [];

  if (alerts.length === 0) {
    alerts.push(NL);
  }

  var severe = alerts.join(',');

  return {
    severe: severe
  };
};

var sunPollenToAdParams = function sunPollenToAdParams(data) {
  var values = [].concat((data.tree || [])[0] || [], (data.weed || [])[0] || [], (data.grass || [])[0] || []);
  var highVal = Math.max.apply(Math, toConsumableArray(values)) || NL;
  var pollen = pollenToAdParam(highVal);

  return { pollen: pollen };
};

/**
 * This files stores configuration of all external data APIs which are consumed by the application.
 *
 * API configuration should be passed to TWC DAL models. Example:
 * @example
 * // something.redux.js
 * import { Alerts, instantiateModel } from '@twc/dal';
 * import { getApiConfig } from 'configs/api';
 *
 * const alerts = instantiateModel(Alerts, getApiConfig);
 * alerts.execute({ geocode: '50.43,30.52' }).then(...);
 *
 */

var apiConfig = {
  sun: {
    v1: {
      apiKey: 'd522aa97197fd864d36b418f39ebb323',
      hostname: 'api.weather.com',
      pathname: '/v1',
      protocol: 'https:'
    },
    v2: {
      apiKey: '927977ae89d7e1a709571a585f1f46ca',
      hostname: 'api.weather.com',
      pathname: '/v2',
      protocol: 'https:'
    },
    v3: {
      apiKey: '927977ae89d7e1a709571a585f1f46ca',
      hostname: 'api.weather.com',
      pathname: '/v3',
      protocol: 'https:'
    }
  },
  dsx: {
    default: {
      hostname: 'dsx.weather.com',
      protocol: 'https:',
      apiKey: '7bb1c920-7027-4289-9c96-ae5e263980bc'
    }
  }
};

/**
 * Returns config of the specified API.
 *
 * @param {string} type
 * @param {string} version
 * @return {Object}
 */
function getApiConfig(type, version) {
  return apiConfig[type][version];
}

var dbName = '@twc;';
var storeName = 'dal';
var keyPath = 'key';

var _instance$2 = null;

var CacheStorage = function () {
  createClass(CacheStorage, null, [{
    key: 'instance',
    value: function instance() {
      if (_instance$2 == null) {
        _instance$2 = new CacheStorage();
      }

      return _instance$2;
    }
  }]);

  function CacheStorage() {
    var _this = this;

    classCallCheck(this, CacheStorage);

    try {
      this.req = indexedDB.open(dbName, 2);
      this.req.onsuccess = function (evt) {
        _this.db = evt.target.result;
      };
      this.req.onupgradeneeded = function (event) {
        var db = event.target.result;

        if (event.oldVersion < 2) {
          db.createObjectStore(storeName, { keyPath: keyPath });
        }
      };
    } catch (err) {
      this.db = false;
    }
  }

  createClass(CacheStorage, [{
    key: 'get',
    value: function get(key) {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (!_this2.db) {
          return resolve(null);
        }

        var transaction = _this2.db.transaction([storeName]);
        var objectStore = transaction.objectStore(storeName);
        var request = objectStore.get(key);

        request.onerror = function () {
          resolve(null);
        };

        request.onsuccess = function () {
          var result = void 0;

          if (request.result) {
            var isExpired = _this2.isExpired(request.result);

            result = !isExpired && request.result.content;
          }
          resolve(result);
        };
      });
    }
  }, {
    key: 'set',
    value: function set(_ref) {
      var _this3 = this;

      var key = _ref.key,
          content = _ref.content,
          ttl = _ref.ttl,
          date = _ref.date;

      return new Promise(function (resolve) {
        if (!_this3.db) {
          return resolve(null);
        }

        var request = _this3.db.transaction([storeName], 'readwrite').objectStore(storeName).add({
          key: key,
          content: content,
          ttl: ttl,
          date: date
        });

        request.onsuccess = function (event) {
          resolve(event);
        };
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      var _this4 = this;

      return new Promise(function (resolve) {
        if (!_this4.db) {
          return resolve(null);
        }

        var request = _this4.db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key);

        request.onsuccess = function (event) {
          resolve(event);
        };
      });
    }
  }, {
    key: 'isExpired',
    value: function isExpired(whenCached) {
      if (!whenCached) {
        return true;
      }

      var age = (Date.now() - whenCached.date) / 1000;

      return age > whenCached.ttl;
    }
  }]);
  return CacheStorage;
}();

var SunDataService = function () {
  function SunDataService() {
    classCallCheck(this, SunDataService);
  }

  createClass(SunDataService, null, [{
    key: 'fetchData',
    value: function fetchData(_ref, config, cacheProvider) {
      var geocode = _ref.geocode,
          _ref$language = _ref.language,
          language = _ref$language === undefined ? 'en-US' : _ref$language,
          _ref$units = _ref.units,
          units = _ref$units === undefined ? 'm' : _ref$units,
          _ref$siteSevere = _ref.siteSevere,
          siteSevere = _ref$siteSevere === undefined ? 'n' : _ref$siteSevere,
          hybridSevere = _ref.hybridSevere;


      var CacheProvider = cacheProvider || CacheStorage.instance();

      config = config || getApiConfig;

      var dailyforecast = instantiateModel(DailyForecast, config, { CacheProvider: CacheProvider });
      var observation = instantiateModel(Observation, config, { CacheProvider: CacheProvider });
      var pollenforecast = instantiateModel(PollenForecast, config, { CacheProvider: CacheProvider });
      var alerts = instantiateModel(Alerts, config, { CacheProvider: CacheProvider });
      var adaptorParams = {};

      return index([observation.execute({ geocode: geocode, units: units, language: language }).then(function (data) {
        return Object.assign(adaptorParams, { observation: { data: data } }) && data;
      }).then(function (data) {
        return data && data.vt1observation || {};
      }).then(function (obs) {
        return sunObsToAdParams(obs, units);
      }), dailyforecast.execute({ geocode: geocode, units: units, language: language }).then(function (data) {
        return Object.assign(adaptorParams, { dailyForecast: { data: data } }) && data;
      }).then(function (data) {
        return data && data.vt1dailyForecast || [];
      }).then(function (dailyForecast) {
        return sunForecastToAdParams(dailyForecast, units);
      }), pollenforecast.execute({ geocode: geocode, language: language }).then(function (data) {
        return Object.assign(adaptorParams, { pollen: { data: data } }) && data;
      }).then(function (data) {
        return data && data.vt1pollenforecast || [];
      }).then(function (pollen) {
        return sunPollenToAdParams(pollen, units);
      }), alerts.execute({ geocode: geocode, language: language }).then(function (data) {
        return Object.assign(adaptorParams, { alerts: { data: data } }) && data;
      }).then(function (data) {
        return data && data.vt1alerts || [];
      }).then(function (alrts) {
        return sunAlertsToAdParams(alrts);
      }).then(function (data) {
        var tank = [data.severe];

        if (hybridSevere) {
          tank.unshift(hybridSevere);
        }
        if (siteSevere) {
          tank.unshift(siteSevere);
        }

        var sev = tank.join(',');

        return {
          sev: sev
        };
      })]).then(function (results) {
        return {
          custParams: results.reduce(function (m, result) {
            return Object.assign(m, result.isFulfilled() ? result.value() : {});
          }, {}),
          adaptorParams: adaptorParams
        };
      });
    }
  }]);
  return SunDataService;
}();

exports.SunDataService = SunDataService;
exports.moneyTree = moneyTree;
exports.cmd = cmd;
exports.MoneyTree = MoneyTree;
exports.NCTAU = NCTAU;
exports.ThirdParty = ThirdParty;

}((this.twcMoney = this.twcMoney || {})));

// Object.assign polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
