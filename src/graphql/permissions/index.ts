/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError } from "apollo-server-express";
import { shield } from "graphql-shield";
import _ from "lodash";

import auth from "./auth";
import users from "./users";
import blog from "./blog";
import market from "./market";

export default shield(_.merge(auth, users, market, blog), {
  fallbackError: new ApolloError(
    "You are not permitted to do this.",
    "NOTPERMITTED"
  ),
});
