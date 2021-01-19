/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uid } from "rand-token";

import { ServiceError, ValidationError } from "./errors";

import { AuthHandler, IUserAccount, IDeviceArgs } from "../db";

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
}

/**
 * Authentication service (register, login, etc.)
 * @param {IAuthConfig} config
 * @param {any} dbHandler
 */
export class AuthService {
  private config: IAuthConfig;
  private dbHandler: AuthHandler;

  constructor(config: IAuthConfig, dbHandler: any) {
    this.config = config;
    this.dbHandler = dbHandler;
  }

  /**
   * Returns a default login error response
   */
  private throwDefaultAuthenticationError() {
    throw new ValidationError(
      "We couldn't log you in with the provided credentials",
      ["identifier", "password"]
    );
  }

  /**
   * Signs a JWT for the provided user
   * @param {string} id
   * @param {boolean} verified
   */
  protected signToken = (user: IUserAccount) =>
    new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id: user.id, profile: user.profile, verified: user.verified },
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
   * Returns true if valid, else false
   * @param {string} email
   */
  private async validateEmail(email: string) {
    email = email.trim();

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) {
      const isUnique = await this.dbHandler.isUniqueEmail(email);

      if (!isUnique)
        throw new ValidationError("This email address is already in use.", [
          "email",
        ]);

      return email;
    } else {
      throw new ValidationError("Enter a valid email address.", ["email"]);
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
        throw new ValidationError("This phone number is already in use.", [
          "phone",
        ]);

      return phoneNumber;
    } else {
      throw new ValidationError("Enter a valid phone number.", ["phone"]);
    }
  }

  /**
   * Validates the provided passwords and
   * returns the hashed result
   * @param {string} password
   * @param {string} confirmPassword
   */
  private async validatePassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword)
      throw new ValidationError("Your passwords must match.", [
        "password",
        "confirmPassword",
      ]);
    if (password.length < 8)
      throw new ValidationError("Passwords must be longer than 8 characters.", [
        "password",
        "confirmPassword",
      ]);

    return await bcrypt.hash(password, 10);
  }

  /**
   * Signs and returns a JWT, and generates a refresh token
   * to be stored in an HTTP only cookie
   * @param {IUserAccount} user
   */
  private async getCredentials(user: IUserAccount) {
    return {
      refreshToken: uid(256),
      accessToken: await this.signToken(user),
    };
  }

  /**
   * Authenticates a user and returns a signed JWT
   * @param {IUserAccount} user
   * @param {string} password
   * @param {IDeviceArgs} device
   */
  private async authenticate(
    user: IUserAccount,
    password: string,
    device: IDeviceArgs
  ) {
    if (await bcrypt.compare(password, user.password)) {
      return this.authenticationSuccess(user, device);
    } else this.throwDefaultAuthenticationError();
  }

  /**
   * Retrieve credentials and update the device auth status
   * in the graph.
   * @param {IUserAccount} user
   * @param {IDeviceArgs} device
   */
  private async authenticationSuccess(user: IUserAccount, device: IDeviceArgs) {
    const credentials = await this.getCredentials(user);

    await this.dbHandler.deviceLogin(user.id, credentials.refreshToken, device);

    // TODO alert user if a new device was created (available from deviceLogin)

    return credentials;
  }

  /**
   * Get a user by their ID
   * @param {string} id
   */
  async getUser(id: string) {
    return await this.dbHandler.findUserByID(id);
  }

  /**
   * Creates a new user and returns a signed JWT
   * @param {IRegisterArgs} data
   * @param {IDeviceArgs} device
   */
  async register(data: IRegisterArgs, device: IDeviceArgs) {
    const { email, password, confirmPassword } = data;

    const result = await this.dbHandler.createUser({
      email: await this.validateEmail(email),
      password: await this.validatePassword(password, confirmPassword),
    });

    return {
      ...result,
      credentials: await this.authenticationSuccess(result.user, device),
    };
  }

  /**
   * Logs in a user and returns a signed JWT
   * @param {ILoginInput} data
   * @param {IDeviceArgs} device
   */
  async login(data: ILoginInput, device: IDeviceArgs) {
    const user = await this.dbHandler.findUserByAttribute(data.identifier);

    if (user.suspended)
      throw new ServiceError("Your account has been suspended.");

    return await this.authenticate(user, data.password, device);
  }

  /**
   * Refresh a user's access token, and update authentication statuses
   * @param {string} deviceId
   * @param {string} token
   */
  async refreshToken(deviceId: string, token: string) {
    const user = await this.dbHandler.findUserByAuthStatus(deviceId, token);

    if (user.suspended)
      throw new ServiceError("Your account has been suspended.");

    const credentials = await this.getCredentials(user);

    await this.dbHandler.updateAuthStatus(
      deviceId,
      user.id,
      credentials.refreshToken
    );

    return credentials;
  }

  /**
   * Clears all credentials
   * @param {string} user
   * @param {string} device
   */
  async logout(user: string, device: string) {
    await this.dbHandler.deviceLogout(user, device);
    return "Successfully logged out.";
  }

  /**
   * Updates a user's email address
   * @param {string} userId
   * @param {string} email
   */
  async updateEmail(user: string, email: string) {
    email = await this.validateEmail(email);
    return await this.dbHandler.updateEmail(user, email);
  }

  /**
   * Updates a user's phone number
   * @param {string} userId
   * @param {string} phone
   */
  async updatePhone(user: string, phone: string) {
    phone = await this.validatePhone(phone);
    return await this.dbHandler.updatePhone(user, phone);
  }

  /**
   * Resets a user's password
   * @param {string} user
   * @param {IPasswordResetInput} data
   */
  async resetPassword(user: string, data: IPasswordResetInput) {
    const password = await this.validatePassword(
      data.password,
      data.confirmPassword
    );

    await this.dbHandler.resetPassword(user, password);
  }

  /**
   * Verifies a user's email
   * @param {string} userId
   * @param {string} code
   * @param {boolean} reauthenticate
   */
  async verifyEmail(userId: string, code: string, reauthenticate: boolean) {
    const user = await this.dbHandler.verifyEmail(userId, code);

    if (reauthenticate) return { accessToken: await this.signToken(user) };
  }

  /**
   * Verifies a user's phone
   * @param {string} userId
   * @param {string} code
   * @param {boolean} reauthenticate
   */
  async verifyPhone(userId: string, code: string, reauthenticate: boolean) {
    const user = await this.dbHandler.verifyPhone(userId, code);

    if (reauthenticate) return { accessToken: await this.signToken(user) };
  }

  /**
   * Sets the user's deactivation date for 30
   * days in the future
   * @param {string} user
   */
  async deactivateAccount(user: string) {
    await this.dbHandler.deactivateAccount(user);
    return "Account deactivated.";
  }
}
