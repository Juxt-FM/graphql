/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import * as Query from "./query";
import * as Mutation from "./mutation";

import { IResolverContext } from "../../server";
import { PostIdeasArgs, IdeaRepliesArgs } from "../../types";

export default {
  Query,
  Mutation,
  ActionableContent: {
    __resolveType: (parent: any) => {
      if (parent.label === "post") return "Post";
      else return "Idea";
    },
  },
  Post: {
    author: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { users } = context.dataSources;

      return await users.loadProfile(parent.author);
    },
    ideas: async (
      parent: any,
      args: PostIdeasArgs,
      context: IResolverContext
    ) => {
      const { userContent } = context.dataSources;

      return await userContent.getReplies(parent.id, args.limit, args.offset);
    },
    reactionCount: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { userContent } = context.dataSources;

      return await userContent.loadReactionCount(parent.id);
    },
    reactionStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ): Promise<any> => {
      const { userContent } = context.dataSources;

      return await userContent.loadReactionStatus(parent.id);
    },
  },
  Idea: {
    author: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { users } = context.dataSources;

      return await users.loadProfile(parent.author);
    },
    replies: async (
      parent: any,
      args: IdeaRepliesArgs,
      context: IResolverContext
    ) => {
      const { userContent } = context.dataSources;

      return await userContent.getReplies(parent.id, args.limit, args.offset);
    },
    reactionCount: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ) => {
      const { userContent } = context.dataSources;

      return await userContent.loadReactionCount(parent.id);
    },
    reactionStatus: async (
      parent: any,
      args: undefined,
      context: IResolverContext
    ): Promise<any> => {
      const { userContent } = context.dataSources;

      return await userContent.loadReactionStatus(parent.id);
    },
    attachments: (): any[] => []
  },
};
