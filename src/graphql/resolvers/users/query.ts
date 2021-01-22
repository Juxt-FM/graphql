/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import { QueryUserProfileArgs } from "../../types";

export const userProfile = async (
  parent: undefined,
  args: QueryUserProfileArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.loadProfile(args.id);
};
