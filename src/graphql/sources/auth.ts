/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";

import { IContext } from "../server";
import {
  UserInput,
  DeviceInput,
  LoginInput,
  MutationResetPasswordArgs,
} from "../types";

export class AuthAPI extends DataSource {
  context: IContext;

  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;
  }

  // Puts the token in an HTTP only cookie
  private setRefreshCookie(token: string) {
    const { expressCtx } = this.context;

    expressCtx.res.cookie("device_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
      signed: true,
    });
  }

  // Deletes the refresh token cookie
  private clearRefreshCookie() {
    const { expressCtx } = this.context;

    expressCtx.res.cookie("device_token", undefined, {
      expires: new Date(),
      httpOnly: true,
      path: "/",
      signed: true,
    });
  }

  /**
   * Returns the logged in user
   */
  async getCurrentUser() {
    const { user, authService } = this.context;
    try {
      return await authService.getUser(user.id);
    } catch (e) {
      return e;
    }
  }

  /**
   * Attempt to log in a user
   * @param {LoginInput} data
   * @param {DeviceInput} device
   */
  async loginUser(data: LoginInput, device: DeviceInput) {
    const { authService, host } = this.context;

    try {
      const credentials = await authService.login(data, {
        ...device,
        address: host,
      });

      this.setRefreshCookie(credentials.refreshToken);
      credentials.refreshToken = undefined;

      return credentials;
    } catch (e) {
      return e;
    }
  }

  /**
   * Create a new user and return the result
   * @param {UserInput} data
   * @param {DeviceInput} device
   */
  async registerUser(data: UserInput, device: DeviceInput) {
    const { authService, notificationService, host } = this.context;
    try {
      let { user, credentials, code } = await authService.register(data, {
        ...device,
        address: host,
      });

      if (device.platform === "web") {
        this.setRefreshCookie(credentials.refreshToken);
        credentials.refreshToken = undefined;
      }

      notificationService.sendEmail(
        [user.email],
        "Email Verification",
        `Your JUXT verification code: ${code}`
      );

      return credentials;
    } catch (e) {
      return e;
    }
  }

  /**
   * Update a user's email address
   * @param {string} email
   */
  async updateEmail(email: string) {
    try {
      const { user, authService, notificationService } = this.context;

      const result = await authService.updateEmail(user.id, email);

      notificationService.sendEmail(
        [result.user.email],
        "Email Verification",
        `Your JUXT verification code: ${result.code}`
      );

      return result.user;
    } catch (e) {
      return e;
    }
  }

  /**
   * Update a user's phone number
   * @param {string} phone
   */
  async updatePhone(phone: string) {
    try {
      const { user, authService, notificationService } = this.context;

      const result = await authService.updatePhone(user.id, phone);

      notificationService.sendSMS(
        [result.user.email],
        `Your JUXT verification code: ${result.code}`
      );

      return result.user;
    } catch (e) {
      return e;
    }
  }

  /**
   * Clears the credentials for this user
   * @param {string} device
   */
  async logoutUser(device: string) {
    try {
      const { user, authService } = this.context;

      this.clearRefreshCookie();

      return await authService.logout(user.id, device);
    } catch (e) {
      return e;
    }
  }

  /**
   * Refresh a user's token.
   * @param {string} device
   */
  async refreshToken(device: string) {
    const { authService, expressCtx } = this.context;
    try {
      const token = expressCtx.req.signedCookies["device_token"];

      const credentials = await authService.refreshToken(device, token);

      this.setRefreshCookie(credentials.refreshToken);
      credentials.refreshToken = undefined;

      return credentials;
    } catch (e) {
      return e;
    }
  }

  /**
   * Reset logged in user's password
   * @param {MutationResetPasswordArgs} args
   */
  async resetPassword(args: MutationResetPasswordArgs) {
    const { user, authService } = this.context;
    try {
      return await authService.resetPassword(user.id, args);
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their email address
   * @param {string} code
   */
  async verifyEmail(code: string) {
    const { user, authService } = this.context;
    try {
      return await authService.verifyEmail(user.id, code, !user.verified);
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their phone number
   * @param {string} code
   */
  async verifyPhone(code: string) {
    const { user, authService } = this.context;
    try {
      return await authService.verifyPhone(user.id, code, !user.verified);
    } catch (e) {
      return e;
    }
  }

  /**
   * Deactivate the current user's account
   */
  async deactivateAccount() {
    const { user, authService } = this.context;
    try {
      return await authService.deactivateAccount(user.id);
    } catch (e) {
      return e;
    }
  }
}
