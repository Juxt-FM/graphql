/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  MutationCreatePostArgs,
  MutationCreateIdeaArgs,
  MutationCreateReactionArgs,
  MutationDeleteIdeaArgs,
  MutationUpdatePostArgs,
  MutationUpdateIdeaArgs,
  MutationDeleteReactionArgs,
  MutationDeletePostArgs,
  MutationReportContentArgs,
} from "../../types";

export const createPost = async (
  parent: undefined,
  args: MutationCreatePostArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.createPost(args.data);
};

export const updatePost = async (
  parent: undefined,
  args: MutationUpdatePostArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.updatePost(args.id, args.data);
};

export const deletePost = async (
  parent: undefined,
  args: MutationDeletePostArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.deletePost(args.id);
};

export const createIdea = async (
  parent: undefined,
  args: MutationCreateIdeaArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.createIdea(args.data);
};

export const updateIdea = async (
  parent: undefined,
  args: MutationUpdateIdeaArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.updateIdea(args.id, args.message);
};

export const deleteIdea = async (
  parent: undefined,
  args: MutationDeleteIdeaArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.deleteIdea(args.id);
};

export const createReaction = async (
  parent: undefined,
  args: MutationCreateReactionArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.createReaction(args);
};

export const deleteReaction = async (
  parent: undefined,
  args: MutationDeleteReactionArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.deleteReaction(args.id);
};

export const reportContent = async (
  parent: undefined,
  args: MutationReportContentArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.reportContent(args.id);
};
