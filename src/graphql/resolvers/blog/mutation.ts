/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import {
  MutationCreateBlogPostArgs,
  MutationCreateCommentArgs,
  MutationCreateReactionArgs,
  MutationDeleteCommentArgs,
  MutationUpdateBlogPostArgs,
  MutationUpdateCommentArgs,
  MutationUpdateReactionArgs,
  MutationDeleteReactionArgs,
  MutationDeleteBlogPostArgs,
} from "../../types";
import { IResolverContext } from "../../server";

export const createBlogPost = async (
  parent: undefined,
  args: MutationCreateBlogPostArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.createPost(args.data);
};

export const updateBlogPost = async (
  parent: undefined,
  args: MutationUpdateBlogPostArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.updatePost(args.id, args.data);
};

export const deleteBlogPost = async (
  parent: undefined,
  args: MutationDeleteBlogPostArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.deletePost(args.id);
};

export const createComment = async (
  parent: undefined,
  args: MutationCreateCommentArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.createComment(args.data);
};

export const updateComment = async (
  parent: undefined,
  args: MutationUpdateCommentArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.updateComment(args.id, args.data);
};

export const deleteComment = async (
  parent: undefined,
  args: MutationDeleteCommentArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.deleteComment(args.id);
};

export const createReaction = async (
  parent: undefined,
  args: MutationCreateReactionArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.createReaction(args.data);
};

export const updateReaction = async (
  parent: undefined,
  args: MutationUpdateReactionArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.updateReaction(args.id, args.data);
};

export const deleteReaction = async (
  parent: undefined,
  args: MutationDeleteReactionArgs,
  context: IResolverContext
) => {
  const { blog } = context.dataSources;

  return await blog.deleteReaction(args.id);
};
