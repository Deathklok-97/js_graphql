function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLID } from 'graphql';
import getFieldsFromEntities from './getFieldsFromEntities';
import getValuesFromEntities from './getValuesFromEntities';
import getTypeFromValues from './getTypeFromValues';
import { getTypeFromKey } from '../nameConverter';

var getRangeFiltersFromEntities = function getRangeFiltersFromEntities(entities) {
  var fieldValues = getValuesFromEntities(entities);
  return Object.keys(fieldValues).reduce(function (fields, fieldName) {
    var fieldType = getTypeFromValues(fieldName, fieldValues[fieldName], false);

    if (fieldType == GraphQLInt || fieldType == GraphQLFloat || fieldType.name == 'Date') {
      fields["".concat(fieldName, "_lt")] = {
        type: fieldType
      };
      fields["".concat(fieldName, "_lte")] = {
        type: fieldType
      };
      fields["".concat(fieldName, "_gt")] = {
        type: fieldType
      };
      fields["".concat(fieldName, "_gte")] = {
        type: fieldType
      };
    }

    return fields;
  }, {});
};
/**
 * Get a list of GraphQLObjectType for filtering data
 *
 * @example
 * const data = {
 *    "posts": [
 *        {
 *            "id": 1,
 *            "title": "Lorem Ipsum",
 *            "views": 254,
 *            "user_id": 123,
 *        },
 *        {
 *            "id": 2,
 *            "title": "Sic Dolor amet",
 *            "views": 65,
 *            "user_id": 456,
 *        },
 *    ],
 *    "users": [
 *        {
 *            "id": 123,
 *            "name": "John Doe"
 *        },
 *        {
 *            "id": 456,
 *            "name": "Jane Doe"
 *        }
 *    ],
 * };
 * const types = getFilterTypesFromData(data);
 * // {
 * //     posts: new GraphQLInputObjectType({
 * //         name: "PostFilter",
 * //         fields: {
 * //             q: { type: GraphQLString },
 * //             id: { type: GraphQLString },
 * //             title: { type: GraphQLString },
 * //             views: { type: GraphQLInt },
 * //             views_lt: { type: GraphQLInt },
 * //             views_lte: { type: GraphQLInt },
 * //             views_gt: { type: GraphQLInt },
 * //             views_gte: { type: GraphQLInt },
 * //             user_id: { type: GraphQLString },
 * //         }
 * //     }),
 * //     users: new GraphQLObjectType({
 * //         name: "UserFilter",
 * //         fields: {
 * //             q: { type: GraphQLString },
 * //             id: { type: GraphQLString },
 * //             name: { type: GraphQLString },
 * //         }
 * //     }),
 * // }
 */


export default (function (data) {
  return Object.keys(data).reduce(function (types, key) {
    return Object.assign({}, types, _defineProperty({}, getTypeFromKey(key), new GraphQLInputObjectType({
      name: "".concat(getTypeFromKey(key), "Filter"),
      fields: Object.assign({
        q: {
          type: GraphQLString
        }
      }, {
        ids: {
          type: new GraphQLList(GraphQLID)
        }
      }, getFieldsFromEntities(data[key], false), getRangeFiltersFromEntities(data[key]))
    })));
  }, {});
});