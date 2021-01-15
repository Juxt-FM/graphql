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
import neo4j from "neo4j-driver";

import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";
import { AuthService, ProfileService, NotificationService } from "../services";
import {
  auth as authConfig,
  mail as mailConfig,
  neo4j as neo4jConfig,
} from "../config";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import permissions from "./permissions";

import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Request } from "express";

interface IContext extends ExpressContext {
  req: Request & { user: any };
}

/**
 * Setup the email service
 */
const notificationService = new NotificationService({
  from: mailConfig.fromEmail,
});

notificationService.initialize();

const neo4jDriver = neo4j.driver(
  neo4jConfig.host,
  neo4j.auth.basic(neo4jConfig.user, neo4jConfig.password)
);

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

/**
 * Build services and get the authenticated user ID
 * @param ctx
 */
const context = async (ctx: IContext) => {
  const {
    req: { user },
  } = ctx;

  const authService = new AuthService(authConfig, ctx, neo4jDriver);
  const userService = new ProfileService(ctx, neo4jDriver);

  return {
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
      // include credentials: refresh token, apca credentials, etc.
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
