/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import { ProfileInput } from "../types";
import { IContext } from "../server";
import { DataSourceConfig } from "apollo-datasource";

export class UserAPI extends BaseAPI {
  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;

    /**
     * For this service we need to manually
     * build the reaction dataloader, as it requires
     * the logged in user's ID
     */
    const { buildFollowStatusLoader } = this.context.userService;

    if (this.context.user) {
      buildFollowStatusLoader(this.context.user.profile);
    }
  }

  /**
   * Follow's a user's profile
   * @param {string} id
   */
  async follow(id: string) {
    return this.handler("follow", async () => {
      const { user, userService } = this.context;

      return await userService.followProfile(user.profile, id);
    });
  }

  /**
   * Unfollow's a user's profile
   * @param {string} id
   */
  async unfollow(id: string) {
    return this.handler("unfollow", async () => {
      const { user, userService } = this.context;

      return await userService.unfollowProfile(user.profile, id);
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
   * Returns the profile's follower count
   * @param {string} id
   */
  async loadFollowerCount(id: string) {
    return this.handler("loadProfile", async () => {
      const { userService } = this.context;

      return await userService.loadFollowerCount(id);
    });
  }

  /**
   * Returns the follow status for the logged in user to
   * another profile
   * @param {string} id
   */
  async loadFollowingStatus(id: string) {
    return this.handler("loadFollowingStatus", async () => {
      const { userService } = this.context;

      return await userService.loadFollowStatus(id);
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
