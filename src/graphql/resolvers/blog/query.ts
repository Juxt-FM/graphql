/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import {
  QueryFilterBlogPostsArgs,
  QuerySingleBlogPostArgs,
  QueryMyDraftsArgs,
  QueryCommentThreadArgs,
  QueryReactionsArgs,
} from "../../types";
import { IResolverContext } from "../../server";

export const singleBlogPost = async (
  parent: undefined,
  args: QuerySingleBlogPostArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.getById(args.id);
};

export const filterBlogPosts = async (
  parent: undefined,
  args: QueryFilterBlogPostsArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.filter(args.filters);
};

export const myDrafts = async (
  parent: undefined,
  args: QueryMyDraftsArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.drafts(args);
};

export const commentThread = async (
  parent: undefined,
  args: QueryCommentThreadArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.getCommentThread(args.parent, args.filters);
};

export const reactions = async (
  parent: undefined,
  args: QueryReactionsArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.getReactions(args);
};
