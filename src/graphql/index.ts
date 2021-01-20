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

import { UserAPI, AuthAPI, MarketAPI, UserContentAPI } from "./sources";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import permissions from "./permissions";

import { IContextBuilder, IServerBuilder } from "./server";

import {
  AuthService,
  UserService,
  NotificationService,
  UserContentService,
  MediaService,
} from "../services";
import { AuthHandler, UserContentHandler, UserHandler } from "../db";

import { auth, mail, media } from "../settings";

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

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

/**
 * Returns a GraphQL server instance
 * @param options
 */
export const buildGraph = ({ db }: IServerBuilder) => {
  const s3 = new AWS.S3();

  const authService = new AuthService(auth, db.registerHandler(AuthHandler));
  const userService = new UserService(db.registerHandler(UserHandler));
  const userContentService = new UserContentService(
    db.registerHandler(UserContentHandler)
  );
  const mediaService = new MediaService(s3, {
    bucket: process.env.MEDIA_BUCKET || "juxt-media",
  });

  const notificationService = new NotificationService({
    from: mail.fromEmail,
  });

  notificationService.initialize();

  const dataSources = () => ({
    auth: new AuthAPI(),
    users: new UserAPI(),
    userContent: new UserContentAPI(),
    market: new MarketAPI({ uri: process.env.MARKET_SERVICE_URI }),
  });

  const context = async ({ req, res }: IContextBuilder) => {
    const { user } = req;

    const host = req.headers.forwarded || req.connection.remoteAddress;

    return {
      host,
      user,
      authService,
      userService,
      userContentService,
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
