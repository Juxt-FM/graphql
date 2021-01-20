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
    profileImageURL: (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { buckets, getResourceURL } = context.media;
      return getResourceURL(buckets.profileImages, parent.profileImageURL);
    },
    coverImageURL: (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { buckets, getResourceURL } = context.media;
      return getResourceURL(buckets.coverImages, parent.coverImageURL);
    },
    posts: (): any[] => [],
    ideas: (): any[] => [],
    watchlists: (): any[] => [],
  },
};
