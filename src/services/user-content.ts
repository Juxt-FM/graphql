/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import DataLoader from "dataloader";
import _ from "lodash";

import { UserContentHandler } from "../db";

/**
 * User service (post authors, public profiles, etc.)
 * @param {UserContentHandler} dbHandler
 */
export class UserService {
  private dbHandler: UserContentHandler;
  private reactionCountLoader: DataLoader<any, any, any>;
  private replyCountLoader: DataLoader<any, any, any>;

  constructor(dbHandler: UserContentHandler) {
    this.dbHandler = dbHandler;

    this.reactionCountLoader = this.buildReactionCountLoader();
    this.replyCountLoader = this.buildReplyCountLoader();
  }

  private buildReactionCountLoader() {
    return new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReactionCounts(ids);

      const profiles = _.keyBy(result, "id");

      return ids.map((id) => profiles[id] || null);
    });
  }

  private buildReplyCountLoader() {
    return new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReplyCounts(ids);

      const profiles = _.keyBy(result, "id");

      return ids.map((id) => profiles[id] || null);
    });
  }

  /**
   * Loads the content's reaction count
   * @param {string} id
   */
  async loadReactionCount(id: string) {
    return await this.reactionCountLoader.load(id);
  }

  /**
   * Loads the content's reply count
   * @param {string} id
   */
  async loadReplyCount(id: string) {
    return await this.replyCountLoader.load(id);
  }
}
