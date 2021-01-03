/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import {
  QuerySearchTickersArgs,
  QueryCompanyProfileArgs,
  QueryIntradayRecordsArgs,
} from "../../types";
import { IResolverContext } from "../../server";

export const searchTickers = async (
  parent: undefined,
  args: QuerySearchTickersArgs,
  context: IResolverContext
) => {
  const { fmp } = context.dataSources;

  return await fmp.searchTickers(args.filters);
};

export const companyProfile = async (
  parent: undefined,
  args: QueryCompanyProfileArgs,
  context: IResolverContext
) => {
  const { fmp } = context.dataSources;

  return await fmp.getCompanyProfile(args.symbol);
};

export const latestNews = async (
  parent: undefined,
  args: undefined,
  context: IResolverContext
) => {
  const { fmp } = context.dataSources;

  return await fmp.getNews({});
};

export const intradayRecords = async (
  parent: undefined,
  args: QueryIntradayRecordsArgs,
  context: IResolverContext
) => {
  const { fmp } = context.dataSources;

  return await fmp.getIntradayRecords(args.symbol, args.timeframe);
};
