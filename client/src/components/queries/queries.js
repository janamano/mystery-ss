import { gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    user {
        _id,
        email,
        username,
        group {
          groupID,
        }
    }
}
`;

const GET_CURRENT_USER_DETAILS = gql`
  query GetCurrentUserDetails {
    user {
        _id,
        email,
        username,
        isHost,
        wishes {
          wishName,
          wishLink
          _id
        }
        group {
          groupID,
          groupName
          groupHost
          dollarLimit
          groupMembers {
            username
            email
            isHost,
            wishes {
              wishName,
              wishLink
              
            }
          }
        }
    }
  }
`;

const GET_ASSIGNMENT = gql`
  query getAssignment {
    assignment {
      user,
      assignee {
        username,
        wishes {
          wishName
          wishLink
        }
      }
    }
  }
`;

export { GET_CURRENT_USER, GET_CURRENT_USER_DETAILS, GET_ASSIGNMENT }