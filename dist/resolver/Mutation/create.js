export default (function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (_, entity) {
    var newId = entityData.length > 0 ? entityData[entityData.length - 1].id + 1 : 0;
    var newEntity = Object.assign({
      id: newId
    }, entity);
    entityData.push(newEntity);
    return newEntity;
  };
});