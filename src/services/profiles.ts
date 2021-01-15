/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { Driver } from "neo4j-driver";

import BaseService, { IBaseConfig } from "./base";
import ProfileHandler from "./db/profiles";

export class ProfileService extends BaseService {
  private dbHandler: ProfileHandler;

  constructor(baseConfig: IBaseConfig, driver: Driver) {
    super(baseConfig);

    this.dbHandler = new ProfileHandler(driver);
  }

  /**
   * Get a user profile by ID
   * @param id
   */
  async getById(id: string) {
    try {
      return await this.dbHandler.findById(id);
    } catch (e) {
      console.log(`Error getting user profile: ${e}`);
    }
  }
}
