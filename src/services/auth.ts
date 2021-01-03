/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { UserInputError } from "apollo-server-express";
import { Error as MongooseError } from "mongoose";
import bcrypt from "bcrypt";
import _ from "lodash";

import { IBaseConfig } from "./base";
import TokenService, { ITokenConfig } from "./token";

import UserModel, { IUserDocument, IUserModel } from "./models/user";

interface IRegisterInput {
  email: string;
  phoneNumber?: string;
  name?: string;
  password: string;
  confirmPassword: string;
}

interface ILoginInput {
  identifier: string;
  password: string;
}

interface IPasswordResetInput {
  password: string;
  confirmPassword: string;
}

/**
 * The auth service is where all the different
 * methods are called from (registration, login, etc.)
 *
 * It extends the token service to access protected
 * methods and also exposes the method to refresh
 * a user's token
 */

export class AuthService extends TokenService {
  private userModel: IUserModel;

  constructor(tokenConfig: ITokenConfig, baseConfig: IBaseConfig) {
    super(tokenConfig, baseConfig);
    this.userModel = UserModel;
  }

  /**
   * Returns the default login error response
   */
  private getDefaultAuthenticationError() {
    return new UserInputError(
      "We couldn't log you in with the provided credentials",
      { invalidArgs: ["identifier", "password"] }
    );
  }

  /**
   * Hashes a user's password for safe
   * storage in database
   * @param password
   */
  private hashPassword(password: string) {
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, 10, (error, pass) => {
        if (error) reject(error);
        resolve(pass);
      });
    });
  }

  /**
   * Validates the provided passwords and
   * returns the hashed result
   * @param password
   * @param confirmPassword
   */
  private validatePassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword)
      throw new UserInputError("Your passwords must match.", {
        invalidArgs: ["password", "confirmPassword"],
      });
    if (password.length < 8)
      throw new UserInputError("Passwords must be longer than 8 characters.", {
        invalidArgs: ["password", "confirmPassword"],
      });
    return this.hashPassword(password);
  }

  /**
   * Authenticates a user and returns a signed JWT
   * @param user
   * @param password
   */
  private async authenticate(user: IUserDocument, password: string) {
    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (isAuthenticated) {
      try {
        user.lastLogin = new Date();
        await user.save();

        return this.getCredentials(user);
      } catch {
        throw this.getDefaultError();
      }
    } else throw this.getDefaultAuthenticationError();
  }

  /**
   * Authenticates a user and returns a signed JWT
   * @param user
   */
  async authenticateOTP(user: IUserDocument) {
    try {
      user.lastLogin = new Date();
      await user.save();

      return this.getCredentials(user);
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Creates a new user and returns a signed JWT
   * @param data
   */
  async register(data: IRegisterInput) {
    try {
      const { password, confirmPassword, name, email, phoneNumber } = data;

      const user = new this.userModel({
        email: {
          address: email,
        },
        phone: {
          number: phoneNumber,
        },
        profile: {
          name,
        },
        password: await this.validatePassword(password, confirmPassword),
      });

      await user.save();

      return { user, credentials: await this.getCredentials(user) };
    } catch (e) {
      this.handleMutationError(e);
    }
  }

  /**
   * Logs in a user and returns a signed JWT
   * @param data
   */
  async login(data: ILoginInput) {
    try {
      const { identifier, password } = data;
      const user = await this.userModel.findOne({
        $or: [{ "email.address": identifier }, { "phone.number": identifier }],
      });

      if (user) return await this.authenticate(user, password);
      else throw new Error();
    } catch (e) {
      throw this.getDefaultAuthenticationError();
    }
  }

  /**
   * Clears all credentials
   */
  async logout() {
    try {
      const refreshToken = await this.getRefreshToken();

      await this.revokeToken(refreshToken, undefined, "logout");
      this.clearCredentials();

      return "Successfully logged out.";
    } catch (e) {
      throw this.getDefaultError();
    }
  }

  /**
   * Resets a user's password
   * @param userId
   * @param data
   */
  async resetPassword(userId: string, data: IPasswordResetInput) {
    try {
      const { password, confirmPassword } = data;

      const user = await this.userModel.findById(userId);

      user.password = await this.validatePassword(password, confirmPassword);

      await user.save();

      return "Password changed.";
    } catch (e) {
      if (e instanceof MongooseError) throw this.getDefaultError();
      else throw e;
    }
  }

  /**
   * Verifies a user's email
   * @param id
   * @param shouldReAuthenticate
   */
  async verifyEmail(id: string, shouldReAuthenticate: boolean) {
    try {
      const user = await this.userModel.findById(id);
      user.email.verified = true;
      await user.save();

      if (shouldReAuthenticate)
        return { accessToken: await this.signToken(user) };

      return;
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Verifies a user's phone
   * @param id
   * @param shouldReAuthenticate
   */
  async verifyPhone(id: string, shouldReAuthenticate: boolean) {
    try {
      const user = await this.userModel.findById(id);
      user.phone.verified = true;
      await user.save();

      if (shouldReAuthenticate)
        return { accessToken: await this.signToken(user) };

      return;
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Sets the user's deactivation date for 30
   * days in the future
   */
  async deactivateAccount(userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      user.deactivated = true;
      user.deactivatedAt = new Date();
      await user.save();

      return this.logout();
    } catch {
      throw this.getDefaultError();
    }
  }
}
