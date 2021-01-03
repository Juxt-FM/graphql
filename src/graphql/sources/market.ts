/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { ApolloError, UserInputError } from "apollo-server-express";
import _ from "lodash";

import { IContext } from "../server";

import * as logging from "../../logging";

import { WatchlistInput } from "../types";

interface IMarketAPI {
  uri?: string;
}

export class MarketAPI extends RESTDataSource<IContext> {
  context: IContext;

  constructor(options: IMarketAPI = {}) {
    super();
    this.baseURL = options.uri || "http://localhost:4001/api/v1/";
  }

  willSendRequest(request: RequestOptions) {
    const { req } = this.context.expressCtx;
    const accessToken = req.headers.authorization;

    if (typeof accessToken !== "undefined")
      request.headers.set("Authorization", accessToken);
  }

  /**
   * Returns a user's watchlists
   */
  async getUserWatchlists(id: string) {
    try {
      return await this.get(`watchlists/user/${id}`);
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
   * Creates a new watchlist for the user
   * @param data
   */
  async createWatchlist(data: WatchlistInput) {
    try {
      return await this.post("watchlists", { ...data });
    } catch (e) {
      if (e instanceof ApolloError) {
        const { status, body } = e.extensions.response;

        const err = body.errors[0];

        if (status === 422) {
          return new UserInputError(err.message, {
            invalidArgs: err.invalidArgs,
          });
        }

        return new ApolloError(err.message);
      } else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Updates a watchlist for the user
   * @param id
   * @param data
   */
  async updateWatchlist(id: string, data: WatchlistInput) {
    try {
      return await this.put(`watchlists/${id}`, { ...data });
    } catch (e) {
      if (e instanceof ApolloError) {
        const { status, body } = e.extensions.response;

        const err = body.errors[0];

        if (status === 422) {
          return new UserInputError(err.message, {
            invalidArgs: err.invalidArgs,
          });
        }

        return new ApolloError(err.message);
      } else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Deletes a watchlist for the user
   * @param id
   */
  async deleteWatchlist(id: string) {
    try {
      await this.delete(`watchlists/${id}`);
      return `Deleted watchlist with ID ${id}`;
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
}
