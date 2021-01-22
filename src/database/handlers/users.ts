/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";
import moment from "moment";

import GraphDB from "..";

import BaseHandler from "./base";

import { labels, relationships, IRawProfile, IUserProfile } from "../constants";
import { ResourceNotFoundError } from "../errors";

const {
  statics: __,
  order: { desc },
} = gremlin.process;

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
   * Finds a user's followers
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async findFollowers(id: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .inE(relationships.FOLLOWING)
      .order()
      .by("timestamp", desc)
      .outV()
      .hasNot("deactivated")
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((profile: any) => {
      profile = Object.fromEntries(profile);
      return this.transform(profile);
    });
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
      .hasNot("deactivated")
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
      .hasNot("deactivated")
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
      .hasNot("deactivated")
      .hasLabel(labels.USER_PROFILE)
      .property("coverImageURL", imageKey)
      .property("updated", moment().valueOf())
      .next();

    if (!result.value) throw new ResourceNotFoundError();
  }

  /**
   * Follows a user with the given ID
   * @param {string} currentUser
   * @param {string} id
   */
  async followProfile(currentUser: string, id: string) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasNot("deactivated")
      .hasLabel(labels.USER_PROFILE)
      .as("profile")
      .addE(relationships.FOLLOWING)
      .property("timestamp", moment().valueOf())
      .as("status")
      .from_(currentUser)
      .to("profile")
      .select("status")
      .values("timestamp")
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    return { timestamp: moment(result.value).toDate() };
  }

  /**
   * Follows a user with the given ID
   * @param {string} currentUser
   * @param {string} id
   */
  async unfollowProfile(currentUser: string, id: string) {
    const query = this.graph.query();

    await query
      .V(id)
      .hasLabel(labels.USER_PROFILE)
      .hasNot("deactivated")
      .as("profile")
      .inE(relationships.FOLLOWING)
      .as("status")
      .outV()
      .hasId(currentUser)
      .select("status")
      .drop()
      .next();
  }

  /**
   * Fetches all following statuses to user's with an
   * ID in the given list
   * @param {string[]} ids
   * @param {string} user
   */
  async loadFollowingStatuses(ids: string[], user: string) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .hasNot("deactivated")
      .as("profile")
      .local(
        __.outE(relationships.FOLLOWING)
          .as("rel")
          .inV()
          .hasId(user)
          .select("profile", "rel")
          .by(__.id())
          .by(__.values("timestamp"))
          .fold()
      )
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const statuses: any = Object.fromEntries(result.value);

    return statuses.map((status: any) => ({
      ...status,
      rel: {
        ...status.rel,
        timestamp: moment(status.rel.timestamp).toDate(),
      },
    }));
  }

  /**
   * Load reply counts
   * @param {string} ids
   */
  async loadFollowerCounts(ids: string[]) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .hasNot("deactivated")
      .group()
      .by(__.id())
      .by(__.in_(relationships.FOLLOWING).hasNot("deactivated").count())
      .next();

    return Object.fromEntries(result.value);
  }

  /**
   * Fetches all user profiles in the list of ID's
   * @param {string[]} ids
   */
  async loadFromIds(ids: string[]) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .hasNot("deactivated")
      .elementMap()
      .fold()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    return result.value.map((item: any) => {
      const record: any = Object.fromEntries(item);
      return this.transform(record);
    });
  }
}
