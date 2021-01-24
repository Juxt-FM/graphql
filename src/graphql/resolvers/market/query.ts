/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { IResolverContext } from "../../server";
import { QuerySectorsArgs, QueryIndustriesArgs } from "../../types";

export const sectors = async (
  parent: undefined,
  args: QuerySectorsArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.getAllSectors(args.limit, args.offset);
};

export const industries = async (
  parent: undefined,
  args: QueryIndustriesArgs,
  context: IResolverContext
) => {
  const { market } = context.dataSources;

  return await market.getAllIndustries(args.limit, args.offset);
};
