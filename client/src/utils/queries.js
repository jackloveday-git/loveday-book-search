// GraphQL Queries by Jack Loveday

// Import GraphQL dependency
import gql from "graphql-tag";

// Setup basic Query
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        title
        bookId
        authors
        description
        image
        link
      }
    }
  }
`;