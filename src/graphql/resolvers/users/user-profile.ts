/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  UserProfileFollowersArgs,
  UserProfilePostsArgs,
  UserProfileIdeasArgs,
} from "../../types";

export const followers = async (
  parent: any,
  args: UserProfileFollowersArgs,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.getFollowers(parent.id, args.limit, args.offset);
};

export const followCount = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.loadFollowerCount(parent.id);
};

export const followStatus = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { user, dataSources } = context;
  const { users } = dataSources;

  if (user) return await users.loadFollowingStatus(parent.id);
  else return null;
};

export const profileImageURL = (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { mediaService } = context;

  if (parent.profileImageURL)
    return mediaService.getResourceURL(parent.profileImageURL);
  return null;
};

export const coverImageURL = (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { mediaService } = context;

  if (parent.coverImageURL)
    return mediaService.getResourceURL(parent.coverImageURL);
  return null;
};

export const posts = async (
  parent: any,
  args: UserProfilePostsArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getPostsByAuthor(parent.id, args.limit, args.offset);
};

export const ideas = async (
  parent: any,
  args: UserProfileIdeasArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getIdeasByAuthor(parent.id, args.limit, args.offset);
};

export const watchlists = (): any[] => [];
