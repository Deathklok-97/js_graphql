import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, parse, extendSchema } from 'graphql';
import { pluralize, camelize } from 'inflection';
import getTypesFromData from './getTypesFromData';
import getFilterTypesFromData from './getFilterTypesFromData';
import { isRelationshipField } from '../relationships';
import { getRelatedType } from '../nameConverter';
/**
 * Get a GraphQL schema from data
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
 * const types = getTypesFromData(data);
 * // type Post {
 * //     id: ID
 * //     title: String
 * //     views: Int
 * //     user_id: ID
 * // }
 * //
 * // type User {
 * //     id: ID
 * //     name: String
 * // }
 * //
 * // type Query {
 * //     Post(id: ID!): Post
 * //     allPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): [Post]
 * //     User(id: ID!): User
 * //     allUsers(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: UserFilter): [User]
 * // }
 * //
 * // type Mutation {
 * //     createPost(data: String): Post
 * //     updatePost(data: String): Post
 * //     removePost(id: ID!): Boolean
 * //     createUser(data: String): User
 * //     updateUser(data: String): User
 * //     removeUser(id: ID!): Boolean
 * // }
 */

export default (function (data) {
  var types = getTypesFromData(data);
  var typesByName = types.reduce(function (types, type) {
    types[type.name] = type;
    return types;
  }, {});
  var filterTypesByName = getFilterTypesFromData(data);
  var listMetadataType = new GraphQLObjectType({
    name: 'ListMetadata',
    fields: {
      count: {
        type: GraphQLInt
      }
    }
  });
  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: types.reduce(function (fields, type) {
      fields[type.name] = {
        type: typesByName[type.name],
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID)
          }
        }
      };
      fields["all".concat(camelize(pluralize(type.name)))] = {
        type: new GraphQLList(typesByName[type.name]),
        args: {
          page: {
            type: GraphQLInt
          },
          perPage: {
            type: GraphQLInt
          },
          sortField: {
            type: GraphQLString
          },
          sortOrder: {
            type: GraphQLString
          },
          filter: {
            type: filterTypesByName[type.name]
          }
        }
      };
      fields["_all".concat(camelize(pluralize(type.name)), "Meta")] = {
        type: listMetadataType,
        args: {
          page: {
            type: GraphQLInt
          },
          perPage: {
            type: GraphQLInt
          },
          filter: {
            type: filterTypesByName[type.name]
          }
        }
      };
      return fields;
    }, {})
  });
  var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: types.reduce(function (fields, type) {
      var typeFields = typesByName[type.name].getFields();
      var nullableTypeFields = Object.keys(typeFields).reduce(function (f, fieldName) {
        f[fieldName] = Object.assign({}, typeFields[fieldName], {
          type: fieldName !== 'id' && typeFields[fieldName].type instanceof GraphQLNonNull ? typeFields[fieldName].type.ofType : typeFields[fieldName].type
        });
        return f;
      }, {});
      fields["create".concat(type.name)] = {
        type: typesByName[type.name],
        args: typeFields
      };
      fields["update".concat(type.name)] = {
        type: typesByName[type.name],
        args: nullableTypeFields
      };
      fields["remove".concat(type.name)] = {
        type: GraphQLBoolean,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID)
          }
        }
      };
      return fields;
    }, {})
  });
  var schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  });
  /**
   * extend schema to add relationship fields
   *
   * @example
   * If the `post` key contains a 'user_id' field, then
   * add one-to-many and many-to-one type extensions:
   *     extend type Post { User: User }
   *     extend type User { Posts: [Post] }
   */

  var schemaExtension = Object.values(typesByName).reduce(function (ext, type) {
    Object.keys(type.getFields()).filter(isRelationshipField).map(function (fieldName) {
      var relType = getRelatedType(fieldName);
      var rel = pluralize(type.toString());
      ext += "\nextend type ".concat(type, " { ").concat(relType, ": ").concat(relType, " }\nextend type ").concat(relType, " { ").concat(rel, ": [").concat(type, "] }");
    });
    return ext;
  }, '');
  return schemaExtension ? extendSchema(schema, parse(schemaExtension)) : schema;
});