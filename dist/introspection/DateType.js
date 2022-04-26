import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date type',
  parseValue: function parseValue(value) {
    // value comes from the client
    return new Date(value); // sent to resolvers
  },
  serialize: function serialize(value) {
    // value comes from resolvers
    return value.toISOString(); // sent to the client
  },
  parseLiteral: function parseLiteral(ast) {
    // ast comes from parsing the query
    // this is where you can validate and transform
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("Query error: Can only parse dates strings, got a: ".concat(ast.kind), [ast]);
    }

    if (isNaN(Date.parse(ast.value))) {
      throw new GraphQLError("Query error: not a valid date", [ast]);
    }

    return new Date(ast.value);
  }
});