const graphql = require('graphql');
const UserType = require('./UserType');
const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql;
var Wishes = require("../../db/Wish");
const WishType = require('./WishType');
const AssignmentType = require('./AssignmentType');
const Assignment = require('../../db/Assignment');

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            resolve: (parent, args, req) => { 
                return req.req.session.user
            },
        },
        getWishes: {
            type: new GraphQLList(WishType),
            resolve: (parent, args, req) => {
                return Wishes.find({ username: req.req.session.user.username })
                .then((wishes) => {
                    return new Promise((resolve, reject) => {
                        resolve(wishes)
                    })
                })
            }
        },
        getWishesOther: {
            type: new GraphQLList(WishType),
            args: {
                username: { type: GraphQLString }
            },
            resolve: (parent, args, req) => {  
                return Wishes.find({ username: args.username })
                .then((wishes) => {
                    return new Promise((resolve, reject) => {
                        resolve(wishes)
                    })
                })
            }
        },
        assignment: {
            type: AssignmentType,
            resolve: (parent, args, req) => {
                return Assignment.findOne({ user: req.req.session.user.username, group: req.req.session.user.group }).
                then((assignment) => {
                    return new Promise((resolve, reject) => {
                        resolve(assignment)
                    })
                })
            }
        }
        
    }
});

module.exports = RootQueryType;