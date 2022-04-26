import { ApolloClient } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import getSchemaFromData from './introspection/getSchemaFromData';
export default (function (data) {
  var schema = getSchemaFromData(data);
  var mockNetworkInterface = mockNetworkInterfaceWithSchema({
    schema: schema
  });
  var client = new ApolloClient({
    networkInterface: mockNetworkInterface
  });
  return client;
});