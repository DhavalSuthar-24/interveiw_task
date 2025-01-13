import { gql } from 'graphql-tag';

export const authTypeDefs = gql`
  enum UserRole {
    ADMIN
    CUSTOMER
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: UserRole!
    emailVerified: Boolean!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    registerAdmin(input: RegisterInput!): User!
    registerCustomer(input: RegisterInput!): User!
    loginAdmin(email: String!, password: String!): AuthResponse!
    loginCustomer(email: String!, password: String!): AuthResponse!
    # Updated mutation to accept OTP and email for verification
    verifyEmail(otp: String!, email: String!): Boolean!
    resendVerificationEmail(email: String!): Boolean!
  }
`;
