'use strict';

function Counter(properties) {
  if (typeof properties === "number") {
    this._count = Math.trunc(properties);
  } else if (typeof properties === "object") {
    this._count = properties.count;
  } else {
    this._count = 0;
  }
}

Counter.prototype.toJSON = function () {
  return this._count;
};

Counter.prototype.inc = function (n) {
  this._count += typeof n !== "number" ? 1 : Math.trunc(n);
};

Counter.prototype.dec = function (n) {
  this._count -= typeof n !== "number" ? 1 : Math.trunc(n);
};

Counter.prototype.reset = function (count) {
  this.constructor(count);
};

module.exports = Counter;
