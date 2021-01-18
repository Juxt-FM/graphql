import { Request, Response } from "express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import { AuthService, NotificationService, UserService } from "../services";
import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";

export interface IAuthenticatedUser {
  id: string;
  verified: string;
}

interface IContextBuilder extends ExpressContext {
  req: Request & { user: any };
}

export interface IContext {
  user: IAuthenticatedUser | undefined;
  authService: AuthService;
  userService: UserService;
  notificationService: NotificationService;
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
    blog: BlogAPI;
  };
}
