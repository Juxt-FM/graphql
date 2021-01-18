/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import * as Query from "./query";
import * as Mutation from "./mutation";

import { IResolverContext } from "../../server";

export default {
  Query,
  Mutation,
  UserAccount: {
    profile: async (parent: any, args: undefined, ctx: IResolverContext) => {
      const { users } = ctx.dataSources;
      return await users.getProfileByAccount(parent.id);
    },
  },
};
