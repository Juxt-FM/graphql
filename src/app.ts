/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressJwt from "express-jwt";
// import rateLimit from "express-rate-limit";

import GraphDB, { MarketHandler } from "./database";

import { auth } from "./settings";
import { authErrors } from "./middleware";

import { buildGraph } from "./graphql";

import * as logging from "./logging";

interface IAppBuilder {
  database: GraphDB;
  port: string | number;
}

export const buildApp = ({ database, port }: IAppBuilder) => {
  const app = express();

  const graph = buildGraph({ database });

  /**
   * Need to set the content security policy in development
   * so that the GraphQL playground can load properly
   */
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === "development" ? false : undefined,
    })
  );

  app.use(cookieParser(process.env.COOKIE_SECRET || "some_secret_key"));

  // Show true origin IP addr when behind proxy
  if (process.env.PROXY_IN_USE) app.enable("trust proxy");

  // Basic rate limiting, will add redis store in production
  /*
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    })
  );
   */

  app.use(
    expressJwt({
      secret: auth.jwtKey,
      issuer: auth.jwtIssuer,
      audience: auth.jwtAudience,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  app.use(authErrors);

  graph.applyMiddleware({
    app,
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
      credentials: true,
      methods: "POST",
      preflightContinue: false,
    },
  });

  app.get("/health", async (req, res) => {
    try {
      const handler: MarketHandler = database.register(MarketHandler);

      const results = await handler.findAllSectors(10, 0);

      return res.status(200).json({ results });
    } catch (e) {
      logging.logError(`Health check error: ${e}`);
      const error = {
        error: "An error occurred while processing your request.",
      };
      return res.status(500).json(error);
    }
  });

  return {
    start: () => {
      return app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started at http://localhost:${port}`);
      });
    },
  };
};
