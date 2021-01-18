/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import GraphDB from "..";

import BaseHandler from "./base";

import { ResourceNotFoundError } from "../errors";

/**
 * Database user profile handler.
 * @param {GraphDB} graph
 */
export class UserHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);
  }

  /**
   * Fetches a user with the given ID
   * @param {string} id
   */
  async findById(id: string) {
    const query = this.graph.query();

    const result = await query.V(id).elementMap().next();

    if (!result.value) throw new ResourceNotFoundError();

    const profile: any = Object.fromEntries(result.value);

    return profile;
  }
}
