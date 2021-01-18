/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import BaseService, { ServiceError } from "./base";

import * as logging from "../logging";

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
      if (e.name === "NOTFOUND") this.throwNotFound();
      else {
        logging.logError(`services.profiles.getById: ${e}`);
        this.throwServerError();
      }
    }
  }
}
