/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { gql } = require("apollo-server-express");

const AUTH_USER = gql`
  query {
    me {
      id
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($data: UserInput!, $device: DeviceInput!) {
    createUser(data: $data, device: $device) {
      accessToken
    }
  }
`;

const LOGIN = gql`
  mutation Login($data: LoginInput!, $device: DeviceInput!) {
    loginUser(data: $data, device: $device) {
      accessToken
    }
  }
`;

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      id
    }
  }
`;

const UPDATE_PHONE = gql`
  mutation UpdatePhone($phone: String!) {
    updatePhone(phone: $phone) {
      id
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $confirmPassword: String!) {
    resetPassword(password: $password, confirmPassword: $confirmPassword)
  }
`;

const REFRESH_TOKEN = gql`
  mutation Refresh($device: ID!) {
    refreshToken(device: $device) {
      accessToken
    }
  }
`;

const LOGOUT = gql`
  mutation Logout($device: ID!) {
    logoutUser(device: $device)
  }
`;

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($code: String!) {
    verifyEmail(code: $code) {
      accessToken
    }
  }
`;

const VERIFY_PHONE = gql`
  mutation VerifyPhone($code: String!) {
    verifyPhone(code: $code) {
      accessToken
    }
  }
`;

const DEACTIVATE_ACCOUNT = gql`
  mutation {
    deactivateAccount
  }
`;

module.exports = {
  queries: {
    AUTH_USER,
  },
  mutations: {
    CREATE_USER,
    LOGIN,
    UPDATE_EMAIL,
    UPDATE_PHONE,
    VERIFY_EMAIL,
    VERIFY_PHONE,
    LOGOUT,
    DEACTIVATE_ACCOUNT,
    RESET_PASSWORD,
    REFRESH_TOKEN,
  },
};
