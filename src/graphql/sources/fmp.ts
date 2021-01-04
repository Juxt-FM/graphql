/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { ApolloError } from "apollo-server-express";
import DataLoader from "dataloader";
import _ from "lodash";

import * as logging from "../../logging";

import { IContext } from "../server";

interface IFMPConfig {
  apikey: string;
}

interface INewsFilters {
  tickers?: string[];
  limit?: number;
}

export class FMPAPI extends RESTDataSource<IContext> {
  private config: IFMPConfig;
  quoteLoader: DataLoader<any, any, any>;
  newsLoader: DataLoader<any, any, any>;

  constructor(config: IFMPConfig) {
    super();
    this.config = config;
    this.baseURL =
      process.env.FMP_API_URI || "https://financialmodelingprep.com";

    this.quoteLoader = this.buildQuoteLoader();
    this.newsLoader = this.buildNewsLoader();
  }

  willSendRequest(request: RequestOptions) {
    request.params.set("apikey", this.config.apikey);
  }

  /**
   * Returns a new dataloader for a stock's current quote
   */
  private buildQuoteLoader() {
    return new DataLoader(async (symbols: string[]) => {
      const quotes = await this.get(`/api/v3/quote/${symbols.join(",")}`);

      const bySymbol = _.keyBy(quotes, "symbol");

      return symbols.map((symbol) => bySymbol[symbol] || null);
    });
  }

  /**
   * Returns a new dataloader for a stock's current quote
   */
  private buildNewsLoader() {
    return new DataLoader(async (symbols: string[]) => {
      const news = await this.getNews({ tickers: symbols, limit: 5 });

      const bySymbol = _.chain(news).groupBy("symbol").value();

      return symbols.map((symbol) => bySymbol[symbol] || []);
    });
  }

  /**
   * Returns the company details for a symbol
   * @param symbol
   */
  async getCompanyProfile(symbol: string) {
    try {
      const result = await this.get(`/api/v3/profile/${symbol}`);
      return result[0];
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns news for a list of symbols
   * @param filters
   */
  async getNews(filters: INewsFilters) {
    try {
      const { limit = 15, tickers } = filters;

      return await this.get("/api/v3/stock_news", { limit, tickers });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns historical data for the given symbol
   * @param symbol
   * @param timeframe
   */
  async getIntradayRecords(symbol: string, timeframe = "1min") {
    try {
      const records = await this.get(
        `/api/v3/historical-chart/${timeframe}/${symbol}`
      );

      return records.reverse();
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns tickers that matched the query
   * @param filters
   */
  async searchTickers(filters: any) {
    try {
      const { query, limit = 15 } = filters;

      return await this.get("/api/v3/search", {
        query,
        limit,
      });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Loads a symbol into the quote loader
   * @param symbol
   */
  async loadQuote(symbol: string) {
    return await this.quoteLoader.load(symbol);
  }

  /**
   * Loads a symbol into the news loader
   * @param symbol
   */
  async loadNews(symbol: string) {
    return await this.newsLoader.load(symbol);
  }
}
