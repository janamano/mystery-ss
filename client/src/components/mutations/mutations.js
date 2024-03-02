import { gql } from "@apollo/client";

const LOGIN = gql`
    mutation LoginUser($username: String!, $password:String!) {
        login(username: $username, password: $password) {
            _id,
            email
        }
    }
`

const LOGOUT = gql`
    mutation {
        logout {
        username
        }
    }
`

const CREATE_USER = gql`
    mutation CreateUser($email: String!, $password: String!, $username: String!){
        createUser(
        email: $email,
        password: $password,
        username: $username,
        isHost: false,
        group: null
        ) {
        email,
        username,
        _id
        }
    }
  
`

const CREATE_GROUP = gql`
    mutation CreateGroup($groupName: String!, $dollarLimit: Int!) {
        createGroup(groupName: $groupName, dollarLimit: $dollarLimit) {
            groupID
            groupName
            dollarLimit
            groupHost
            groupMembers {
                username
            }
        }
}
`
const JOIN_GROUP = gql`
    mutation JoinGroup($groupID: String!) {
        joinGroup(groupID: $groupID) {
        _id
        }
    }
`

const MAKE_WISH = gql`
    mutation MakeWish($wishName: String!, $wishLink: String!) {
       createWish(wishName: $wishName, wishLink: $wishLink) {
        wishName,
        wishLink
       } 
    }
`

const DELETE_WISH = gql`
    mutation DeleteWish($wishId: String!) {
        deleteWish(wishId: $wishId) {
            _id
        }
    }
`

const CREATE_ASSIGNMENT = gql`
    mutation CreateAssignment($user: String!, $assignee: String!, $group: String!) {
        createAssignment(user: $user, assignee: $assignee, group: $group) {
            _id
            user
            assignee {
                username                
            }
        }
    }
`
export {
    LOGIN,
    LOGOUT,
    CREATE_GROUP,
    JOIN_GROUP,
    CREATE_USER,
    MAKE_WISH,
    DELETE_WISH,
    CREATE_ASSIGNMENT
}

