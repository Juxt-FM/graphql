/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { not } from "graphql-shield";
import { isAuthenticated, hasRefreshCredentials } from "./utils";

export default {
  Query: {
    me: isAuthenticated,
  },
  Mutation: {
    createUser: not(isAuthenticated),
    loginUser: not(isAuthenticated),
    refreshToken: hasRefreshCredentials,
    logoutUser: isAuthenticated,
    updateEmail: isAuthenticated,
    updatePhone: isAuthenticated,
    verifyEmail: isAuthenticated,
    verifyPhone: isAuthenticated,
    resetPassword: isAuthenticated,
    deactivateAccount: isAuthenticated,
  },
};
