import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
    signup(
      credentials: CredentialsInput
      name: String!
      bio: String!
    ): AuthPaylod!
    signin(credentials: CredentialsInput): AuthPaylod!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]
    post: Post
  }

  type AuthPaylod {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input CredentialsInput {
    email: String!
    password: String!
  }
`;
