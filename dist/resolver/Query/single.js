export default (function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (_, _ref) {
    var id = _ref.id;
    return entityData.find(function (d) {
      return d.id == id;
    });
  };
});