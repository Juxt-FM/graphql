/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { UserHandler } from "../db";

/**
 * Profile service (post authors, public profiles, etc.)
 * @param {UserHandler} dbHandler
 */
export class UserService {
  private dbHandler: UserHandler;

  constructor(dbHandler: UserHandler) {
    this.dbHandler = dbHandler;
  }

  /**
   * Get a user profile by ID
   * @param {string} id
   */
  async getById(id: string) {
    return await this.dbHandler.findById(id);
  }
}
