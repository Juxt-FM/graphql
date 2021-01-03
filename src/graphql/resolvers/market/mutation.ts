/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import {
  MutationCreateWatchlistArgs,
  MutationDeleteWatchlistArgs,
  MutationUpdateWatchlistArgs,
} from "../../types";

export const createWatchlist = async (
  parent: undefined,
  args: MutationCreateWatchlistArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.createWatchlist(args.data);
};

export const updateWatchlist = async (
  parent: undefined,
  args: MutationUpdateWatchlistArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.updateWatchlist(args.id, args.data);
};

export const deleteWatchlist = async (
  parent: undefined,
  args: MutationDeleteWatchlistArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.deleteWatchlist(args.id);
};
