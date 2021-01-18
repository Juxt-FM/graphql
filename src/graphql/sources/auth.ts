/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import {
  UserInput,
  DeviceInput,
  LoginInput,
  MutationResetPasswordArgs,
} from "../types";

export class AuthAPI extends BaseAPI {
  constructor() {
    super();
  }

  // Retrieve the refresh token from cookies
  private getRefreshToken() {
    const { expressCtx } = this.context;
    return expressCtx.req.signedCookies["device_token"];
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
    return await this.handler(
      "getCurrentUser",
      async () => await authService.getUser(user.id)
    );
  }

  /**
   * Attempt to log in a user
   * @param {LoginInput} data
   * @param {DeviceInput} device
   */
  async loginUser(data: LoginInput, device: DeviceInput) {
    return await this.handler("loginUser", async () => {
      const { authService, host } = this.context;

      const credentials = await authService.login(data, {
        ...device,
        address: host,
      });

      this.setRefreshCookie(credentials.refreshToken);
      credentials.refreshToken = undefined;

      return credentials;
    });
  }

  /**
   * Create a new user and return the result
   * @param {UserInput} data
   * @param {DeviceInput} device
   */
  async registerUser(data: UserInput, device: DeviceInput) {
    return await this.handler("registerUser", async () => {
      const { authService, notificationService, host } = this.context;

      const { user, credentials, code } = await authService.register(data, {
        ...device,
        address: host,
      });

      this.setRefreshCookie(credentials.refreshToken);

      notificationService.sendEmail(
        [user.email],
        "Email Verification",
        `Your JUXT verification code: ${code}`
      );

      return { accessToken: credentials.accessToken };
    });
  }

  /**
   * Update a user's email address
   * @param {string} email
   */
  async updateEmail(email: string) {
    return await this.handler("updateEmail", async () => {
      const { user, authService, notificationService } = this.context;

      const result = await authService.updateEmail(user.id, email);

      notificationService.sendEmail(
        [result.user.email],
        "Email Verification",
        `Your JUXT verification code: ${result.code}`
      );

      return result.user;
    });
  }

  /**
   * Update a user's phone number
   * @param {string} phone
   */
  async updatePhone(phone: string) {
    return await this.handler("updatePhone", async () => {
      const { user, authService, notificationService } = this.context;

      const result = await authService.updatePhone(user.id, phone);

      notificationService.sendSMS(
        [result.user.phone],
        `Your JUXT verification code: ${result.code}`
      );

      return result.user;
    });
  }

  /**
   * Clears the credentials for this user
   * @param {string} device
   */
  async logoutUser(device: string) {
    return await this.handler("logoutUser", async () => {
      const { user, authService } = this.context;

      this.clearRefreshCookie();

      return await authService.logout(user.id, device);
    });
  }

  /**
   * Refresh a user's token.
   * @param {string} device
   */
  async refreshToken(device: string) {
    return await this.handler("refreshToken", async () => {
      const { authService } = this.context;
      const token = this.getRefreshToken();

      const credentials = await authService.refreshToken(device, token);

      this.setRefreshCookie(credentials.refreshToken);
      credentials.refreshToken = undefined;

      return credentials;
    });
  }

  /**
   * Reset logged in user's password
   * @param {MutationResetPasswordArgs} args
   */
  async resetPassword(args: MutationResetPasswordArgs) {
    return await this.handler("resetPassword", async () => {
      const { user, authService } = this.context;

      return await authService.resetPassword(user.id, args);
    });
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their email address
   * @param {string} code
   */
  async verifyEmail(code: string) {
    return await this.handler("verifyEmail", async () => {
      const { user, authService } = this.context;

      return await authService.verifyEmail(user.id, code, !user.verified);
    });
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their phone number
   * @param {string} code
   */
  async verifyPhone(code: string) {
    return await this.handler("verifyPhone", async () => {
      const { user, authService } = this.context;

      return await authService.verifyPhone(user.id, code, !user.verified);
    });
  }

  /**
   * Deactivate the current user's account
   */
  async deactivateAccount() {
    return await this.handler("deactivateAccount", async () => {
      const { user, authService } = this.context;

      return await authService.deactivateAccount(user.id);
    });
  }
}
