import getFilterTypesFromData from './getFilterTypesFromData';
export default (function (name, data) {
  return Object.values(getFilterTypesFromData(data)).reduce(function (hasJSON, type) {
    if (hasJSON) return true;
    return Object.values(type.getFields()).reduce(function (hasJSONField, field) {
      if (hasJSONField) return true;
      return field.type.name == name;
    }, false);
  }, false);
});