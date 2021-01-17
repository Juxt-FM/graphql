/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import BaseService, { IBaseConfig } from "./base";
import { ProfileHandler } from "../db";

export class ProfileService extends BaseService {
  private dbHandler: ProfileHandler;

  constructor(baseConfig: IBaseConfig, handler: ProfileHandler) {
    super(baseConfig);

    this.dbHandler = handler;
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
