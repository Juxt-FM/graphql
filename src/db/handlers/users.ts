/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import moment from "moment";

import GraphDB from "..";

import BaseHandler from "./base";

import { IRawProfile, IUserProfile, labels } from "../constants";
import { ResourceNotFoundError } from "../errors";

export interface IProfileInput {
  name?: string;
  summary?: string;
  location?: string;
}

/**
 * User profile database handler.
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
   * Update's a user's profile
   * @param {string} id
   * @param {IProfileInput} data
   */
  async updateProfile(id: string, data: IProfileInput) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.USER_PROFILE)
      .property("name", data.name || "")
      .property("summary", data.summary || "")
      .property("location", data.location || "")
      .property("updated", moment().valueOf())
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const profile: any = Object.fromEntries(result.value);

    return this.transform(profile);
  }

  /**
   * Update the user's profile image
   * @param {string} id
   * @param {string} imageKey
   */
  async updateProfileImage(id: string, imageKey: string) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.USER_PROFILE)
      .property("profileImageURL", imageKey)
      .property("updated", moment().valueOf())
      .next();

    if (!result.value) throw new ResourceNotFoundError();
  }

  /**
   * Update the user's cover image
   * @param {string} id
   * @param {string} imageKey
   */
  async updateCoverImage(id: string, imageKey: string) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.USER_PROFILE)
      .property("coverImageURL", imageKey)
      .property("updated", moment().valueOf())
      .next();

    if (!result.value) throw new ResourceNotFoundError();
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
