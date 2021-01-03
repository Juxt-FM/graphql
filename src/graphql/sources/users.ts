/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";

import { IContext } from "../server";
import { UpdateUserInput } from "../types";

export class UserAPI extends DataSource {
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
    const { user, userService } = this.context;
    try {
      return await userService.getById(user.id);
    } catch (e) {
      return e;
    }
  }

  /**
   * Returns a user's profile
   */
  async getUserProfile(id: string) {
    const { userService } = this.context;
    try {
      return await userService.getProfileById(id);
    } catch (e) {
      return e;
    }
  }

  /**
   * Update the logged in user and return result
   * @param data
   */
  async updateUser(data: UpdateUserInput) {
    const {
      user,
      userService,
      verificationService,
      notificationService,
    } = this.context;
    try {
      const {
        user: obj,
        emailChanged,
        phoneChanged,
      } = await userService.update(user.id, data);

      if (emailChanged) {
        const verification = await verificationService.createCode(
          obj,
          "email_verification"
        );
        notificationService.sendEmail(
          [obj.emailAddress],
          "Your email verification code",
          verification.code
        );
      }

      if (phoneChanged) {
        const verification = await verificationService.createCode(
          obj,
          "phone_verification"
        );
        notificationService.sendSMS(
          [obj.phoneNumber],
          `Your verification code: ${verification.code}`
        );
      }

      return obj;
    } catch (e) {
      return e;
    }
  }
}
