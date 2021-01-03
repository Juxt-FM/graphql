/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import * as Query from "./query";
import * as Mutation from "./mutation";

import { IResolverContext } from "../../server";
import { UserProfile } from "../../types";

export default {
  Query,
  Mutation,
  UserProfile: {
    posts: async (
      parent: UserProfile,
      args: undefined,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;

      return await blog.filter({ user: parent.id, limit: 15, offset: 0 });
    },
    watchlists: async (
      parent: UserProfile,
      args: undefined,
      context: IResolverContext
    ) => {
      const { market } = context.dataSources;

      return await market.getUserWatchlists(parent.id);
    },
  },
};
