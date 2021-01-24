import { Request, Response } from "express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import { UserAPI, AuthAPI, MarketAPI, ContentAPI } from "./sources";
import {
  AuthService,
  MediaService,
  NotificationService,
  ContentService,
  UserService,
  MarketService,
} from "../services";

import GraphDB from "../database";

interface IServerBuilder {
  database: GraphDB;
}

export interface IAuthenticatedUser {
  id: string;
  profile: string;
  verified: boolean;
}

interface IContextBuilder extends ExpressContext {
  req: Request & { user: IAuthenticatedUser | undefined };
}

export interface IContext {
  user: IAuthenticatedUser | undefined;
  authService: AuthService;
  userService: UserService;
  contentService: ContentService;
  marketService: MarketService;
  notificationService: NotificationService;
  mediaService: MediaService;
  host: string;
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
    content: ContentAPI;
  };
}
