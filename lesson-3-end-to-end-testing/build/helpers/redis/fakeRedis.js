'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Fake redis in-memory array
 * @export
 * @class FakeRedis
 */
var FakeRedis = function () {
  /**
   * Creates an instance of FakeRedis.
   * Initializes a new database
   * @memberof FakeRedis
   */
  function FakeRedis() {
    _classCallCheck(this, FakeRedis);

    this.database = {};
  }
  /**
   * Set a new key in the database
   * @param {any} key key to be set
   * @param {any} value value for key
   * @returns {string} ok for success
   * @memberof FakeRedis
   */


  _createClass(FakeRedis, [{
    key: 'set',
    value: function set(key, value) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.database[key] = value;
        return resolve('OK');
      });
    }
    /**
     * Get the value of a key in database
     * @param {any} key key to get value
     * @returns {sting} value
     * @memberof FakeRedis
     */

  }, {
    key: 'get',
    value: function get(key) {
      var _this2 = this;

      return new Promise(function (resolve) {
        return resolve(_this2.database[key]);
      });
    }

    /**
     * Store a new value into set in database
     *
     * @param {any} key key to set
     * @param {any} value value to push to set
     * @returns {array} arrz
     * @memberof FakeRedis
     */

  }, {
    key: 'sadd',
    value: function sadd(key, value) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var lengthOfSet = 0;

        if (_this3.database[key]) {
          lengthOfSet = _this3.database[key].size;
          _this3.database[key].add(value);
        } else {
          _this3.database[key] = new Set();
          _this3.database[key].add(value);
        }

        return resolve(_this3.database[key].size - lengthOfSet);
      });
    }
    /**
     * Return all elements in the given set
     *
     * @param {any} key the set in question
     * @returns {integer} the number of elements added to set
     * @memberof FakeRedis
     */

  }, {
    key: 'smembers',
    value: function smembers(key) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var value = _this4.database[key];
        if (value) {
          if (value instanceof Set) {
            return resolve(Array.from(_this4.database[key]));
          }

          return reject(new Error('WRONGTYPE Operation against a key holding the wrong kind of value'));
        }

        return resolve([]);
      });
    }

    /**
     * Removes an item from a redis set
     *
     * @param {string} key key of set
     * @param {string} value item to remove from set
     * @returns {integer} number of elements removed
     * @memberof FakeRedis
     */

  }, {
    key: 'srem',
    value: function srem(key, value) {
      var _this5 = this;

      return new Promise(function (resolve) {
        var lengthOfSet = 0;
        var set = _this5.database[key];
        if (set) {
          lengthOfSet = set.size;
          set.delete(value);
          return resolve(lengthOfSet - set.size);
        }

        return resolve(0);
      });
    }
  }]);

  return FakeRedis;
}();

exports.default = FakeRedis;