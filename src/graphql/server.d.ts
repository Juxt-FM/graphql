import {
  AuthService,
  NotificationService,
  UserService,
  VerificationService,
} from "../services";
import {
  UserAPI,
  AuthAPI,
  AnalysisAPI,
  MarketAPI,
  BlogAPI,
  FMPAPI,
} from "./sources";
import { Request, Response } from "express";

export interface IAuthenticatedUser {
  id: string;
  verified: string;
}

export interface IContext {
  user: IAuthenticatedUser | undefined;
  authService: AuthService;
  userService: UserService;
  verificationService: VerificationService;
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
    analysis: AnalysisAPI;
    market: MarketAPI;
    blog: BlogAPI;
    fmp: FMPAPI;
  };
}
