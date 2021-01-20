/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { QueryIdeaByIdArgs, QueryPostByIdArgs } from "src/graphql/types";
import { IResolverContext } from "../../server";

export const postByID = async (
  parent: undefined,
  args: QueryPostByIdArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getPostByID(args.id);
};

export const ideaByID = async (
  parent: undefined,
  args: QueryIdeaByIdArgs,
  context: IResolverContext
) => {
  const { content } = context.dataSources;

  return await content.getIdeaByID(args.id);
};
