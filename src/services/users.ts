/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import DataLoader from "dataloader";
import _ from "lodash";

import { UserHandler, IProfileInput } from "../db";

/**
 * User service (post authors, public profiles, etc.)
 * @param {UserHandler} dbHandler
 */
export class UserService {
  private dbHandler: UserHandler;
  private profileLoader: DataLoader<any, any, any>;

  constructor(dbHandler: UserHandler) {
    this.dbHandler = dbHandler;

    this.profileLoader = this.buildProfileLoader();
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
   * Update the user's profile
   * @param {string} id
   * @param {IProfileInput} data
   */
  async updateProfile(id: string, data: IProfileInput) {
    return await this.dbHandler.updateProfile(id, data);
  }

  /**
   * Sends a new ID to the user loader
   * @param {string} id
   */
  async loadProfile(id: string) {
    return await this.profileLoader.load(id);
  }
}
