/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import { MutationUpdateProfileArgs } from "../../types";

export const updateProfile = async (
  parent: undefined,
  args: MutationUpdateProfileArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateProfile(args.data);
};

export const updateProfileImage = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateProfileImage();
};

export const updateCoverImage = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateCoverImage();
};
