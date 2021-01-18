/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";
import { ApolloError, UserInputError } from "apollo-server-express";
import { ServiceError } from "../../services/base";

import * as logging from "../../logging";

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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.getCurrentUser: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.loginUser: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.registerUser: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.updateEmail: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
        [result.user.phone],
        `Your JUXT verification code: ${result.code}`
      );

      return result.user;
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.updatePhone: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.logoutUser: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.refreshToken: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.resetPassword: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.verifyEmail: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        if (e.name === "bad_input")
          return new UserInputError(e.message, { invalidArgs: e.invalidArgs });
        else return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.verifyPhone: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
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
      if (e instanceof ServiceError) {
        return new ApolloError(e.message);
      } else {
        logging.logError(`graphql.sources.auth.deactivateAccount: ${e}`);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }
}
