/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import DataLoader from "dataloader";

import { ValidationError } from "./utils/errors";

import {
  ContentHandler,
  IPostInput,
  IIdeaInput,
  IReactionInput,
} from "../database";

/**
 * Content service (posts, ideas, reactions, etc.)
 * @param {ContentHandler} dbHandler
 */
export class ContentService {
  private dbHandler: ContentHandler;
  private reactionCountLoader: DataLoader<any, any, any>;
  private replyCountLoader: DataLoader<any, any, any>;
  private reactionLoader: DataLoader<any, any, any>;

  constructor(dbHandler: ContentHandler) {
    this.dbHandler = dbHandler;

    this.buildReactionLoader = this.buildReactionLoader.bind(this);

    this.buildReactionCountLoader();
    this.buildReplyCountLoader();
  }

  /**
   * Loads a user's reactions to content
   * @param {string} user
   */
  buildReactionLoader(user: string) {
    this.reactionLoader = new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReactions(ids, user);

      return ids.map((id) => result[id] || null);
    });
  }

  private buildReactionCountLoader() {
    this.reactionCountLoader = new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReactionCounts(ids);

      return ids.map((id) => result[id] || 0);
    });
  }

  private buildReplyCountLoader() {
    this.replyCountLoader = new DataLoader(async (ids: string[]) => {
      const result = await this.dbHandler.loadReplyCounts(ids);

      return ids.map((id) => result[id] || 0);
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
    else if (data.title.length < 10)
      throw new ValidationError(
        "Titles must be greater than 10 characters long.",
        ["title"]
      );
    else if (data.content.length < 1000)
      throw new ValidationError(
        "Post content length must be greater than 1000 characters.",
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
    else if (message.length < 10)
      throw new ValidationError(
        "Messages must be greater than 10 characters long.",
        ["message"]
      );

    return message;
  }

  /**
   * Returns the content with the given ID
   * @param {string} id
   * @param {string} label
   */
  async getByID(id: string, label: "post" | "idea") {
    return await this.dbHandler.findById(id, label);
  }

  /**
   * Returns the content authored by the given user
   * @param {string} author
   * @param {number} limit
   * @param {number} offset
   * @param {string} label
   */
  async getByAuthor(
    author: string,
    limit: number,
    offset: number,
    label: "post" | "idea"
  ) {
    return await this.dbHandler.findByAuthor(author, limit, offset, label);
  }

  /**
   * Returns replies to the content with the given ID
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async getReplies(id: string, limit: number, offset: number) {
    return await this.dbHandler.findReplies(id, limit, offset);
  }

  /**
   * Returns reactions to the content with the given ID
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async getReactions(id: string, limit: number, offset: number) {
    return await this.dbHandler.findReactions(id, limit, offset);
  }

  /**
   * Creates and returns a new post
   * @param {string} profile
   * @param {IPostInput} data
   */
  async createPost(profile: string, data: IPostInput) {
    const validated = this.validatePost(data);

    return await this.dbHandler.createPost(profile, validated);
  }

  /**
   * Updates and returns a post
   * @param {string} id
   * @param {string} profile
   * @param {IPostInput} data
   */
  async updatePost(id: string, profile: string, data: IPostInput) {
    const validated = this.validatePost(data);

    return await this.dbHandler.updatePost(id, profile, validated);
  }

  /**
   * Deletes a post
   * @param {string} id
   * @param {string} profile
   */
  async deletePost(id: string, profile: string) {
    await this.dbHandler.deletePost(id, profile);
    return "Successfully deleted post.";
  }

  /**
   * Creates and returns a new idea
   * @param {string} profile
   * @param {IIdeaInput} data
   */
  async createIdea(profile: string, data: IIdeaInput) {
    return await this.dbHandler.createIdea(profile, {
      ...data,
      message: this.validateIdeaMessage(data.message),
    });
  }

  /**
   * Updates and returns an idea
   * @param {string} id
   * @param {string} profile
   * @param {string} message
   */
  async updateIdea(id: string, profile: string, message: string) {
    return await this.dbHandler.updateIdea(
      id,
      profile,
      this.validateIdeaMessage(message)
    );
  }

  /**
   * Deletes an idea
   * @param {string} id
   * @param {string} profile
   */
  async deleteIdea(id: string, profile: string) {
    await this.dbHandler.deleteIdea(id, profile);
    return "Successfully deleted idea.";
  }

  /**
   * Creates and returns a new reaction
   * @param {string} profile
   * @param {IReactionInput} data
   */
  async createReaction(profile: string, data: IReactionInput) {
    return await this.dbHandler.createReaction(profile, data);
  }

  /**
   * Deletes a reaction
   * @param {string} profile
   * @param {string} id
   */
  async deleteReaction(profile: string, id: string) {
    await this.dbHandler.deleteReaction(profile, id);
    return "Successfully deleted reaction.";
  }

  /**
   * Reports content
   * @param {string} profile
   * @param {string} id
   */
  async reportContent(profile: string, id: string) {
    await this.dbHandler.reportContent(profile, id);
    return "Reported content.";
  }

  /**
   * Loads the profile's reaction to content with the given ID
   * @param {string} id
   */
  async loadReaction(id: string) {
    return await this.reactionLoader.load(id);
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
