function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

export default (function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var items = _toConsumableArray(entityData);

  if (filter.ids) {
    items = items.filter(function (d) {
      return filter.ids.some(function (id) {
        return id == d.id;
      });
    });
  } else {
    Object.keys(filter).filter(function (key) {
      return key !== 'q';
    }).forEach(function (key) {
      if (key.indexOf('_lte') !== -1) {
        // less than or equal
        var realKey = key.replace(/(_lte)$/, '');
        items = items.filter(function (d) {
          return d[realKey] <= filter[key];
        });
        return;
      }

      if (key.indexOf('_gte') !== -1) {
        // less than or equal
        var _realKey = key.replace(/(_gte)$/, '');

        items = items.filter(function (d) {
          return d[_realKey] >= filter[key];
        });
        return;
      }

      if (key.indexOf('_lt') !== -1) {
        // less than or equal
        var _realKey2 = key.replace(/(_lt)$/, '');

        items = items.filter(function (d) {
          return d[_realKey2] < filter[key];
        });
        return;
      }

      if (key.indexOf('_gt') !== -1) {
        // less than or equal
        var _realKey3 = key.replace(/(_gt)$/, '');

        items = items.filter(function (d) {
          return d[_realKey3] > filter[key];
        });
        return;
      }

      if (Array.isArray(filter[key])) {
        items = items.filter(function (item) {
          if (Array.isArray(item[key])) {
            // array filter and array item value: where all items in values
            return filter[key].every(function (v) {
              return item[key].some(function (itemValue) {
                return itemValue == v;
              });
            });
          } // where item in values


          return filter[key].filter(function (v) {
            return v == item[key];
          }).length > 0;
        });
      } else {
        items = items.filter(function (d) {
          return filter[key] instanceof Date ? +d[key] == +filter[key] : d[key] == filter[key];
        });
      }
    });

    if (filter.q) {
      items = items.filter(function (d) {
        return Object.keys(d).some(function (key) {
          return d[key] && d[key].toString().toLowerCase().includes(filter.q.toLowerCase());
        });
      });
    }
  }

  return items;
});