/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import DataLoader from "dataloader";
import _ from "lodash";

import { ValidationError } from "./errors";

import {
  UserContentHandler,
  IPostInput,
  IIdeaInput,
  IReactionInput,
} from "../db";

/**
 * User service (post authors, public profiles, etc.)
 * @param {UserContentHandler} dbHandler
 */
export class UserContentService {
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

      const counts = _.keyBy(result, "id");

      return ids.map((id) => (counts[id] ? counts[id].count : 0));
    });
  }

  private buildReplyCountLoader() {
    return new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReplyCounts(ids);

      const counts = _.keyBy(result, "id");

      return ids.map((id) => (counts[id] ? counts[id].count : 0));
    });
  }

  /**
   * Validate a new post
   * @param {IPostInput} data
   */
  private validatePost(data: IPostInput) {
    data.title = data.title.trim();
    data.summary = data.summary.trim();

    if (data.title.length > 65)
      throw new ValidationError(
        "Titles must be less than 65 characters long.",
        ["title"]
      );
    else if (data.summary.length > 100)
      throw new ValidationError(
        "Summaries must be less than 100 characters long.",
        ["summary"]
      );

    return data;
  }

  /**
   * Validate an idea's message
   * @param {string} message
   */
  private validateIdeaMessage(message: string) {
    message = message.trim();

    if (message.length > 325)
      throw new ValidationError(
        "Messages must be less than 325 characters long.",
        ["message"]
      );

    return message;
  }

  /**
   * Creates and returns a new post
   * @param {string} user
   * @param {IPostInput} data
   */
  async createPost(user: string, data: IPostInput) {
    const validated = this.validatePost(data);

    return await this.dbHandler.createPost(user, validated);
  }

  /**
   * Updates and returns a post
   * @param {string} id
   * @param {string} user
   * @param {IPostInput} data
   */
  async updatePost(id: string, user: string, data: IPostInput) {
    const validated = this.validatePost(data);

    return await this.dbHandler.updatePost(id, user, validated);
  }

  /**
   * Deletes a post
   * @param {string} id
   * @param {string} user
   */
  async deletePost(id: string, user: string) {
    return await this.dbHandler.deletePost(id, user);
  }

  /**
   * Creates and returns a new idea
   * @param {string} user
   * @param {IIdeaInput} data
   */
  async createIdea(user: string, data: IIdeaInput) {
    return await this.dbHandler.createIdea(user, {
      ...data,
      message: this.validateIdeaMessage(data.message),
    });
  }

  /**
   * Returns replies for the object with the given ID
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async findReplies(id: string, limit: number, offset: number) {
    return await this.dbHandler.findReplies(id, limit, offset);
  }

  /**
   * Updates and returns an idea
   * @param {string} id
   * @param {string} user
   * @param {string} message
   */
  async updateIdea(id: string, user: string, message: string) {
    return await this.dbHandler.updateIdea(
      id,
      user,
      this.validateIdeaMessage(message)
    );
  }

  /**
   * Deletes an idea
   * @param {string} id
   * @param {string} user
   */
  async deleteIdea(id: string, user: string) {
    return await this.dbHandler.deleteIdea(id, user);
  }

  /**
   * Creates and returns a new reaction
   * @param {string} user
   * @param {IReactionInput} data
   */
  async createReaction(user: string, data: IReactionInput) {
    return await this.dbHandler.createReaction(user, data);
  }

  /**
   * Deletes a reaction
   * @param {string} user
   * @param {string} id
   */
  async deleteReaction(user: string, id: string) {
    return await this.dbHandler.deleteReaction(user, id);
  }

  /**
   * Reports content
   * @param {string} user
   * @param {string} id
   */
  async reportContent(user: string, id: string) {
    return await this.dbHandler.reportContent(user, id);
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
