/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ProfileInput } from "../types";
import { BaseAPI } from "./base";

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
