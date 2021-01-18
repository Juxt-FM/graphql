/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import {
  ApolloServer,
  PlaygroundConfig,
  makeExecutableSchema,
} from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";

import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";
import { AuthService, UserService, NotificationService } from "../services";
import GraphDB, { AuthHandler, UserHandler } from "../db";
import { auth, mail } from "../settings";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import permissions from "./permissions";

import { IContextBuilder } from "./server";

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

interface IServerBuilder {
  db: GraphDB;
}

/**
 * Returns a GraphQLServer instance
 * @param options
 */
export const buildServer = ({ db }: IServerBuilder) => {
  const authService = new AuthService(auth, db.registerHandler(AuthHandler));
  const userService = new UserService(db.registerHandler(UserHandler));
  const notificationService = new NotificationService({
    from: mail.fromEmail,
  });

  notificationService.initialize();

  const dataSources = () => ({
    auth: new AuthAPI(),
    users: new UserAPI(),
    market: new MarketAPI({ uri: process.env.MARKET_SERVICE_URI }),
    blog: new BlogAPI({ uri: process.env.BLOG_SERVICE_URI }),
  });

  const context = async (ctx: IContextBuilder) => {
    const {
      req: { user },
    } = ctx;

    const host = ctx.req.headers.forwarded || ctx.req.connection.remoteAddress;

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

  return new ApolloServer({
    schema,
    dataSources,
    context,
    introspection,
    playground,
  });
};
