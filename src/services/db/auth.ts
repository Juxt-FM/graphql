/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import neo4j, { Driver } from "neo4j-driver";
import { IUserProfile } from "./profiles";

export interface IUser {
  id: string;
  email: string;
  phone?: string;
  profile: IUserProfile;
  password: string;
  verified?: Date;
  deactivated?: Date;
  suspended?: Date;
  created: Date;
  updated: Date;
}

export interface IUserDevice {
  id: string;
  platform: "ios" | "android" | "web";
  model: string;
  ipAddr: string;
  fcmKey: string;
  created: Date;
  updated: Date;
}

export interface ICreateUserArgs {
  email: string;
  password: string;
}

export interface ICreateUserResult {
  user: IUser;
  emailCode: string;
}

/**
 * Neo4j authentication handler.
 */
export default class AuthHandler {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Returns whether or not the phone number is unique
   * @param phoneNumber
   */
  async isUniquePhone(phoneNumber: string) {
    const session = this.driver.session();

    try {
      const query =
        "OPTIONAL MATCH (p:PhoneNumber {value: $phoneNumber}) RETURN p";

      const { records } = await session.run(query, { phoneNumber });

      if (records[0].get("p") === null) return true;
      return false;
    } catch (e) {
      console.log(`DB error getting phone number unique status: ${e}`);
      throw e;
    }
  }

  /**
   * Returns whether or not the email is unique
   * @param email
   */
  async isUniqueEmail(email: string) {
    const session = this.driver.session();

    try {
      const query = "OPTIONAL MATCH (e:EmailAddress {value: $email}) RETURN e";

      const { records } = await session.run(query, { email });

      if (records[0].get("e") === null) return true;
      return false;
    } catch (e) {
      console.log(`DB error getting email unique status: ${e}`);
      throw e;
    }
  }

  /**
   * Creates a new user
   * @param data
   */
  async createUser(data: ICreateUserArgs): Promise<ICreateUserResult> {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        WITH timestamp() as now 
        CREATE (u:User {id: apoc.create.uuid()})-[:HAS_PROFILE]->(prof:Profile) 
        SET u.password = $password, u.created = now, u.updated = now, prof.created = now, prof.updated = now 
        WITH u, now, prof
        CREATE (u)-[ev:NEEDS_VERIFICATION]->(e:EmailAddress {value: $email})<-[:HAS_ATTRIBUTE]-(u) 
        SET e.created = now, e.updated = now, ev.code = apoc.text.random(5, 'A-Z0-9'), ev.created = now
        RETURN u AS user, prof AS profile, e.value AS email, ev.code AS emailCode
        `;

      const { records } = await session.run(query, data);

      return {
        user: {
          ...records[0].get("user").properties,
          email: records[0].get("email"),
          profile: records[0].get("profile").properties,
        },
        emailCode: records[0].get("emailCode"),
      };
    } catch (e) {
      console.log(`DB error creating user: ${e}`);
      throw e;
    }
  }

  /**
   * Fetches a user with the given ID
   * @param id
   */
  async findUserByID(id: string): Promise<IUser> {
    const session = this.driver.session();

    try {
      const query = `
        MATCH (u:User {id: $id})-[:HAS_PROFILE]->(p:Profile) 
        MATCH (u)-[:HAS_ATTRIBUTE]->(e:EmailAddress)
        OPTIONAL MATCH (u)-[:HAS_ATTRIBUTE]->(pn:PhoneNumber)
        RETURN u AS user, p AS profile, e.value AS email, pn.value AS phone
        `;

      const { records } = await session.run(query, { id });

      return {
        ...records[0].get("user").properties,
        email: records[0].get("email"),
        phone: records[0].get("phone"),
        profile: records[0].get("profile").properties,
      };
    } catch (e) {
      console.log(`DB error finding user by id: ${e}`);
      throw e;
    }
  }

  /**
   * Fetches a user related to the given attribute
   * @param attribute
   */
  async findUserByAttribute(attribute: string): Promise<IUser> {
    const session = this.driver.session();

    try {
      const query = `
        MATCH (u:User)-[HAS_ATTRIBUTE]->(n) 
        WHERE n.value = $attribute 
        RETURN u AS user
        `;

      const { records } = await session.run(query, { attribute });

      return records[0].get("user").properties;
    } catch (e) {
      console.log(`DB error finding user by attribute: ${e}`);
      throw e;
    }
  }

  /**
   * Update the last log in time on the device
   */
  async deviceLogin(userId: string, token: string, device: IUserDevice) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId}) 
        MERGE (d:Device {id: $device.id}) 
        ON CREATE SET d.created = timestamp() 
        SET d = $device, d.updated = timestamp()
        CREATE (u)<-[e:LOGGED_IN]-(d) 
        SET e.timestamp = timestamp(), e.token = $token
        `;

      await session.run(query, { userId, token, device });
    } catch (e) {
      console.log(`DB error logging into device: ${e}`);
      throw e;
    }
  }

  /**
   * Removes the refresh token from the device
   */
  async deviceLogout(userId: string, deviceId: string) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (:User {id: $userId})<-[status:LOGGED_IN]-(:Device {id: $deviceId}) 
        SET status.token = NULL, status.loggedOut = timestamp()
        `;

      await session.run(query, { userId, deviceId });
    } catch (e) {
      console.log(`DB error logging out of device: ${e}`);
      throw e;
    }
  }

  /**
   * Resets a user's password
   * @param userId
   * @param data
   */
  async resetPassword(userId: string, password: string) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId}) 
        SET u.password = $password
        `;

      await session.run(query, { userId, password });
    } catch (e) {
      console.log(`DB error resetting password: ${e}`);
      throw e;
    }
  }

  /**
   * Verifies a user's email
   * @param userId
   * @param shouldReAuthenticate
   */
  async verifyEmail(
    userId: string,
    email: string,
    code: string
  ): Promise<IUser> {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})-[nv:NEEDS_VERIFICATION]->(e:EmailAddress {value: $email})
        WHERE nv.code = $code
        DETACH DELETE nv
        CREATE (u)-[v:VERIFIED]->(e)
        SET v.timestamp = timestamp(), u.verified = coalesce(u.verified, timestamp()) 
        RETURN u AS user
        `;

      const { records } = await session.run(query, { userId, email, code });

      return records[0].get("user").properties;
    } catch (e) {
      console.log(`DB error verifying email address: ${e}`);
      throw e;
    }
  }

  /**
   * Verifies a user's phone number
   * @param userId
   * @param shouldReAuthenticate
   */
  async verifyPhone(
    userId: string,
    phone: string,
    code: string
  ): Promise<IUser> {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})-[pv:NEEDS_VERIFICATION]->(p:PhoneNumber {value: $phone})
        WHERE pv.code = $code 
        DETACH DELETE pv
        CREATE (u)-[ver:VERIFIED]->(p)
        SET ver.timestamp = timestamp(), u.verified = coalesce(u.verified, timestamp()) 
        RETURN u AS user
        `;

      const { records } = await session.run(query, { userId, phone, code });

      return records[0].get("user").properties;
    } catch (e) {
      console.log(`DB error verifying phone number: ${e}`);
      throw e;
    }
  }

  /**
   * Sets the user's deactivation date
   */
  async deactivateAccount(userId: string) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})
        SET u.deactivated = timestamp()
        `;

      await session.run(query, { userId });
    } catch (e) {
      console.log(`DB error deactivating account: ${e}`);
      throw e;
    }
  }
}
