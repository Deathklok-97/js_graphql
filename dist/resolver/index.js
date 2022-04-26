function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { pluralize } from 'inflection';
import GraphQLJSON from 'graphql-type-json';
import all from './Query/all';
import meta from './Query/meta';
import single from './Query/single';
import create from './Mutation/create';
import update from './Mutation/update';
import remove from './Mutation/remove';
import entityResolver from './Entity';
import { getTypeFromKey } from '../nameConverter';
import DateType from '../introspection/DateType';
import hasType from '../introspection/hasType';

var getQueryResolvers = function getQueryResolvers(entityName, data) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, "all".concat(pluralize(entityName)), all(data)), _defineProperty(_ref, "_all".concat(pluralize(entityName), "Meta"), meta(data)), _defineProperty(_ref, entityName, single(data)), _ref;
};

var getMutationResolvers = function getMutationResolvers(entityName, data) {
  var _ref2;

  return _ref2 = {}, _defineProperty(_ref2, "create".concat(entityName), create(data)), _defineProperty(_ref2, "update".concat(entityName), update(data)), _defineProperty(_ref2, "remove".concat(entityName), remove(data)), _ref2;
};

export default (function (data) {
  return Object.assign({}, {
    Query: Object.keys(data).reduce(function (resolvers, key) {
      return Object.assign({}, resolvers, getQueryResolvers(getTypeFromKey(key), data[key]));
    }, {}),
    Mutation: Object.keys(data).reduce(function (resolvers, key) {
      return Object.assign({}, resolvers, getMutationResolvers(getTypeFromKey(key), data[key]));
    }, {})
  }, Object.keys(data).reduce(function (resolvers, key) {
    return Object.assign({}, resolvers, _defineProperty({}, getTypeFromKey(key), entityResolver(key, data)));
  }, {}), hasType('Date', data) ? {
    Date: DateType
  } : {}, // required because makeExecutableSchema strips resolvers from typeDefs
  hasType('JSON', data) ? {
    JSON: GraphQLJSON
  } : {} // required because makeExecutableSchema strips resolvers from typeDefs
  );
});