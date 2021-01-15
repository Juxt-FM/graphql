/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import neo4j, { Driver } from "neo4j-driver";

export interface IUserProfile {
  id: string;
  name?: string;
  location?: string;
  summary?: string;
  coverImageURL?: string;
  profileImageURL?: string;
  created: Date;
  updated: Date;
}

/**
 * Neo4j user profile handler.
 */
export default class ProfileHandler {
  private driver: Driver;
  private database: string;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Fetches a user with the given ID
   * @param id
   */
  async findById(id: string): Promise<IUserProfile> {
    const session = this.driver.session();

    try {
      const query = `
        MATCH (:User {id: $id})-[:HAS_PROFILE]->(p:Profile)
        RETURN p AS profile
        `;

      const { records } = await session.run(query, { id });

      return records[0].get("profile").properties;
    } catch (e) {
      console.log(`DB error finding user by id: ${e}`);
      throw e;
    }
  }
}
