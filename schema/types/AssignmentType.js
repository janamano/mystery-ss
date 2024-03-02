const graphql = require('graphql');
const UserType = require('./UserType');
const Users = require('../../db/User')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID
} = graphql

const AssignmentType = new GraphQLObjectType({
    name: "AssignmentType",
    fields: () => ({
        _id: { type: GraphQLID },
        user: { type: GraphQLString },
        assignee: { 
            type: UserType,
            resolve(parent, args, req) {
               console.log(parent)
                return Users.findOne({username: parent.assignee })
                .then((user) => {
                    return new Promise((resolve, reject) => {
                        resolve(user)
                    })
                })
            }
        },
        group: { type: GraphQLString }
    })
})

module.exports = AssignmentType