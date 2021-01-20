/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { rule } from "graphql-shield";

import { IResolverContext } from "../server";

export const isUser = (parent: any, args: any, ctx: IResolverContext) => {
  return typeof ctx.user !== "undefined";
};

export const hasVerifiedStatus = (
  parent: any,
  args: any,
  ctx: IResolverContext
) => {
  return ctx.user ? ctx.user.verified : false;
};

export const hasCredentials = (
  parent: any,
  args: any,
  ctx: IResolverContext
) => {
  const token = ctx.expressCtx.req.signedCookies["device_token"];

  if (ctx.client.name === "web") return typeof token !== "undefined";
  else if (ctx.client.name === "mobile") return typeof args.token === "string";
  else return false;
};

export const isAuthenticated = rule({ cache: "contextual" })(isUser);

export const isVerified = rule({ cache: "contextual" })(hasVerifiedStatus);

export const canRefreshToken = rule({ cache: "contextual" })(hasCredentials);
