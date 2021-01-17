/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError, UserInputError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uid } from "rand-token";

import BaseService, { IBaseConfig } from "./base";
import { AuthHandler, IUser, IUserDevice } from "../db";

interface IRegisterArgs {
  email: string;
  phoneNumber?: string;
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

interface IAuthConfig {
  jwtKey: string;
  jwtAudience: string;
  jwtIssuer: string;
  jwtSubject: string;
  jwtExpiration: string;
  refreshCookie: string;
}

/**
 * Authentication service (register, login, etc.)
 * @param {IAuthConfig} config
 * @param {IBaseConfig} baseConfig
 * @param {any} dbHandler
 */
export class AuthService extends BaseService {
  private config: IAuthConfig;
  private dbHandler: AuthHandler;

  constructor(config: IAuthConfig, baseConfig: IBaseConfig, dbHandler: any) {
    super(baseConfig);

    this.config = config;
    this.dbHandler = dbHandler;
  }

  /**
   * Returns a default login error response
   */
  private getDefaultAuthenticationError() {
    return new UserInputError(
      "We couldn't log you in with the provided credentials",
      { invalidArgs: ["identifier", "password"] }
    );
  }

  /**
   * Signs a JWT for the provided user
   * @param {string} id
   * @param {boolean} verified
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
   * Signs and returns a JWT, and generates a refresh token
   * to be stored in an HTTP only cookie
   * @param {IUser} user
   */
  private async getCredentials(user: IUser) {
    return {
      refreshToken: uid(256),
      accessToken: await this.signToken(user.id, user.verified),
    };
  }

  /**
   * Hashes a user's password for safe
   * storage in database
   * @param {string} password
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
   * Returns true if valid, else false
   * @param {string} email
   */
  private async validateEmail(email: string) {
    email = email.trim();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      const isUnique = await this.dbHandler.isUniqueEmail(email);

      if (!isUnique)
        throw new UserInputError("This email address is already in use.", {
          invalidArgs: ["email"],
        });

      return email;
    } else {
      throw new UserInputError("Enter a valid email address.", {
        invalidArgs: ["email"],
      });
    }
  }

  /**
   * Returns true if valid, else false
   * @param {string} phoneNumber
   */
  private async validatePhone(phoneNumber: string) {
    phoneNumber = phoneNumber.trim();
    const re = /^\+[1-9]\d{10,14}$/;
    if (re.test(phoneNumber)) {
      const isUnique = await this.dbHandler.isUniquePhone(phoneNumber);

      if (!isUnique)
        throw new UserInputError("This phone number is already in use.", {
          invalidArgs: ["phone"],
        });

      return phoneNumber;
    } else {
      throw new UserInputError("Enter a valid phone number.", {
        invalidArgs: ["phone"],
      });
    }
  }

  /**
   * Validates the provided passwords and
   * returns the hashed result
   * @param {string} password
   * @param {string} confirmPassword
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
   * @param {IUser} user
   * @param {string} password
   * @param {IUserDevice} device
   */
  private async authenticate(
    user: IUser,
    password: string,
    device: IUserDevice
  ) {
    if (await bcrypt.compare(password, user.password)) {
      return this.authenticationSuccess(user, device);
    } else throw this.getDefaultAuthenticationError();
  }

  /**
   * Retrieve credentials and perform any necessary actions.
   * @param {IUser} user
   * @param {IUserDevice} device
   */
  private async authenticationSuccess(user: IUser, device: IUserDevice) {
    try {
      const credentials = await this.getCredentials(user);

      device.address = this.getHost();

      await this.dbHandler.deviceLogin(
        user.id,
        credentials.refreshToken,
        device
      );

      return credentials;
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error finalizing authentication: ${e}`);
        throw e;
      }
    }
  }

  /**
   * Get a user by their ID
   * @param {string} id
   */
  async getUser(id: string) {
    try {
      return await this.dbHandler.findUserByID(id);
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log("Server error while getting user: ${e}");
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Creates a new user and returns a signed JWT
   * @param {IRegisterArgs} data
   * @param {IUserDevice} device
   */
  async register(data: IRegisterArgs, device: IUserDevice) {
    try {
      let { email, password, confirmPassword } = data;

      const result = await this.dbHandler.createUser({
        email: await this.validateEmail(email),
        password: await this.validatePassword(password, confirmPassword),
      });

      return {
        ...result,
        credentials: await this.authenticationSuccess(result.user, device),
      };
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during registration: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Logs in a user and returns a signed JWT
   * @param {ILoginInput} data
   * @param {IUserDevice} device
   */
  async login(data: ILoginInput, device: IUserDevice) {
    try {
      const user = await this.dbHandler.findUserByAttribute(data.identifier);

      if (user.suspended)
        throw new ApolloError("Your account has been suspended.");

      return await this.authenticate(user, data.password, device);
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during login: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Clears all credentials
   * @param {string} user
   * @param {string} device
   */
  async logout(user: string, device: string) {
    try {
      await this.dbHandler.deviceLogout(user, device);
      return "Successfully logged out.";
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during logout: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Resets a user's password
   * @param {string} user
   * @param {IPasswordResetInput} data
   */
  async resetPassword(user: string, data: IPasswordResetInput) {
    try {
      const password = await this.validatePassword(
        data.password,
        data.confirmPassword
      );

      await this.dbHandler.resetPassword(user, password);
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during password reset: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Verifies a user's email
   * @param {string} userId
   * @param {string} code
   * @param {boolean} reauthenticate
   */
  async verifyEmail(userId: string, code: string, reauthenticate: boolean) {
    try {
      const user = await this.dbHandler.verifyEmail(userId, code);

      if (reauthenticate)
        return { accessToken: this.signToken(user.id, Boolean(user.verified)) };
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else if (e.name === "INVALIDCODE") throw new ApolloError("Invalid code.");
      else {
        console.log(`Server error during password reset: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Verifies a user's phone
   * @param {string} userId
   * @param {string} code
   * @param {boolean} reauthenticate
   */
  async verifyPhone(userId: string, code: string, reauthenticate: boolean) {
    try {
      const user = await this.dbHandler.verifyPhone(userId, code);

      if (reauthenticate)
        return { accessToken: this.signToken(user.id, Boolean(user.verified)) };
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during password reset: ${e}`);
        throw this.getDefaultError();
      }
    }
  }

  /**
   * Sets the user's deactivation date for 30
   * days in the future
   * @param {string} user
   */
  async deactivateAccount(user: string) {
    try {
      await this.dbHandler.deactivateAccount(user);
      return "Account deactivated.";
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else {
        console.log(`Server error during password reset: ${e}`);
        throw this.getDefaultError();
      }
    }
  }
}
