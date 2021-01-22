/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import { IdeaReactionsArgs, IdeaRepliesArgs } from "../../types";

export const author = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { users } = context.dataSources;

  return await users.loadProfile(parent.author);
};

export const replies = async (
  parent: any,
  args: IdeaRepliesArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getReplies(parent.id, args.limit, args.offset);
};

export const reactions = async (
  parent: any,
  args: IdeaReactionsArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getReactions(parent.id, args.limit, args.offset);
};

export const reactionCount = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.loadReactionCount(parent.id);
};

export const replyCount = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.loadReplyCount(parent.id);
};

export const reactionStatus = async (
  parent: any,
  args: undefined,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.loadReactionStatus(parent.id);
};

export const attachments = (): any[] => [];

export const replyStatus = (): any => null;
