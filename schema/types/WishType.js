const graphql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLString
} = graphql

const WishType = new GraphQLObjectType({
    name: "WishType",
    fields: {
        _id: { type: graphql.GraphQLID },
        username: { type: GraphQLString },
        wishName: { type: GraphQLString },
        wishLink: { type: GraphQLString },
    }
})

module.exports = WishType