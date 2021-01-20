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
    followingStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ): Promise<any> => {
      const { users } = context.dataSources;

      return await users.loadFollowingStatus(parent.id);
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
    posts: (): any[] => [],
    ideas: (): any[] => [],
    watchlists: (): any[] => [],
  },
};
