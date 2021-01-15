/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import jwt from "jsonwebtoken";
import { uid } from "rand-token";

import BaseService, { IBaseConfig } from "../base";

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

  constructor(config: ITokenConfig, baseConfig: IBaseConfig) {
    super(baseConfig);

    this.config = config;
  }

  /**
   * Signs a JWT for the provided user
   * @param user
   */
  protected signToken = (id: string, verified: boolean) =>
    new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id, verified },
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
  private generateRefreshToken() {
    return uid(256);
  }

  /**
   * Put's the refresh token in a cookie
   */
  protected setRefreshCookie(token: string) {
    const options = {
      httpOnly: true,
      path: "/",
      signed: true,
    };

    this.response.cookie(this.config.refreshCookie, token, options);
  }

  /**
   * Clear's the credentials from cookies
   */
  protected clearRefreshCookie() {
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
  protected async getCredentials(user: any, platform: string) {
    const refreshToken = this.generateRefreshToken();

    if (platform === "web") {
      this.setRefreshCookie(refreshToken);
      const accessToken = await this.signToken(user.id, Boolean(user.verified));
      return { accessToken };
    }

    return {
      refreshToken,
      accessToken: await this.signToken(user.id, Boolean(user.verified)),
    };
  }
}
