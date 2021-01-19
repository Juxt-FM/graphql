/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";
import moment from "moment";

import GraphDB from "..";
import BaseHandler from "./base";
import { ResourceNotFoundError } from "../errors";

import { IUserAccount, labels, relationships } from "../constants";

const {
  statics: __,
  P: { gt },
} = gremlin.process;

export interface ICreateUserArgs {
  email: string;
  password: string;
}

export interface IDeviceArgs {
  id: string;
  platform: "ios" | "android" | "web";
  model: string;
  address?: string;
}

export interface ICreateUserResult {
  user: IUserAccount;
  code: string;
}

/**
 * Authentication database handler.
 * @param {GraphDB} graph
 */
export class AuthHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);

    this.transform = this.transform.bind(this);
  }

  /**
   * Returns a formatted user object
   * @param {IRawUser} user
   */
  private transform(user: IUserAccount): IUserAccount {
    return {
      ...user,
      created: this.toDate(user.created),
      updated: this.toDate(user.updated),
      deactivated: user.deactivated ? this.toDate(user.deactivated) : undefined,
      suspended: user.suspended ? this.toDate(user.suspended) : undefined,
    };
  }

  //Returns a 6-digit alphanumeric code
  private createRandomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Returns an expiration timestamp
  private getTokenExpiry() {
    return moment().valueOf() + 1000 * 60 * 60 * 24 * 7;
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

    const now = moment().valueOf();
    const code = this.createRandomCode();

    const result = await query
      .addV(labels.USER_ACCOUNT)
      .property("email", data.email)
      .property("password", data.password)
      .property("verified", false)
      .property("created", now)
      .property("updated", now)
      .as("user")
      .properties("email")
      .property("code", code)
      .addV(labels.USER_PROFILE)
      .property("created", now)
      .property("updated", now)
      .as("profile")
      .addE(relationships.HAS_PROFILE)
      .from_("user")
      .to("profile")
      .select("user")
      .elementMap()
      .next();

    const user: any = Object.fromEntries(result.value);

    return { user: this.transform(user), code };
  }

  /**
   * Updates a user's email address
   * @param {string} id
   * @param {string} email
   */
  async updateEmail(id: string, email: string) {
    const query = this.graph.query();

    const code = this.createRandomCode();

    const result = await query
      .V(id)
      .not(__.has("email", email))
      .as("user")
      .property("email", email)
      .property("updated", moment().valueOf())
      .properties("email")
      .property("code", code)
      .sideEffect(
        __.select("user").properties("email").properties("verified").drop()
      )
      .select("user")
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const user: any = Object.fromEntries(result.value);

    return { user: this.transform(user), code };
  }

  /**
   * Updates a user's phoneNumber
   * @param {string} id
   * @param {string} phone
   */
  async updatePhone(id: string, phone: string) {
    const query = this.graph.query();

    const code = this.createRandomCode();

    const result = await query
      .V(id)
      .not(__.has("phone", phone))
      .as("user")
      .property("phone", phone)
      .property("updated", moment().valueOf())
      .properties("phone")
      .property("code", code)
      .sideEffect(
        __.select("user").properties("phone").properties("verified").drop()
      )
      .select("user")
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const user: any = Object.fromEntries(result.value);

    return { user: this.transform(user), code };
  }

  /**
   * Fetches a user with the given ID
   * @param {string} id
   */
  async findUserByID(id: string) {
    const query = this.graph.query();

    const result = await query.V(id).elementMap().next();

    if (!result.value) throw new ResourceNotFoundError();

    const user: any = Object.fromEntries(result.value);

    return this.transform(user);
  }

  /**
   * Fetches a user related to the given attribute
   * @param {string} attribute
   */
  async findUserByAttribute(attribute: string) {
    const query = this.graph.query();

    const result = await query
      .V()
      .hasLabel(labels.USER_ACCOUNT)
      .or(__.has("phone", attribute), __.has("email", attribute))
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const user: any = Object.fromEntries(result.value);

    return this.transform(user);
  }

  /**
   * Fetches a user given a device id and refresh token
   * @param {string} device
   * @param {string} token
   */
  async findUserByAuthStatus(device: string, token: string) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.USER_DEVICE, "identifier", device)
      .outE(relationships.LOGGED_IN)
      .has("expires", gt(moment().valueOf()))
      .has("token", token)
      .inV()
      .hasLabel(labels.USER_ACCOUNT)
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const user: any = Object.fromEntries(result.value);

    return this.transform(user);
  }

  /**
   * Create a new device
   * @param {GraphTraversal} query
   * @param {IDeviceArgs} device
   * @param {string} userId
   */
  async createDevice(
    query: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>,
    device: IDeviceArgs,
    userId: string
  ) {
    if (!query) query = this.graph.query();

    return await query
      .V(userId)
      .as("user")
      .addV(labels.USER_DEVICE)
      .property("identifier", device.id)
      .property("address", device.address)
      .property("platform", device.platform)
      .property("model", device.model)
      .property("created", moment().valueOf())
      .property("updated", moment().valueOf())
      .as("device")
      .addE(relationships.USES_DEVICE)
      .from_("user")
      .to("device")
      .select("device")
      .elementMap()
      .next();
  }

  /**
   * Adds a logged in status to the device and sets the refresh token
   * @param {string} userId
   * @param {string} token
   * @param {IDeviceArgs} device
   */
  async deviceLogin(userId: string, token: string, device: IDeviceArgs) {
    const query = this.graph.query();

    let created = false;

    let deviceObj: any = await query
      .V()
      .has(labels.USER_DEVICE, "identifier", device.id)
      .property("address", device.address)
      .elementMap()
      .next();

    if (!deviceObj.value) {
      deviceObj = await this.createDevice(query, device, userId);
      created = true;
    }

    deviceObj = Object.fromEntries(deviceObj.value);

    await query
      .V(userId)
      .as("user")
      .V(deviceObj.id)
      .as("device")
      .addE(relationships.LOGGED_IN)
      .as("status")
      .from_("device")
      .to("user")
      .select("status")
      .property("timestamp", moment().valueOf())
      .property("expires", this.getTokenExpiry())
      .property("token", token)
      .next();

    return { device: deviceObj, created };
  }

  /**
   * Removes the login status from the graph
   * @param {string} userId
   * @param {string} deviceId
   */
  async deviceLogout(userId: string, deviceId: string) {
    const query = this.graph.query();

    await query
      .V()
      .hasLabel(labels.USER_DEVICE)
      .has("identifier", deviceId)
      .outE(relationships.LOGGED_IN)
      .where(__.inV().hasId(userId))
      .drop()
      .next();
  }

  /**
   * Update a user's device authentication status
   * @param {string} deviceId
   * @param {string} userId
   * @param {string} token
   */
  async updateAuthStatus(deviceId: string, userId: string, token: string) {
    const query = this.graph.query();

    const result = await query
      .V()
      .hasLabel(labels.USER_DEVICE)
      .has("identifier", deviceId)
      .outE(relationships.LOGGED_IN)
      .as("status")
      .inV()
      .hasId(userId)
      .select("status")
      .property("token", token)
      .property("expires", this.getTokenExpiry())
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();
  }

  /**
   * Resets a user's password
   * @param {string} userId
   * @param {string} password
   */
  async resetPassword(userId: string, password: string) {
    const query = this.graph.query();

    await query
      .V(userId)
      .property("password", password)
      .property("updated", moment().valueOf())
      .next();
  }

  /**
   * Verifies a user's email address
   * @param {string} userId
   * @param {string} code
   */
  async verifyEmail(userId: string, code: string) {
    const query = this.graph.query();

    const codeProp = await query
      .V(userId)
      .as("user")
      .properties("email")
      .values("code")
      .next();

    if (codeProp.value) {
      if (codeProp.value === code) {
        const result = await query
          .V(userId)
          .property("verified", true)
          .property("updated", moment().valueOf())
          .as("user")
          .sideEffect(__.properties("email").properties("code").drop())
          .select("user")
          .elementMap()
          .next();

        const user: any = Object.fromEntries(result.value);

        return this.transform(user);
      } else throw new ResourceNotFoundError("Invalid code.");
    } else {
      throw new Error();
    }
  }

  /**
   * Verifies a user's phone number
   * @param {string} userId
   * @param {string} code
   */
  async verifyPhone(userId: string, code: string) {
    const query = this.graph.query();

    const codeProp = await query
      .V(userId)
      .as("user")
      .properties("phone")
      .values("code")
      .next();

    if (codeProp.value) {
      if (codeProp.value === code) {
        const result = await query
          .V(userId)
          .property("verified", true)
          .property("updated", moment().valueOf())
          .as("user")
          .sideEffect(__.properties("phone").properties("code").drop())
          .select("user")
          .elementMap()
          .next();

        const user: any = Object.fromEntries(result.value);

        return this.transform(user);
      } else throw new ResourceNotFoundError("Invalid code.");
    } else {
      throw new Error();
    }
  }

  /**
   * Sets the user's deactivation date
   * @param {string} userId
   */
  async deactivateAccount(userId: string) {
    const query = this.graph.query();

    await query.V(userId).property("deactivated", moment().valueOf()).next();
  }
}
