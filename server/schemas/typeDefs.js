// GQL Type Defs by Jack Loveday

// Import Apollo
const { gql } = require('apollo-server-express');

// Setup Expected type defs
// Standard info based on existing app
// Make sure certain fields are required
const typeDefs = gql`
type Book {
    _id: ID!
    bookId: String!
    title: String!
    authors: [String]
    # authors: String
    description: String
    image: String
    link: String
  }
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }
type Auth {
    token: ID!
    user: User
  }
input savedBook {
    bookId: String!
    title: String!
    authors: [String]
    # authors: String
    description: String
    image: String
    link: String
  }
type Query {
    me: User  
  }
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: ID!): User
  }
`;

// Export it
module.exports = typeDefs;