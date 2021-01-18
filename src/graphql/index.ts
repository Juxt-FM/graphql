/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import {
  ApolloError,
  ApolloServer,
  PlaygroundConfig,
  makeExecutableSchema,
} from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { GraphQLError } from "graphql";

import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";
import { AuthService, UserService, NotificationService } from "../services";
import GraphDB, { AuthHandler, UserHandler } from "../db";
import {
  auth as authConfig,
  mail as mailConfig,
  database as dbConfig,
} from "../settings";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import permissions from "./permissions";

import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Request } from "express";

/**
 * Connect to database
 */
const db = new GraphDB(dbConfig.host);

db.connect();

/**
 * Setup the email service
 */
const notificationService = new NotificationService({
  from: mailConfig.fromEmail,
});

notificationService.initialize();

/**
 * Our datasources are defined separately from
 * the application context
 */
const dataSources = () => ({
  auth: new AuthAPI(),
  users: new UserAPI(),
  market: new MarketAPI({ uri: process.env.MARKET_SERVICE_URI }),
  blog: new BlogAPI({ uri: process.env.BLOG_SERVICE_URI }),
});

interface IContext extends ExpressContext {
  req: Request & { user: any };
}

/**
 * Build services and get the authenticated user ID
 * @param ctx
 */
const context = async (ctx: IContext) => {
  const {
    req: { user },
  } = ctx;

  const host = ctx.req.headers.forwarded || ctx.req.connection.remoteAddress;

  const authService = new AuthService(
    authConfig,
    db.registerHandler(AuthHandler)
  );

  const userService = new UserService(db.registerHandler(UserHandler));

  return {
    host,
    user,
    authService,
    userService,
    notificationService,
    expressCtx: {
      req: ctx.req,
      res: ctx.res,
    },
  };
};

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

const formatError = (err: GraphQLError) => {
  if (err.message.includes("ECONNREFUSED"))
    return new ApolloError("Internal server error.");

  return err;
};

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

export default new ApolloServer({
  schema,
  dataSources,
  context,
  introspection,
  playground,
  formatError,
});
