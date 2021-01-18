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
   * Returns a user's profile
   */
  async getUserProfile(id: string) {
    return this.handler("getUserProfile", async () => {
      const { userService } = this.context;

      return await userService.getById(id);
    });
  }
}
