const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID
} = graphql;

const UserType = require('./types/UserType');
const WishType = require('./types/WishType');

const { signup, login, joinGroup } = require('../api/user');
const { createGroup } = require('../api/group')
const { makeWish, deleteWish, changeWish } = require('../api/wish')

const GroupType = require('./types/GroupType');
const AssignmentType = require('./types/AssignmentType');
const { createAssignment } = require('../api/assignment');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                isHost: { type: GraphQLBoolean },
                group: { type: GraphQLString}                
            },
            resolve(parent, args, req) {
                return signup({
                    email: args.email,
                    username: args.username,
                    password: args.password,
                    isHost: args.isHost,
                    group: args.group,
                    req: req
                })
            }
        },
        login: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args, req) {
                return login({
                    username: args.username,
                    password: args.password,
                    req: req
                })
            }
        },
        logout: {
            type: UserType,
            resolve(parent, args, req) {
                const user = req.req.session.user
                console.log('freom logout', user)
                req.req.session.destroy();
                return user;
            }
        },
        createGroup: {
            type: GroupType,
            args: {
                groupName: { type: GraphQLString },
                dollarLimit: { type: GraphQLInt }
            },
            resolve(parent, args, req) {
                return createGroup({
                    groupName: args.groupName,
                    dollarLimit: args.dollarLimit,
                    req: req
                })
            }
        },
        joinGroup: {
            type: UserType,
            args: {
                groupID: { type: GraphQLString },
            },
            resolve(parent, args, req) {
                return joinGroup({
                    groupID: args.groupID,
                    req: req
                })
            }
        },
        createWish: {
            type: WishType,
            args: {
                wishName: { type: GraphQLString },
                wishLink: { type: GraphQLString },
            },
            resolve(parent, args, req) {
                return makeWish({
                    wishName: args.wishName,
                    wishLink: args.wishLink,
                    req
                })
            }
        },
        deleteWish: {
            type: WishType,
            args: {
                wishId: { type: GraphQLString }
            },
            resolve(parent, args, req) {
                return deleteWish({
                    wishId: args.wishId,
                    req
                })
            }
        },
        changeWish: {
            type: WishType,
            args: {
                wishId: { type: GraphQLString },
                wishName: { type: GraphQLString },
                wishLink: { type: GraphQLString },
            },
            resolve(parent, args, req) {
                return changeWish({
                    wishId: args.wishId,
                    wishName: args.wishName,
                    wishLink: args.wishLink,
                    req
                })
            }
        },
        createAssignment: {
            type: AssignmentType,
            args: {
                user: { type: GraphQLString },
                assignee: { type: GraphQLString },
                group: { type: GraphQLString }
            },
            resolve(parent, args, req) {
                return createAssignment({
                    user: args.user,
                    assignee: args.assignee,
                    group: args.group,
                    req
                })
            }
        }
    }
})

module.exports = mutation