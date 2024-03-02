const graphql = require('graphql');
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList
 } = graphql;

const GroupType = require('./GroupType');
var Groups = require("../../db/Group");
var Wish = require('../../db/Wish');
const WishType = require('./WishType');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        _id: { type: GraphQLID },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        group: { 
            type: GroupType,
            resolve: (parent, args, req) => {
                console.log('request')

                return Groups.findOne({groupID: parent.group}).then((group) => {
                    return new Promise((resolve, rej) => {
                        resolve(group)
                    })
                }) 
            }
         },
        isHost: { type: GraphQLBoolean },
        wishes: {
            type: new GraphQLList(WishType),
            resolve: (parent, args, req) => {
                return Wish.find({username: parent.username}).then((wishes) => {
                    return new Promise((resolve, reject) => {
                        resolve(wishes)
                    })
                })
            }
        }
    }
});



module.exports = UserType