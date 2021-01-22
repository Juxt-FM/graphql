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
  UserProfile: {
    followCount: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { users } = context.dataSources;

      return await users.loadFollowerCount(parent.id);
    },
    followStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { user, dataSources } = context;
      const { users } = dataSources;

      if (user) return await users.loadFollowingStatus(parent.id);
      else return null;
    },
    profileImageURL: (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { mediaService } = context;

      return mediaService.getResourceURL(parent.profileImageURL);
    },
    coverImageURL: (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { mediaService } = context;

      return mediaService.getResourceURL(parent.coverImageURL);
    },
    posts: async (parent: any, args: any, context: IResolverContext) => {
      const { content } = context.dataSources;

      return await content.getPostsByAuthor(parent.id, args.limit, args.offset);
    },
    ideas: async (parent: any, args: any, context: IResolverContext) => {
      const { content } = context.dataSources;

      return await content.getIdeasByAuthor(parent.id, args.limit, args.offset);
    },
    watchlists: (): any[] => [],
  },
};
