import { gql } from '@apollo/client';

export const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer($input: RegisterInput!) {
    registerCustomer(input: $input) {
      id
      firstName
      lastName
      email
      role
      emailVerified
    }
  }
`;

export const REGISTER_ADMIN = gql`
  mutation RegisterAdmin($input: RegisterInput!) {
    registerAdmin(input: $input) {
      id
      firstName
      lastName
      email
      role
      emailVerified
    }
  }
`;

export const LOGIN_CUSTOMER = gql`
  mutation LoginCustomer($email: String!, $password: String!) {
    loginCustomer(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        role
        emailVerified
      }
    }
  }
`;

export const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        role
        emailVerified
      }
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($email: String!, $otp: String!) {
    verifyEmail(email: $email, otp: $otp) {
      success
      message
      user {
        id
        firstName
        lastName
        email
        role
        emailVerified
      }
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`;
