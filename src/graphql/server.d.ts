import { Request, Response } from "express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import { UserAPI, AuthAPI, MarketAPI, UserContentAPI } from "./sources";
import {
  AuthService,
  NotificationService,
  UserContentService,
  UserService,
} from "../services";

import GraphDB from "../db";

interface IServerBuilder {
  db: GraphDB;
}

export interface IAuthenticatedUser {
  id: string;
  profile: string;
  verified: boolean;
}

interface IContextBuilder extends ExpressContext {
  req: Request & { user: IAuthenticatedUser | undefined };
}

export interface IMediaContext {
  buckets: {
    profileImages: string;
    coverImages: string;
  };
  getResourceURL: (bucket: string, key: string) => string;
}

export interface IContext {
  user: IAuthenticatedUser | undefined;
  authService: AuthService;
  userService: UserService;
  userContentService: UserContentService;
  notificationService: NotificationService;
  host: string;
  media: IMediaContext;
  client: {
    name: "web" | "mobile";
    version: string;
  };
  expressCtx: {
    req: Request;
    res: Response;
  };
}

export interface IResolverContext extends IContext {
  dataSources: {
    users: UserAPI;
    auth: AuthAPI;
    market: MarketAPI;
    userContent: UserContentAPI;
  };
}
