export var isRelationshipField = function isRelationshipField(fieldName) {
  return fieldName.endsWith('_id');
};