/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  MutationCreateListArgs,
  MutationDeleteListArgs,
  MutationUpdateListArgs,
} from "../../types";

export const createList = async (
  parent: undefined,
  args: MutationCreateListArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.createList(args.data);
};

export const updateList = async (
  parent: undefined,
  args: MutationUpdateListArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.updateList(args.id, args.data);
};

export const deleteList = async (
  parent: undefined,
  args: MutationDeleteListArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.deleteList(args.id);
};
