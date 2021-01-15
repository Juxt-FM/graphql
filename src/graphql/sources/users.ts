/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { DataSource, DataSourceConfig } from "apollo-datasource";

import { IContext } from "../server";

export class UserAPI extends DataSource {
  context: IContext;

  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;
  }

  /**
   * Returns a user's profile
   */
  async getUserProfile(id: string) {
    const { profileService } = this.context;
    try {
      return await profileService.getById(id);
    } catch (e) {
      return e;
    }
  }
}
