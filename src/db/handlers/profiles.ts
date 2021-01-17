/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import GraphDB from "..";

/**
 * Database user profile handler.
 * @param {GraphDB} graph
 */
export class ProfileHandler {
  private graph: GraphDB;

  constructor(graph: GraphDB) {
    this.graph = graph;
  }

  /**
   * Fetches a user with the given ID
   * @param {string} id
   */
  async findById(id: string) {
    const query = this.graph.query();

    const result = await query.V(id).elementMap().next();

    const profile: any = Object.fromEntries(result.value);

    return profile;
  }
}
