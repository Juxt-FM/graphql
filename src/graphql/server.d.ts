import { AuthService, NotificationService, ProfileService } from "../services";
import { UserAPI, AuthAPI, MarketAPI, BlogAPI } from "./sources";
import { Request, Response } from "express";

export interface IAuthenticatedUser {
  id: string;
  verified: string;
}

export interface IContext {
  user: IAuthenticatedUser | undefined;
  authService: AuthService;
  profileService: ProfileService;
  notificationService: NotificationService;
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
