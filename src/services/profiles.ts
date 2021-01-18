/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ProfileHandler } from "../db";

/**
 * Profile service (post authors, public profiles, etc.)
 * @param {ProfileHandler} dbHandler
 */
export class ProfileService {
  private dbHandler: ProfileHandler;

  constructor(dbHandler: ProfileHandler) {
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
