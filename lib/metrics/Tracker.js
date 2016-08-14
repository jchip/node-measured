'use strict';

var assert = require("assert");

function Tracker(properties) {
  properties = properties || {};

  this.properties = properties;

  if (properties.interval) {
    assert(properties.getValue, "Must specify getValue for interval tracker");
    var interval = properties.interval;
    assert(typeof interval === "number" && interval > 0, "interval must be a number > 0");
    if (properties.autoStart !== false) {
      this.start();
    }
  }

  this._values = [];
}

Tracker.prototype.toJSON = function () {
  var data = {values: this._values};

  if (this.properties.interval) {
    data.interval = this.properties.interval;
  }

  return data;
};

Tracker.prototype.add = function (value) {
  assert(!this.properties.interval, "Can only add value to tracker w/o an interval");
  this._values.push({
    time: Date.now(),
    value: value
  });
};

Tracker.prototype.start = function () {
  if (this.properties.interval && !this._interval) {
    this._interval = setInterval(() => {
      this._values.push(properties.getValue());
    }, this.properties.interval);
  }
};

Tracker.prototype.end = function () {
  if (this._interval) {
    clearInterval(this._interval);
    this._interval = null;
  }
};

Tracker.prototype.count = function () {
  return this._values.length;
};

Tracker.prototype.reset = function (properties) {
  this.end();
  this.constructor(properties || this.properties);
};

module.exports = Tracker;
