/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import DataLoader from "dataloader";
import _ from "lodash";

import { UserHandler, IProfileInput } from "../database";

/**
 * User service (post authors, public profiles, etc.)
 * @param {UserHandler} dbHandler
 */
export class UserService {
  private dbHandler: UserHandler;
  private profileLoader: DataLoader<any, any, any>;
  private followStatusLoader: DataLoader<any, any, any>;

  constructor(dbHandler: UserHandler) {
    this.dbHandler = dbHandler;
    this.profileLoader = this.buildProfileLoader();

    this.buildFollowStatusLoader = this.buildFollowStatusLoader.bind(this);
  }

  /**
   * Loads the user's following statuses for a list of profile ID's
   * @param {string} user
   */
  buildFollowStatusLoader(user: string) {
    this.followStatusLoader = new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadFollowingStatuses(ids, user);

      const statuses = _.keyBy(result, "profile");

      return ids.map((id) => (statuses[id] ? statuses[id].rel : null));
    });
  }

  private buildProfileLoader() {
    return new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadFromIds(ids);
      const profiles = _.keyBy(result, "id");

      return ids.map((id) => profiles[id] || null);
    });
  }

  /**
   * Get a user profile by ID
   * @param {string} id
   */
  async getById(id: string) {
    return await this.dbHandler.findById(id);
  }

  /**
   * Follows a profile with the given ID
   * @param {string} user
   * @param {string} id
   */
  async followProfile(user: string, id: string) {
    return await this.dbHandler.followProfile(user, id);
  }

  /**
   * Unfollows a profile with the given ID
   * @param {string} user
   * @param {string} id
   */
  async unfollowProfile(user: string, id: string) {
    await this.dbHandler.unfollowProfile(user, id);
    return "Successfully unfollowed profile.";
  }

  /**
   * Update the user's profile
   * @param {string} id
   * @param {IProfileInput} data
   */
  async updateProfile(id: string, data: IProfileInput) {
    return await this.dbHandler.updateProfile(id, data);
  }

  /**
   * Update the user's profile image
   * @param {string} id
   * @param {string} key
   */
  async updateProfileImage(id: string, key: string) {
    await this.dbHandler.updateProfileImage(id, key);
  }

  /**
   * Update the user's profile cover image
   * @param {string} id
   * @param {string} key
   */
  async updateCoverImage(id: string, key: string) {
    await this.dbHandler.updateCoverImage(id, key);
  }

  /**
   * Loads a profile ID into the status loader
   * @param {string} id
   */
  async loadFollowStatus(id: string) {
    return await this.followStatusLoader.load(id);
  }

  /**
   * Sends a new ID to the user loader
   * @param {string} id
   */
  async loadProfile(id: string) {
    return await this.profileLoader.load(id);
  }
}
