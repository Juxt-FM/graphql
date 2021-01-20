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

export const followProfile = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.follow(args.id);
};

export const unfollowProfile = async (
  parent: undefined,
  args: any,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.unfollow(args.id);
};

export const updateProfileImage = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateProfileImage();
};

export const updateCoverImage = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.updateCoverImage();
};
