const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQueryType = require('./types/root_query_type');
const mutation = require('./mutations')
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation
});

module.exports = schema;
