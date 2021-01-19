import { Request, Response } from "express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";
import {
  AuthService,
  NotificationService,
  UserService,
  FileUploadService,
} from "../services";

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
  uploadService: FileUploadService;
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
