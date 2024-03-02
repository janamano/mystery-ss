const graphql = require('graphql');
const Users = require('../../db/User')
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList
 } = graphql;

const GroupType = new GraphQLObjectType({
    name: 'GroupType',
    fields: () =>  ({
        _id: { type: GraphQLID },
        groupID: { type: GraphQLString },
        groupName: { type: GraphQLString },
        groupHost: { type: GraphQLString },
        dollarLimit: { type: GraphQLInt },
        groupMembers: { 
            type: new GraphQLList(require('./UserType')),
            resolve: (parent, args, req) => {
                return Users.find({ group: parent.groupID })
                .then((users) => {
                    return new Promise((resolve, reject) => {
                        resolve(users)
                    })
                })

            }
        }
    })
})

module.exports = GroupType;

/**
 * 
 *             
 resolve: (parent, args, req) => {
                return []
            }
 */