/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import * as Query from "./query";
import * as Mutation from "./mutation";
import * as Idea from "./idea";
import * as Post from "./post";

import { IResolverContext } from "../../server";

export default {
  Query,
  Mutation,
  Post,
  Idea,
  ActionableContent: {
    __resolveType: (parent: any) => {
      if (parent.label === "post") return "Post";
      else return "Idea";
    },
  },
  Reaction: {
    from: async (parent: any, args: undefined, context: IResolverContext) => {
      const { users } = context.dataSources;
      return await users.loadProfile(parent.from);
    },
  },
};
