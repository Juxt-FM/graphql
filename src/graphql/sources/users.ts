/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import { ProfileInput } from "../types";

export class UserAPI extends BaseAPI {
  constructor() {
    super();
  }

  /**
   * Returns a user's profile given it's ID
   * @param {string} id
   */
  async getProfileByID(id: string) {
    return this.handler("getProfileByID", async () => {
      const { userService } = this.context;

      return await userService.getById(id);
    });
  }

  /**
   * Updates and returns the user's profile
   * @param {ProfileInput} data
   */
  async updateProfile(data: ProfileInput) {
    return this.handler("updateProfile", async () => {
      const { user, userService } = this.context;

      return await userService.updateProfile(user.profile, data);
    });
  }

  /**
   * Creates and returns a pre-signed AWS S3 url, updates
   * the user's profile in the db
   */
  async updateCoverImage() {
    return this.handler("updateCoverImage", async () => {
      const { user, mediaService, userService } = this.context;

      const result = await mediaService.getSignedCoverUpload(user.id);

      await userService.updateCoverImage(user.profile, result.fields.key);

      return JSON.stringify(result);
    });
  }

  /**
   * Creates and returns a pre-signed AWS S3 url, updates
   * the user's profile in the db
   */
  async updateProfileImage() {
    return this.handler("updateProfileImage", async () => {
      const { user, mediaService, userService } = this.context;

      const result = await mediaService.getSignedProfileUpload(user.id);

      await userService.updateProfileImage(user.profile, result.fields.key);

      return JSON.stringify(result);
    });
  }

  /**
   * Uses the service dataloader to batch profiles
   * @param {string} id
   */
  async loadProfile(id: string) {
    return this.handler("loadProfile", async () => {
      const { userService } = this.context;

      return await userService.loadProfile(id);
    });
  }
}
