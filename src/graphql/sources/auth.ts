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
   * Attempt to log in a user
   * @param data
   */
  async loginUser(data: LoginUserInput) {
    const { authService } = this.context;
    try {
      return await authService.login(data);
    } catch (e) {
      return e;
    }
  }

  /**
   * Create a new user and return the result
   * @param data
   */
  async registerUser(data: CreateUserInput) {
    const {
      authService,
      verificationService,
      notificationService,
    } = this.context;
    try {
      const { user, credentials } = await authService.register(data);

      const verification = await verificationService.createCode(
        user,
        "email_verification"
      );
      notificationService.sendEmail(
        [user.emailAddress],
        "Email Verification",
        verification.code
      );
      return credentials;
    } catch (e) {
      return e;
    }
  }

  /**
   * Clears the credentials for this user
   */
  async logoutUser() {
    try {
      const { authService } = this.context;
      return await authService.logout();
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
      return await authService.refreshAccessToken();
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
   * Sends an OTP to the user's email address
   * @param email
   */
  async forgotPassword(identifier: string) {
    const {
      verificationService,
      notificationService,
      userService,
    } = this.context;
    try {
      const userObj = await userService.getByEmail(identifier);
      const verification = await verificationService.createCode(
        userObj,
        "forgot_password"
      );

      notificationService.sendEmail(
        [userObj.emailAddress],
        "Forgot Password",
        verification.code
      );

      return "A one time password has been sent to your email address.";
    } catch (e) {
      return e;
    }
  }

  /**
   * Logs a user in with an OTP
   * @param code
   */
  async loginOTP(code: string) {
    const { verificationService, authService } = this.context;
    try {
      const verification = await verificationService.otp(code);
      await verification.populate("user").execPopulate();

      // @ts-ignore
      return await authService.authenticateOTP(verification.user);
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their email address
   * @param code
   */
  async verifyEmail(code: string) {
    const { user, verificationService, authService } = this.context;
    try {
      await verificationService.email(user.id, code);
      return await authService.verifyEmail(user.id, !user.verified);
    } catch (e) {
      return e;
    }
  }

  /**
   * Verifies a user's identity with the code
   * that was sent to their phone number
   * @param code
   */
  async verifyPhone(code: string) {
    const { user, verificationService, authService } = this.context;
    try {
      await verificationService.phone(user.id, code);
      return await authService.verifyPhone(user.id, !user.verified);
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
