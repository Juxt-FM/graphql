/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import moment from "moment";

import * as Query from "./query";

import { IntradayRecord } from "../../types";
import { IResolverContext } from "../../server";

export default {
  Query,
  Stock: {
    news: async (parent: any, args: undefined, context: IResolverContext) => {
      const { fmp } = context.dataSources;

      return await fmp.loadNews(parent.symbol);
    },
    quote: async (parent: any, args: undefined, context: IResolverContext) => {
      const { fmp } = context.dataSources;

      return await fmp.loadQuote(parent.symbol);
    },
  },
  CompanyProfile: {
    news: async (parent: any, args: undefined, context: IResolverContext) => {
      const { fmp } = context.dataSources;

      return await fmp.loadNews(parent.symbol);
    },
    quote: async (parent: any, args: undefined, context: IResolverContext) => {
      const { fmp } = context.dataSources;

      return await fmp.loadQuote(parent.symbol);
    },
  },
  IntradayRecord: {
    timestamp: (parent: IntradayRecord) => {
      return moment(parent.date, "YYYY-MM-DD hh:mm:ss").valueOf();
    },
  },
};
