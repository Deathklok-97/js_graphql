export default (function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (_, _ref) {
    var id = _ref.id;
    var removedEntity = undefined;

    if (id != null) {
      var stringId = id.toString();
      var indexOfEntity = entityData.findIndex(function (e) {
        return e.id != null && e.id.toString() === stringId;
      });

      if (indexOfEntity !== -1) {
        removedEntity = entityData.splice(indexOfEntity, 1)[0];
      }
    }

    return removedEntity;
  };
});