/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { UserInputError } from "apollo-server-express";
import { Driver } from "neo4j-driver";
import bcrypt from "bcrypt";

import { IBaseConfig } from "../base";
import TokenService, { ITokenConfig } from "./token";
import AuthHandler, { IUser, IUserDevice } from "./handler";

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

/**
 * The auth service is where all the different
 * methods are called from (registration, login, etc.)
 *
 * It extends the token service to access protected
 * methods and also exposes the method to refresh
 * a user's token
 */
export class AuthService extends TokenService {
  private dbHandler: AuthHandler;

  constructor(
    tokenConfig: ITokenConfig,
    baseConfig: IBaseConfig,
    driver: Driver
  ) {
    super(tokenConfig, baseConfig);

    this.dbHandler = new AuthHandler(driver);
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
   * Returns true if valid, else false
   * @param email
   */
  private validateEmail(email: string) {
    email = email.trim();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      return email;
    } else {
      throw new UserInputError("Enter a valid email address.", {
        invalidArgs: ["email"],
      });
    }
  }

  /**
   * Returns true if valid, else false
   * @param phoneNumber
   */
  private validatePhone(phoneNumber: string) {
    phoneNumber = phoneNumber.trim();
    const re = /^\+[1-9]\d{10,14}$/;
    if (re.test(phoneNumber)) {
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
   * Retrieve credentials and perform any necessary actions.
   * @param user
   * @param device
   */
  private async authenticationSuccess(user: IUser, device: IUserDevice) {
    try {
      const credentials = await this.getCredentials(user, device.platform);

      device.token = credentials.refreshToken;
      device.ipAddr = this.getHost();

      await this.dbHandler.deviceLogin(device, user.id);

      return credentials;
    } catch (e) {
      console.log(`Error finalizing authentication: ${e}`);
      throw e;
    }
  }

  /**
   * Authenticates a user and returns a signed JWT
   * @param user
   * @param password
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
   * Creates a new user and returns a signed JWT
   * @param data
   * @param device
   */
  async register(data: IRegisterArgs, device: IUserDevice) {
    try {
      let { email, phoneNumber, password, confirmPassword } = data;

      const params = {
        email: this.validateEmail(email),
        phoneNumber: this.validatePhone(phoneNumber),
        password: await this.validatePassword(password, confirmPassword),
      };

      const result = await this.dbHandler.createUser(params);

      return {
        ...result,
        credentials: await this.authenticationSuccess(result.user, device),
      };
    } catch (e) {
      console.log("Error during registration: ${e}");
      throw this.getDefaultError();
    }
  }

  /**
   * Logs in a user and returns a signed JWT
   * @param data
   */
  async login(data: ILoginInput, device: IUserDevice) {
    try {
      const user = await this.dbHandler.findUserByIdentifier(data.identifier);

      return await this.authenticate(user, data.password, device);
    } catch (e) {
      console.log("Error during registration: ${e}");
      throw this.getDefaultError();
    }
  }

  /**
   * Authenticates a user and returns a signed JWT
   * @param user
   */
  async authenticateOTP() {}

  /**
   * Clears all credentials
   */
  async logout(user: string, device: IUserDevice) {
    try {
      if (device.platform === "web") this.clearRefreshCookie();

      await this.dbHandler.deviceLogout(user, device.id);
    } catch (e) {
      console.log("Error during registration: ${e}");
      throw this.getDefaultError();
    }
  }

  /**
   * Resets a user's password
   * @param userId
   * @param data
   */
  async resetPassword(userId: string, data: IPasswordResetInput) {}

  /**
   * Verifies a user's email
   * @param id
   * @param shouldReAuthenticate
   */
  async verifyEmail(id: string, shouldReAuthenticate: boolean) {}

  /**
   * Verifies a user's phone
   * @param id
   * @param shouldReAuthenticate
   */
  async verifyPhone(id: string, shouldReAuthenticate: boolean) {}

  /**
   * Sets the user's deactivation date for 30
   * days in the future
   */
  async deactivateAccount(userId: string) {}
}
