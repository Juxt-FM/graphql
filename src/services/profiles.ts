/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import BaseService from "./base";

import { ProfileHandler } from "../db";

/**
 * Profile service (post authors, public profiles, etc.)
 * @param {ProfileHandler} dbHandler
 */
export class ProfileService extends BaseService {
  private dbHandler: ProfileHandler;

  constructor(dbHandler: ProfileHandler) {
    super();

    this.dbHandler = dbHandler;
  }

  /**
   * Get a user profile by ID
   * @param {string} id
   */
  async getById(id: string) {
    try {
      return await this.dbHandler.findById(id);
    } catch (e) {
      console.log(`Error getting user profile: ${e}`);
    }
  }
}
