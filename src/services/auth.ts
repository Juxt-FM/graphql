/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { UserInputError } from "apollo-server-express";
import neo4j from "neo4j-driver";
import bcrypt from "bcrypt";

import { IBaseConfig } from "./base";
import TokenService, { ITokenConfig } from "./token";

import UserModel, { IUserDocument, IUserModel } from "./models/user";
import { Driver } from "neo4j-driver";

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
  private driver: Driver;

  constructor(
    tokenConfig: ITokenConfig,
    baseConfig: IBaseConfig,
    driver: Driver
  ) {
    super(tokenConfig, baseConfig);
    this.userModel = UserModel;
    this.driver = driver;
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
      const { name, email, phoneNumber, ...args } = data;

      if (!(email || phoneNumber)) throw Error();

      const session = this.driver.session({
        database: "foo",
        defaultAccessMode: neo4j.session.WRITE,
      });

      const password = await this.validatePassword(
        args.password,
        args.confirmPassword
      );

      const emailStatement = `
      CREATE (e:EmailAddress {emailAddress: $email}) 
      SET e.createdAt = now, e.updatedAt = now 
      CREATE (e)<-[:HAS_ATTRIBUTE]-(u) 
      `;

      const phoneStatement = `
      CREATE (p:PhoneNumber {phoneNumber: $phoneNumber}) 
      SET e.createdAt = now, e.updatedAt = now 
      CREATE (p)<-[:HAS_ATTRIBUTE]-(u) 
      `;

      const query = `
      WITH datetime({timezone: 'America/New_York'}) as now 
      CREATE (u:User {id: apoc.create.uuid()}) 
      SET u.password = $password, u.lastLogin = now, u.createdAt = now, u.updatedAt = now 
      WITH u, now 
      ${email ? emailStatement : ""}
      ${phoneNumber ? phoneStatement : ""}
      RETURN u AS user, p AS phoneNumber, e AS email
      `;

      return session
        .run(query, { password, email, phoneNumber })
        .then(({ records }) => {
          const user = records[0];

          return { user, credentials: await this.getCredentials(user) };
        })
        .catch(() => {});
    } catch (e) {
      throw this.getDefaultError();
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
