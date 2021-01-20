/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import { IdeaInput, MutationCreateReactionArgs, PostInput } from "../types";
import { DataSourceConfig } from "apollo-datasource";
import { IContext } from "../server";

export class ContentAPI extends BaseAPI {
  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<IContext>) {
    this.context = config.context;

    /**
     * For this service we need to manually
     * build the reaction dataloader, as it requires
     * the logged in user's ID
     */
    const { buildReactionLoader } = this.context.contentService;

    if (this.context.user) {
      buildReactionLoader(this.context.user.profile);
    }
  }

  /**
   * Returns user content given an ID
   * @param {string} id
   */
  async getPostByID(id: string) {
    return this.handler("getPostByID", async () => {
      const { contentService } = this.context;

      return await contentService.getByID(id, "post");
    });
  }

  /**
   * Returns user content given an ID
   * @param {string} id
   */
  async getIdeaByID(id: string) {
    return this.handler("getIdeaByID", async () => {
      const { contentService } = this.context;

      return await contentService.getByID(id, "idea");
    });
  }

  /**
   * Returns content replies given the parent ID
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async getReplies(id: string, limit: number, offset: number) {
    return this.handler("getReplies", async () => {
      const { contentService } = this.context;

      return await contentService.getReplies(id, limit, offset);
    });
  }

  /**
   * Create a new post
   * @param {PostInput} data
   */
  async createPost(data: PostInput) {
    return this.handler("createPost", async () => {
      const { user, contentService } = this.context;

      return await contentService.createPost(user.profile, data);
    });
  }

  /**
   * Update a post
   * @param {string} id
   * @param {PostInput} data
   */
  async updatePost(id: string, data: PostInput) {
    return this.handler("updatePost", async () => {
      const { user, contentService } = this.context;

      return await contentService.updatePost(id, user.profile, data);
    });
  }

  /**
   * Delete a post
   * @param {string} id
   */
  async deletePost(id: string) {
    return this.handler("deletePost", async () => {
      const { user, contentService } = this.context;

      return await contentService.deletePost(id, user.profile);
    });
  }

  /**
   * Create a new idea
   * @param {IdeaInput} data
   */
  async createIdea(data: IdeaInput) {
    return this.handler("createIdea", async () => {
      const { user, contentService } = this.context;

      return await contentService.createIdea(user.profile, data);
    });
  }

  /**
   * Update an idea
   * @param {string} id
   * @param {string} message
   */
  async updateIdea(id: string, message: string) {
    return this.handler("updateIdea", async () => {
      const { user, contentService } = this.context;

      return await contentService.updateIdea(id, user.profile, message);
    });
  }

  /**
   * Delete an idea
   * @param {string} id
   */
  async deleteIdea(id: string) {
    return this.handler("deleteIdea", async () => {
      const { user, contentService } = this.context;

      return await contentService.deleteIdea(id, user.profile);
    });
  }

  /**
   * Create a new reaction
   * @param {MutationCreateReactionArgs} data
   */
  async createReaction(reaction: MutationCreateReactionArgs) {
    return this.handler("createReaction", async () => {
      const { user, contentService } = this.context;

      return await contentService.createReaction(user.profile, reaction);
    });
  }

  /**
   * Delete a reaction
   * @param {string} id
   */
  async deleteReaction(id: string) {
    return this.handler("deleteReaction", async () => {
      const { user, contentService } = this.context;

      return await contentService.deleteReaction(user.profile, id);
    });
  }

  /**
   * Report content
   * @param {string} id
   */
  async reportContent(id: string) {
    return this.handler("reportContent", async () => {
      const { user, contentService } = this.context;

      return await contentService.reportContent(user.profile, id);
    });
  }

  /**
   * Load the user's reaction to content
   * @param {string} id
   */
  async loadReactionStatus(id: string) {
    if (!this.context.user) return null;

    return this.handler("loadReactionStatuses", async () => {
      const { contentService } = this.context;

      return await contentService.loadReaction(id);
    });
  }

  /**
   * Load reaction count for content
   * @param {string} id
   */
  async loadReactionCount(id: string) {
    return this.handler("loadReactionCount", async () => {
      const { contentService } = this.context;

      return await contentService.loadReactionCount(id);
    });
  }

  /**
   * Load reply count for content
   * @param {string} id
   */
  async loadReplyCount(id: string) {
    return this.handler("loadReplyCount", async () => {
      const { contentService } = this.context;

      return await contentService.loadReplyCount(id);
    });
  }
}
