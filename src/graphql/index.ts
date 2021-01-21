/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import AWS from "aws-sdk";
import {
  ApolloServer,
  PlaygroundConfig,
  makeExecutableSchema,
} from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";

import { UserAPI, AuthAPI, MarketAPI, ContentAPI } from "./sources";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import permissions from "./permissions";

import { IContextBuilder, IServerBuilder } from "./server";

import {
  AuthService,
  UserService,
  NotificationService,
  ContentService,
  MediaService,
} from "../services";
import { AuthHandler, ContentHandler, UserHandler } from "../database";

import * as settings from "../settings";

/**
 * Introspection controls whether or not the GraphQL schema
 * is exposed, and the playground is a UI to query/mutate the graph
 */

let introspection = false;
let playground: PlaygroundConfig = false;

if (process.env.NODE_ENV === "development") {
  introspection = true;
  playground = {
    settings: {
      // include credentials: refresh token, etc.
      "request.credentials": "include",
    },
  };
}

/**
 * Apply the query-level permissions we defined
 * with GraphQL Shield
 */
const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

/**
 * Returns a GraphQL server instance
 * @param options
 */
export const buildGraph = ({ database }: IServerBuilder) => {
  const s3 = new AWS.S3();

  /**
   * Because the services don't have any per-request
   * state, we can instantiate them when building the server
   * and just pass them to the context creator below.
   */

  const authService = new AuthService(
    settings.auth,
    database.register(AuthHandler)
  );
  const userService = new UserService(database.register(UserHandler));
  const mediaService = new MediaService(s3, settings.media);
  const contentService = new ContentService(database.register(ContentHandler));
  const notificationService = new NotificationService({
    from: settings.mail.fromEmail,
  });

  notificationService.initialize();

  const dataSources = () => ({
    auth: new AuthAPI(),
    users: new UserAPI(),
    content: new ContentAPI(),
    market: new MarketAPI({ uri: process.env.MARKET_SERVICE_URI }),
  });

  /**
   * Returns the per-request context, including authenticated user
   * info, service classes, and other request information
   * @param {ExpressContext} ctx
   */
  const context = async ({ req, res }: IContextBuilder) => {
    const { user } = req;

    const host = req.headers.forwarded || req.connection.remoteAddress;

    return {
      host,
      user,
      authService,
      userService,
      contentService,
      notificationService,
      mediaService,
      client: {
        name: req.headers["client_name"],
        version: req.headers["client_version"],
      },
      expressCtx: {
        req,
        res,
      },
    };
  };

  return new ApolloServer({
    schema,
    dataSources,
    context,
    introspection,
    playground,
    uploads: false,
  });
};
