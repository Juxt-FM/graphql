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
   * @param {string} filename
   */
  async updateCoverImage(filename: string) {
    return this.handler("updateCoverImage", async () => {
      const { user, media, userService } = this.context;

      const bucket = media.buckets.coverImages;

      return await userService.updateCoverImage(user.profile, bucket, filename);
    });
  }

  /**
   * Creates and returns a pre-signed AWS S3 url, updates
   * the user's profile in the db
   * @param {string} filename
   */
  async updateProfileImage(filename: string) {
    return this.handler("updateProfileImage", async () => {
      const { user, media, userService } = this.context;

      const bucket = media.buckets.profileImages;

      return await userService.updateProfileImage(
        user.profile,
        bucket,
        filename
      );
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
