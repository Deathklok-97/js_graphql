function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import applyFilters from './applyFilters';
export default (function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (_, _ref) {
    var sortField = _ref.sortField,
        _ref$sortOrder = _ref.sortOrder,
        sortOrder = _ref$sortOrder === void 0 ? 'asc' : _ref$sortOrder,
        page = _ref.page,
        _ref$perPage = _ref.perPage,
        perPage = _ref$perPage === void 0 ? 25 : _ref$perPage,
        _ref$filter = _ref.filter,
        filter = _ref$filter === void 0 ? {} : _ref$filter;

    var items = _toConsumableArray(entityData);

    if (sortField) {
      var direction = sortOrder.toLowerCase() == 'asc' ? 1 : -1;
      items = items.sort(function (a, b) {
        if (a[sortField] > b[sortField]) {
          return direction;
        }

        if (a[sortField] < b[sortField]) {
          return -1 * direction;
        }

        return 0;
      });
    }

    items = applyFilters(items, filter);

    if (page !== undefined && perPage) {
      items = items.slice(page * perPage, page * perPage + perPage);
    }

    return items;
  };
});