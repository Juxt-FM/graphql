/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import expressJwt from "express-jwt";

import graph from "./graphql";
import { mongo as mongoConfig, auth as authConfig } from "./config";
import { authErrors } from "./middleware";
import * as logger from "./logging";

const app = express();

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
    secret: authConfig.jwtKey,
    issuer: authConfig.jwtIssuer,
    audience: authConfig.jwtAudience,
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

/**
 *
 * Start the services
 *
 * MongoDB
 * Express
 * Sematext monitoring (production only)
 *
 */

const port = process.env.PORT || 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:${port}`);
});

mongoose
  .connect(mongoConfig.uri, {
    authSource: "admin",
    user: mongoConfig.user,
    pass: mongoConfig.password,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB.");
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.log("An error occurred while connecting to MongoDB.");
  });

logger.start();
