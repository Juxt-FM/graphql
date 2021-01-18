/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressJwt from "express-jwt";

import GraphDB from "./db";

import { auth, database } from "./settings";
import { authErrors } from "./middleware";

import { buildGraph } from "./graphql";

export const db = new GraphDB(database.host);

const app = express();

const graph = buildGraph({ db });

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

export default app;
