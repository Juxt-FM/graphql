/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";
import moment from "moment";

import GraphDB from "..";

import {
  IRawUser,
  IUser,
  IUserDevice,
  labels,
  relationships,
} from "./constants";

const {
  t: { id },
} = gremlin.process;
const {
  cardinality: { single },
} = gremlin.process;

export interface ICreateUserArgs {
  email: string;
  password: string;
}

export interface ICreateUserResult {
  user: IUser;
  code: string;
}

/**
 * Database authentication handler.
 * @param {GraphDB} graph
 */
export class AuthHandler {
  private graph: GraphDB;

  constructor(graph: GraphDB) {
    this.graph = graph;
  }

  /**
   * Returns a formatted user object
   * @param {IRawUser} user
   */
  private transformUser(user: IRawUser): IUser {
    const toDate = (timestamp: number) => moment(timestamp).toDate();

    return {
      ...user,
      created: toDate(user.created),
      updated: toDate(user.updated),
      verified: user.verified ? toDate(user.verified) : undefined,
      deactivated: user.deactivated ? toDate(user.deactivated) : undefined,
      suspended: user.suspended ? toDate(user.suspended) : undefined,
    };
  }

  /**
   * Returns a 6-digit alphanumeric code
   */
  private getVerificationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Returns whether or not the phone number is unique
   * @param {string} phoneNumber
   */
  async isUniquePhone(phoneNumber: string) {
    const query = this.graph.query();

    const records = await query.V().has("phoneNumber", phoneNumber).toList();

    return records.length === 0;
  }

  /**
   * Returns whether or not the email is unique
   * @param {string} email
   */
  async isUniqueEmail(email: string) {
    const query = this.graph.query();

    const records = await query.V().has("email", email).toList();

    return records.length === 0;
  }

  /**
   * Creates a new user
   * @param {ICreateUserArgs} data
   */
  async createUser(data: ICreateUserArgs) {
    const query = this.graph.query();

    const now = moment().unix();
    const code = this.getVerificationCode();

    const result = await query
      .addV(labels.User)
      .property("email", data.email)
      .property("password", data.password)
      .property("created", now)
      .property("updated", now)
      .as("user")
      .properties("email")
      .property("code", code)
      .addV(labels.Profile)
      .property("created", now)
      .property("updated", now)
      .as("profile")
      .addE(relationships.HasProfile)
      .from_("user")
      .to("profile")
      .select("user")
      .elementMap()
      .next();

    const user: any = Object.fromEntries(result.value);

    return { user: this.transformUser(user), code };
  }

  /**
   * Fetches a user with the given ID
   * @param {string} id
   */
  async findUserByID(id: string) {
    const query = this.graph.query();

    const result = await query.V(id).elementMap().next();

    const user: any = Object.fromEntries(result.value);

    return this.transformUser(user);
  }

  /**
   * Fetches a user related to the given attribute
   * @param {string} attribute
   */
  async findUserByAttribute(attribute: string) {
    const query = this.graph.query();

    const result = await query
      .V()
      .hasLabel(labels.User)
      .has("email", attribute)
      .elementMap()
      .next();

    const user: any = Object.fromEntries(result.value);

    return this.transformUser(user);
  }

  /**
   * Adds a logged in status to the device, sets the refresh token,
   * and adds a relationship that tells us the user uses this device
   * @param {string} userId
   * @param {string} token
   * @param {IUserDevice} device
   */
  async deviceLogin(userId: string, token: string, device: IUserDevice) {
    const query = this.graph.query();

    let d = query.V().has(labels.UserDevice, "identifier", device.id);

    if (!d.hasNext())
      d = query
        .addV(labels.UserDevice)
        .property("identifier", device.id)
        .property("address", device.address)
        .property("platform", device.platform)
        .property("model", device.model)
        .property("created", moment().unix())
        .property("updated", moment().unix());

    await query
      .V(userId)
      .as("user")
      .V()
      .has(labels.UserDevice, "identifier", device.id)
      .as("device")
      .addE("uses")
      .from_("user")
      .to("device")
      .addE(relationships.LoggedIn)
      .from_("device")
      .to("user")
      .property("timestamp", moment().unix())
      .property("token", token)
      .next();
  }

  /**
   * Removes the login status from the graph
   * @param {string} userId
   * @param {string} deviceId
   */
  async deviceLogout(userId: string, deviceId: string) {
    const query = this.graph.query();

    await query
      .V(deviceId)
      .out(relationships.LoggedIn)
      .has(id, userId)
      .property("loggedOut", moment().unix())
      .properties("token")
      .drop()
      .next();
  }

  /**
   * Resets a user's password
   * @param {string} userId
   * @param {string} password
   */
  async resetPassword(userId: string, password: string) {
    const query = this.graph.query();

    await query.V(userId).property("password", password).next();
  }

  /**
   * Verifies a user's email
   * @param {string} userId
   * @param {string} code
   */
  async verifyEmail(userId: string, code: string) {
    const query = this.graph.query();

    const result = await query
      .V(userId)
      .as("user")
      .properties("email")
      .has("code", code)
      .property(single, "verified", moment().unix())
      .properties("code")
      .drop()
      .select("user")
      .property("verified")
      .valueMap()
      .next();

    const user: any = Object.fromEntries(result.value);

    return this.transformUser(user);
  }

  /**
   * Verifies a user's phone number
   * @param {string} userId
   * @param {string} code
   */
  async verifyPhone(userId: string, code: string) {
    const query = this.graph.query();

    const result = await query
      .V(userId)
      .properties("phone")
      .has("code", code)
      .property(single, "verified", moment().unix())
      .properties("code")
      .drop()
      .valueMap()
      .next();

    const user: any = Object.fromEntries(result.value);

    return this.transformUser(user);
  }

  /**
   * Sets the user's deactivation date
   * @param {string} userId
   */
  async deactivateAccount(userId: string) {
    const query = this.graph.query();

    await query.V(userId).property("deactivated", moment().unix()).next();
  }
}
