/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { rule } from "graphql-shield";

export const isAuthenticated = rule({ cache: "contextual" })(
  (parent, args, ctx) => {
    return typeof ctx.user !== "undefined";
  }
);

export const isVerified = rule({ cache: "contextual" })((parent, args, ctx) => {
  return ctx.user ? ctx.user.verified : false;
});

export const hasAPCACredentials = rule({ cache: "contextual" })(
  (parent, args, ctx) => {
    return (
      typeof ctx.apcaKeyId !== "undefined" &&
      typeof ctx.apcaSecretKey !== "undefined"
    );
  }
);
