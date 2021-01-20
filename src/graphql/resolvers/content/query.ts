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
  const { userContent } = context.dataSources;

  return await userContent.getPostByID(args.id);
};

export const ideaByID = async (
  parent: undefined,
  args: QueryIdeaByIdArgs,
  context: IResolverContext
) => {
  const { userContent } = context.dataSources;

  return await userContent.getIdeaByID(args.id);
};
