/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import { IdeaInput, MutationCreateReactionArgs, PostInput } from "../types";
import { DataSourceConfig } from "apollo-datasource";
import { IContext } from "../server";

export class UserContentAPI extends BaseAPI {
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
    const { buildReactionLoader } = this.context.userContentService;

    buildReactionLoader(this.context.user.profile);
  }

  /**
   * Returns user content given an ID
   * @param {string} id
   */
  async getPostByID(id: string) {
    return this.handler("getPostByID", async () => {
      const { userContentService } = this.context;

      return await userContentService.getByID(id, "post");
    });
  }

  /**
   * Returns user content given an ID
   * @param {string} id
   */
  async getIdeaByID(id: string) {
    return this.handler("getIdeaByID", async () => {
      const { userContentService } = this.context;

      return await userContentService.getByID(id, "idea");
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
      const { userContentService } = this.context;

      return await userContentService.getReplies(id, limit, offset);
    });
  }

  /**
   * Create a new post
   * @param {PostInput} data
   */
  async createPost(data: PostInput) {
    return this.handler("createPost", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.createPost(user.profile, data);
    });
  }

  /**
   * Update a post
   * @param {string} id
   * @param {PostInput} data
   */
  async updatePost(id: string, data: PostInput) {
    return this.handler("updatePost", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.updatePost(id, user.profile, data);
    });
  }

  /**
   * Delete a post
   * @param {string} id
   */
  async deletePost(id: string) {
    return this.handler("deletePost", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.deletePost(id, user.profile);
    });
  }

  /**
   * Create a new idea
   * @param {IdeaInput} data
   */
  async createIdea(data: IdeaInput) {
    return this.handler("createIdea", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.createIdea(user.profile, data);
    });
  }

  /**
   * Update an idea
   * @param {string} id
   * @param {string} message
   */
  async updateIdea(id: string, message: string) {
    return this.handler("updateIdea", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.updateIdea(id, user.profile, message);
    });
  }

  /**
   * Delete an idea
   * @param {string} id
   */
  async deleteIdea(id: string) {
    return this.handler("deleteIdea", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.deleteIdea(id, user.profile);
    });
  }

  /**
   * Create a new reaction
   * @param {MutationCreateReactionArgs} data
   */
  async createReaction(reaction: MutationCreateReactionArgs) {
    return this.handler("createReaction", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.createReaction(user.profile, reaction);
    });
  }

  /**
   * Delete a reaction
   * @param {string} id
   */
  async deleteReaction(id: string) {
    return this.handler("deleteReaction", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.deleteReaction(user.profile, id);
    });
  }

  /**
   * Report content
   * @param {string} id
   */
  async reportContent(id: string) {
    return this.handler("reportContent", async () => {
      const { user, userContentService } = this.context;

      return await userContentService.reportContent(user.profile, id);
    });
  }

  /**
   * Load the user's reaction to content
   * @param {string} id
   */
  async loadReactionStatus(id: string) {
    return this.handler("loadReactionStatuses", async () => {
      const { userContentService } = this.context;

      return await userContentService.loadReaction(id);
    });
  }

  /**
   * Load reaction count for content
   * @param {string} id
   */
  async loadReactionCount(id: string) {
    return this.handler("loadReactionCount", async () => {
      const { userContentService } = this.context;

      return await userContentService.loadReactionCount(id);
    });
  }

  /**
   * Load reply count for content
   * @param {string} id
   */
  async loadReplyCount(id: string) {
    return this.handler("loadReplyCount", async () => {
      const { userContentService } = this.context;

      return await userContentService.loadReplyCount(id);
    });
  }
}
