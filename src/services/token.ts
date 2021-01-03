/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import jwt from "jsonwebtoken";
import _ from "lodash";

import BaseService, { IBaseConfig } from "./base";

import { IUserDocument } from "./models/user";
import RefreshTokenModel, {
  IRefreshTokenDocument,
  IRefreshTokenModel,
} from "./models/device";

export interface ITokenConfig {
  jwtKey: string;
  jwtAudience: string;
  jwtIssuer: string;
  jwtSubject: string;
  jwtExpiration: string;
  refreshCookie: string;
}

/**
 * The token service handles all of the
 * business logic relating to JWT's and
 * refresh tokens. Refresh tokens are stored
 * in MongoDB and revoked on each refresh.
 *
 * A user transfers the refresh token in an
 * HTTP only cookie so that it isn't accessible
 * on the client side
 */

export default class TokenService extends BaseService {
  private config: ITokenConfig;
  private tokenModel: IRefreshTokenModel;

  constructor(config: ITokenConfig, baseConfig: IBaseConfig) {
    super(baseConfig);

    this.config = config;
    this.tokenModel = RefreshTokenModel;
  }

  /**
   * Signs a JWT for the provided user
   * @param user
   */
  protected signToken = (user: IUserDocument) =>
    new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id: user.id, verified: user.verified },
        this.config.jwtKey,
        {
          expiresIn: this.config.jwtExpiration,
          audience: this.config.jwtAudience,
          issuer: this.config.jwtIssuer,
          subject: this.config.jwtSubject,
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

  /**
   * Generates and returns a refresh token for a user
   * @param user
   */
  private async generateRefreshToken(user: string) {
    try {
      const newToken = new this.tokenModel({
        user,
        issuedBy: this.getHost(),
      });

      await newToken.save();

      // update the refresh token cookie to reflect the updates
      this.response.cookie(this.config.refreshCookie, newToken.token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        signed: true,
      });

      return newToken;
    } catch (e) {
      throw this.getDefaultError();
    }
  }

  /**
   * Returns the current user's refresh token
   */
  protected async getRefreshToken() {
    const token = this.request.signedCookies[this.config.refreshCookie];
    const issuedBy = this.getHost();

    // @ts-ignore
    return await this.tokenModel.findOne({ token, issuedBy });
  }

  /**
   * Revokes a user's refresh token
   * @param token
   * @param newToken
   * @param reason
   */
  protected async revokeToken(
    token: IRefreshTokenDocument,
    newToken?: IRefreshTokenDocument,
    reason?: string
  ) {
    if (newToken) {
      token.revokedReason = "replaced";
      token.revokedBy = newToken.id;
      token.revokedAt = new Date();
    } else {
      token.revokedReason = reason;
      token.revokedAt = new Date();
    }

    await token.save();
  }

  /**
   * Clear's the credentials from cookies
   */
  protected clearCredentials() {
    const options = {
      expires: new Date(),
      httpOnly: true,
      path: "/",
      signed: true,
    };

    this.response.cookie(this.config.refreshCookie, undefined, options);
  }

  /**
   * Signs and returns a JWT, and generates a refresh token
   * to be stored in an HTTP only cookie
   * @param user
   */
  protected async getCredentials(user: IUserDocument) {
    await this.generateRefreshToken(user.id);

    return { accessToken: await this.signToken(user) };
  }

  /**
   * Refreshes a token for the given user
   */
  async refreshAccessToken() {
    try {
      const existingToken = await this.getRefreshToken();

      // if the token is expired or does not exist, clear cookies
      if (!existingToken) {
        this.clearCredentials();
        throw new Error();
      } else if (existingToken.isExpired) {
        this.revokeToken(existingToken, undefined, "expired");
      }

      const newToken = await this.generateRefreshToken(existingToken.user);
      await newToken.populate("user").execPopulate();

      await this.revokeToken(existingToken, newToken);

      // @ts-ignore
      return { accessToken: await this.signToken(newToken.user) };
    } catch {
      throw this.getDefaultError();
    }
  }
}
