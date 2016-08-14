'use strict';
var assert = require('assert');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

const hasHrTime = typeof process !== undefined && process.hrtime;

function Stopwatch(options) {
  options = options || {};
  EventEmitter.call(this);
  this.options = options;

  if (options.startTime || options.getElapsed) {
    assert(options.startTime && options.getElapsed,
      "Must specify both startTime and getElapsed callbacks");
    this._startTime = options.startTime;
    this._getElapsed = options.getElapsed;
  }

  this._hiRes = options.hiRes !== false && hasHrTime;
  if (options.autoStart !== false) {
    this._start = this._startTime();
  } else {
    this._start = undefined;
  }
  this._elapsed = undefined;
}

inherits(Stopwatch, EventEmitter);

Stopwatch.prototype.elapsed = function () {
  return this._elapsed;
};

Stopwatch.prototype.start = function () {
  assert(!this._start, "Cannot start stopwatch that's already started");
  this._start = this._startTime();
};

Stopwatch.prototype.end = function () {
  assert(this._start !== undefined, "Cannot end stopwatch that's not started");

  if (this._elapsed) {
    return;
  }

  this._elapsed = this._getElapsed(this._start);

  this.emit('end', this._elapsed);
  return this._elapsed;
};

Stopwatch.prototype.reset = function (options) {
  this.constructor(options || this.options);
};

Stopwatch.prototype._startTime = function () {
  if (this._hiRes) {
    return process.hrtime();
  }

  return Date.now();
};

Stopwatch.prototype._getElapsed = function (start) {
  if (this._hiRes) {
    var hrtime = process.hrtime(start);
    return hrtime[0] * 1000 + hrtime[1] / (1000 * 1000);
  }

  return Date.now() - start;
};

module.exports = Stopwatch;
