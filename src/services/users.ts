/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import BaseService, { IBaseConfig } from "./base";

import UserModel, { IUserModel } from "./models/user";

interface IUpdateUserInput {
  name?: string;
  summary?: string;
  location?: string;
  email?: string;
  phoneNumber?: string;
}
export class UserService extends BaseService {
  private model: IUserModel;

  constructor(baseConfig: IBaseConfig) {
    super(baseConfig);
    this.model = UserModel;
  }

  /**
   * Returns a single user given the id
   * @param id
   */
  async getById(id: string) {
    try {
      return await this.model.findById(id);
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Returns a single user's profile given the id
   * @param id
   */
  async getProfileById(id: string) {
    try {
      const { profile } = await this.model.findById(id, "profile");

      return profile;
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Returns a single user by email
   * @param email
   */
  async getByEmail(email: string) {
    try {
      return await this.model.findOne({ "email.address": email });
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Returns a single user by phone number
   * @param phone
   */
  async getByPhone(phone: string) {
    try {
      return await this.model.findOne({ "phone.number": phone });
    } catch {
      throw this.getDefaultError();
    }
  }

  /**
   * Updates and returns the user
   * @param id
   * @param data
   */
  async update(id: string, data: IUpdateUserInput) {
    try {
      const { email, phoneNumber, name, summary, location } = data;
      const user = await this.model.findById(id);

      /**
       * We want to update the values in memory
       * to preserve the mongoose validation behavior
       */

      user.email.address = email || user.emailAddress;
      user.phone.number = phoneNumber || user.phoneNumber;
      user.profile.name = name || user.profile.name;
      user.profile.summary = summary || user.profile.summary;
      user.profile.location = location || user.profile.location;

      const emailChanged = user.isModified("email.address");
      const phoneChanged = user.isModified("phone.number");

      await user.save();

      return { user, emailChanged, phoneChanged };
    } catch (e) {
      this.handleMutationError(e);
    }
  }
}
