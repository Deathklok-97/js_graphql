import getTypeFromValues from './getTypeFromValues';
import getValuesFromEntities from './getValuesFromEntities';
/**
 * Get a list of GraphQL fields from a list of entities
 *
 * @example
 * const entities = [
 *     {
 *         "id": 1,
 *         "title": "Lorem Ipsum",
 *         "views": 254,
 *         "user_id": 123,
 *     },
 *     {
 *         "id": 2,
 *         "title": "Sic Dolor amet",
 *         "user_id": 456,
 *     },
 * ];
 * const types = getFieldsFromEntities(entities);
 * // {
 * //    id: { type: new GraphQLNonNull(GraphQLString) },
 * //    title: { type: new GraphQLNonNull(GraphQLString) },
 * //    views: { type: GraphQLInt },
 * //    user_id: { type: new GraphQLNonNull(GraphQLString) },
 * // };
 */

export default (function (entities) {
  var checkRequired = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var fieldValues = getValuesFromEntities(entities);
  var nbValues = entities.length;
  return Object.keys(fieldValues).reduce(function (fields, fieldName) {
    fields[fieldName] = {
      type: getTypeFromValues(fieldName, fieldValues[fieldName], checkRequired ? fieldValues[fieldName].length === nbValues : false)
    };
    return fields;
  }, {});
});