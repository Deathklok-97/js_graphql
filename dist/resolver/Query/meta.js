import applyFilters from './applyFilters';
export default (function (entityData) {
  return function (_, _ref) {
    var _ref$filter = _ref.filter,
        filter = _ref$filter === void 0 ? {} : _ref$filter;
    var items = applyFilters(entityData, filter);
    return {
      count: items.length
    };
  };
});