/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "src/graphql/server";
import { MutationUpdateProfileArgs } from "src/graphql/types";

export const updateProfile = async (
  parent: undefined,
  args: MutationUpdateProfileArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateProfile(args.data);
};
