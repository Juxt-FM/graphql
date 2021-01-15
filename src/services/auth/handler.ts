/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import neo4j, { Driver } from "neo4j-driver";

export interface IUser {
  id: string;
  password: string;
  created: Date;
  updated: Date;
  lastLogin: Date;
  deactivated?: Date;
  suspended?: Date;
}

export interface IUserDevice {
  id: string;
  token?: string;
  platform: "ios" | "android" | "web";
  model: string;
  ipAddr: string;
  fcmKey: string;
}

export interface IEmailAddress {
  value: string;
  verified: Date;
  created: Date;
  updated: Date;
}

export interface IPhoneNumber {
  value: string;
  verified: Date;
  created: Date;
  updated: Date;
}

export interface ICreateUserArgs {
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface ICreateUserResult {
  user: IUser;
  phoneNumber: IPhoneNumber;
  emailAddress: IEmailAddress;
}

/**
 * Neo4j authentication handler.
 */
export default class AuthHandler {
  private driver: Driver;
  private database: string;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  /**
   * Builds the new user query based on whether an email
   * and/or phone number was provided
   * @param phone
   * @param email
   */
  private buildUserQuery(phone: boolean, email: boolean) {
    const emailQ = `
      WITH u, now 
      CREATE (u)-[ev:NEEDS_VERIFICATION]->(e:EmailAddress {emailAddress: $email})<-[:HAS_ATTRIBUTE]-(u) 
      SET e.created = now, e.updated = now, ev.code = apoc.text.random(5, 'A-Z0-9'), ev.created = now 
      `;

    const phoneQ = `
      WITH u, now 
      CREATE (u)-[pv:NEEDS_VERIFICATION]->(p:PhoneNumber {phoneNumber: $phoneNumber})<-[a:HAS_ATTRIBUTE]-(u) 
      SET p.created = now, p.updated = now, pv.code = apoc.text.random(5, 'A-Z0-9'), pv.created = now 
      `;

    return `
      WITH timestamp() as now 
      CREATE (u:User {id: apoc.create.uuid(), password: $password}) 
      SET u.lastLogin = now, u.created = now, u.updated = now 
      ${email ? emailQ : ""}
      ${phone ? phoneQ : ""}
      RETURN u AS user 
      ${email ? ", ev AS emailVerification" : ""} 
      ${phone ? ", pv AS phoneVerification" : ""} 
      `;
  }

  /**
   * Creates a new user
   * @param data
   */
  async createUser(data: ICreateUserArgs): Promise<ICreateUserResult> {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = this.buildUserQuery(
        Boolean(data.email),
        Boolean(data.phoneNumber)
      );

      const { records } = await session.run(query, data);

      return {
        user: records[0].get("user").properties,
        phoneNumber: records[0].get("phoneNumber").properties,
        emailAddress: records[0].get("email").properties,
      };
    } catch (e) {
      console.log(`Error creating user: ${e}`);
      throw e;
    }
  }

  /**
   * Fetches a user related to the given identifier
   * @param identifier
   */
  async findUserByIdentifier(identifier: string): Promise<IUser> {
    const session = this.driver.session({ database: this.database });

    try {
      const query = `
        MATCH (u:User)-[HAS_ATTRIBUTE]->(n) 
        WHERE n.value = $identifier 
        RETURN u AS user
        `;

      const { records } = await session.run(query, { identifier });

      return records[0].get("user").properties;
    } catch (e) {
      console.log(`Error finding user by identifier: ${e}`);
      throw e;
    }
  }

  /**
   * Update the last log in time on the device
   */
  async deviceLogin(device: IUserDevice, userId: string) {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId}) 
        MERGE (d:Device {id: $device.id}) 
        ON CREATE SET d = device, d.created = timestamp() 
        SET d.updated = timestamp() 
        CREATE (u)-[e:LOGGED_IN]->(d) 
        SET e.timestamp = timestamp()
        `;

      await session.run(query, { userId, device });
    } catch (e) {
      console.log(`Error logging into device: ${e}`);
      throw e;
    }
  }

  /**
   * Removes the refresh token from the device
   */
  async deviceLogout(userId: string, deviceId: string) {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (:User {id: $userId})-[:USES_DEVICE]->(d:Device {id: $deviceId}) 
        SET d.token = NULL, d.updated = timestamp() 
        `;

      await session.run(query, { userId, deviceId });
    } catch (e) {
      console.log(`Error logging out of device: ${e}`);
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
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId}) 
        SET u.password = $password
        `;

      await session.run(query, { userId, password });
    } catch (e) {
      console.log(`Error resetting password: ${e}`);
      throw e;
    }
  }

  /**
   * Verifies a user's email
   * @param userId
   * @param shouldReAuthenticate
   */
  async verifyEmail(userId: string, email: string) {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})-[:NEEDS_VERIFICATION]->(e:EmailAddress {value: $email})
        SET e.verified = timestamp()
        `;

      await session.run(query, { userId, email });
    } catch (e) {
      console.log(`Error verifying email address: ${e}`);
      throw e;
    }
  }

  /**
   * Verifies a user's phone number
   * @param userId
   * @param shouldReAuthenticate
   */
  async verifyPhone(userId: string, phone: string) {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})-[:NEEDS_VERIFICATION]->(p:PhoneNumber {value: $phone})
        SET p.verified = timestamp()
        `;

      await session.run(query, { userId, phone });
    } catch (e) {
      console.log(`Error verifying phone number: ${e}`);
      throw e;
    }
  }

  /**
   * Sets the user's deactivation date
   */
  async deactivateAccount(userId: string) {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const query = `
        MATCH (u:User {id: $userId})
        SET u.deactivated = timestamp()
        `;

      await session.run(query, { userId });
    } catch (e) {
      console.log(`Error deactivating account: ${e}`);
      throw e;
    }
  }
}
