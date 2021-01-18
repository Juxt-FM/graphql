/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import GraphDB from "..";

import BaseHandler from "./base";

import { labels, IRawProfile, IUserProfile } from "../constants";
import { ResourceNotFoundError } from "../errors";

/**
 * Database user profile handler.
 * @param {GraphDB} graph
 */
export class UserHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);

    this.transform = this.transform.bind(this);
  }

  private transform(profile: IRawProfile): IUserProfile {
    return {
      ...profile,
      created: this.toDate(profile.created),
      updated: this.toDate(profile.updated),
    };
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

    return this.transform(profile);
  }

  /**
   * Fetches a user with the given ID
   * @param {string} id
   */
  async findByAccountId(id: string) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .outE(labels.UserProfile)
      .inV()
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const profile: any = Object.fromEntries(result.value);

    return this.transform(profile);
  }

  /**
   * Fetches all user profiles in the list of ID's
   * @param {string[]} ids
   */
  async loadFromIds(ids: string[]) {
    const result = await this.loadVFromIds(ids);

    if (!result) throw new ResourceNotFoundError();

    const profiles: any = Object.fromEntries(result);

    return profiles.map(this.transform);
  }
}
