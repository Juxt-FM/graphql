/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import * as Query from "./query";
import * as Mutation from "./mutation";

import { IResolverContext } from "../../server";
import { BlogPostCommentsArgs } from "../../types";

export default {
  Query,
  Mutation,
  BlogPost: {
    comments: async (
      parent: any,
      args: BlogPostCommentsArgs,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;
      const { id } = parent;

      return await blog.getPostComments(id, args);
    },
    reactionCount: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;

      return await blog.loadReactionCount(parent.id);
    },
    reactionStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;

      return await blog.loadUserReaction(parent.id);
    },
  },
  Comment: {
    reactionCount: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;

      return await blog.loadReactionCount(parent.id);
    },
    reactionStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { blog } = context.dataSources;

      return await blog.loadUserReaction(parent.id);
    },
  },
};
