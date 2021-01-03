/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import { MutationUpdateUserArgs } from "../../types";

export const updateUser = async (
  parent: undefined,
  args: MutationUpdateUserArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateUser(args.data);
};
