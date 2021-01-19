/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

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
