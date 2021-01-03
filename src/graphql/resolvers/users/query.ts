/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";

export const me = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getCurrentUser();
};

export const userProfile = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getUserProfile(args.id);
};
