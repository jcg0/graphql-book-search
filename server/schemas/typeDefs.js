const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # input SaveBookInput {
  #   author: [String]
  #   description: String!
  #   title: String!
  #   bookId: ID!
  #   image: String
  #   link: String
  # }

  type User {
    _id: ID
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    savedBooks(
      authors: [String!]
      description: String!
      title: String!
      bookId: String!
      image: String!
      link: String # bookInput: SaveBookInput
    ): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
