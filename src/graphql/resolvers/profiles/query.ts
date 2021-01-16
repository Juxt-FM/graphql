/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";

export const profile = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getUserProfile(args.id);
};