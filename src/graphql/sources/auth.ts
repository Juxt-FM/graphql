/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";

import { IContext } from "../server";
import { CreateUserInput, LoginUserInput } from "../types";

export class AuthAPI extends DataSource {
  context: IContext;

  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;
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
   * @param data
   */
  async loginUser(data: LoginUserInput, device: any) {
    const { authService } = this.context;
    try {
      return await authService.login(data, device);
    } catch (e) {
      return e;
    }
  }

  /**
   * Create a new user and return the result
   * @param data
   */
  async registerUser(data: CreateUserInput, device: any) {
    const { authService, notificationService } = this.context;
    try {
      const { user, credentials, emailCode } = await authService.register(
        data,
        device
      );

      notificationService.sendEmail(
        [user.email],
        "Email Verification",
        `Your JUXT verification code: ${emailCode}`
      );

      return credentials;
    } catch (e) {
      return e;
    }
  }

  /**
   * Clears the credentials for this user
   */
  async logoutUser(device: any) {
    try {
      const { user, authService } = this.context;
      return await authService.logout(user.id, device);
    } catch (e) {
      return e;
    }
  }

  /**
   * Refresh a user's token
   * @param data
   */
  async refreshToken() {
    const { authService } = this.context;
    try {
      return "Refresh access token.";
    } catch (e) {
      return e;
    }
  }

  /**
   * Reset logged in user's password
   * @param data
   */
  async resetPassword(data: any) {
    const { user, authService } = this.context;
    try {
      return await authService.resetPassword(user.id, data);
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their email address
   * @param code
   */
  async verifyEmail(email: string, code: string) {
    const { user, authService } = this.context;
    try {
      return await authService.verifyEmail(
        user.id,
        email,
        code,
        !user.verified
      );
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their phone number
   * @param code
   */
  async verifyPhone(phone: string, code: string) {
    const { user, authService } = this.context;
    try {
      return await authService.verifyPhone(
        user.id,
        phone,
        code,
        !user.verified
      );
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their phone number
   * @param code
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
