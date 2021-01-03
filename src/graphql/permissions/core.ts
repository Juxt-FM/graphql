/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { not } from "graphql-shield";
import { isAuthenticated } from "./utils";

export default {
  Query: {
    me: isAuthenticated,
  },
  Mutation: {
    createUser: not(isAuthenticated),
    loginUser: not(isAuthenticated),
    refreshToken: not(isAuthenticated),
    verifyOTP: not(isAuthenticated),
    verifyEmail: isAuthenticated,
    logoutUser: isAuthenticated,
    resetPassword: isAuthenticated,
    updateUser: isAuthenticated,
  },
};
