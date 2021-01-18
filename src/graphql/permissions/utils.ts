/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { rule } from "graphql-shield";

import { IResolverContext } from "../server";

export const isAuthenticated = rule({ cache: "contextual" })(
  (parent: any, args: any, ctx: IResolverContext) => {
    return typeof ctx.user !== "undefined";
  }
);

export const isVerified = rule({ cache: "contextual" })(
  (parent: any, args: any, ctx: IResolverContext) => {
    return ctx.user ? ctx.user.verified : false;
  }
);

export const hasRefreshCredentials = rule({ cache: "contextual" })(
  (parent: any, args: any, ctx: IResolverContext) => {
    const token = ctx.expressCtx.req.signedCookies["device_token"];
    return typeof token !== "undefined";
  }
);
