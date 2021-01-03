/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import DataLoader from "dataloader";
import { ApolloError } from "apollo-server-express";

import * as logging from "../../logging";

import { IContext } from "../server";
import {
  BlogPostInput,
  CommentInput,
  ReactionInput,
  QueryMyDraftsArgs,
  CommentThreadFilters,
  BlogPostCommentsArgs,
  QueryReactionsArgs,
} from "../types";

interface IBlogAPI {
  uri?: string;
}

export class BlogAPI extends RESTDataSource<IContext> {
  context: IContext;
  reactionCountLoader: DataLoader<any, any, any>;
  userReactionLoader: DataLoader<any, any, any>;

  constructor(options: IBlogAPI = {}) {
    super();
    this.baseURL = options.uri || "http://localhost:4002/api/v1/";

    this.reactionCountLoader = this.buildReactionCountLoader();
    this.userReactionLoader = this.buildUserReactionLoader();
  }

  willSendRequest(request: RequestOptions) {
    const { req } = this.context.expressCtx;
    const accessToken = req.headers.authorization;

    if (typeof accessToken !== "undefined")
      request.headers.set("Authorization", accessToken);
  }

  /**
   * Returns a new dataloader for post and comments' reaction count
   */
  private buildReactionCountLoader() {
    return new DataLoader(async (ids: string[]) => {
      const counts = await this.get("reactions/load/count", {
        ids: ids.join(","),
      });

      return ids.map((id) => counts[id] || 0);
    });
  }

  /**
   * Returns a new dataloader for the user's reactions
   */
  private buildUserReactionLoader() {
    return new DataLoader(async (ids: string[]) => {
      const counts = await this.get("reactions/load/user", {
        ids: ids.join(","),
      });

      return ids.map((id) => counts[id] || null);
    });
  }

  /**
   * Creates and returns a new blog post.
   * @param data
   */
  async createPost(data: BlogPostInput) {
    try {
      return await this.post("posts", { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Updates and returns a blog post.
   * @param id
   * @param data
   */
  async updatePost(id: string, data: BlogPostInput) {
    try {
      return await this.put(`posts/${id}`, { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Deletes a blog post.
   * @param id
   */
  async deletePost(id: string) {
    try {
      await this.delete(`posts/${id}`);
      return `Deleted post with ID ${id}`;
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Creates and returns a new comment.
   * @param data
   */
  async createComment(data: CommentInput) {
    try {
      return await this.post("comments", { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Updates and returns a comment.
   * @param id
   * @param data
   */
  async updateComment(id: string, data: CommentInput) {
    try {
      return await this.put(`comments/${id}`, { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Deletes a comment.
   * @param id
   */
  async deleteComment(id: string) {
    try {
      return await this.delete(`comments/${id}`);
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Creates and returns a new reaction.
   * @param data
   */
  async createReaction(data: ReactionInput) {
    try {
      return await this.post("reactions", { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Updates and returns a reaction.
   * @param id
   * @param data
   */
  async updateReaction(id: string, data: ReactionInput) {
    try {
      return await this.put(`reactions/${id}`, { ...data });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Deletes a reaction
   * @param id
   */
  async deleteReaction(id: string) {
    try {
      await this.delete(`reactions/${id}`);
      return `Deleted reaction with ID ${id}`;
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Retrieves a single blog post with its ID
   * @param id
   */
  async getById(id: string) {
    try {
      return await this.get(`posts/${id}`);
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns the filtered blog posts
   * @param filters
   */
  async filter(filters: any) {
    try {
      const { symbols = [], ...args } = filters;
      return await this.get("posts", {
        ...args,
        symbols: symbols.join(","),
      });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns the user's drafts
   * @param filters
   */
  async drafts(filters: QueryMyDraftsArgs) {
    try {
      return await this.get("drafts", filters);
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns the paginated comments for the post
   * @param post
   * @param filters
   */
  async getPostComments(post: string, filters: BlogPostCommentsArgs) {
    try {
      const { depth = 2, limit = 5, offset = 0 } = filters;
      return await this.get(`comments/post/${post}`, { depth, limit, offset });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns the paginated comment thread
   * @param parent
   * @param filters
   */
  async getCommentThread(parent: string, filters: CommentThreadFilters) {
    try {
      const { depth = 2, limit = 5, offset = 0 } = filters;
      return await this.get(`comments/thread/${parent}`, {
        depth,
        limit,
        offset,
      });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Returns the paginated reactions for a post or comment
   * @param args
   */
  async getReactions(args: QueryReactionsArgs) {
    try {
      const { id, limit = 5, offset = 0 } = args;
      return await this.get(`reactions/${id}`, { limit, offset });
    } catch (e) {
      if (e instanceof ApolloError) return e;
      else {
        logging.logError(e);
        return new ApolloError(
          "An error occurred while processing your request."
        );
      }
    }
  }

  /**
   * Loads a comment or post ID and returns the reaction count
   * @param id
   */
  async loadReactionCount(id: string) {
    return await this.reactionCountLoader.load(id);
  }

  /**
   * Loads a comment or post ID and returns the user's reaction
   * @param id
   */
  async loadUserReaction(id: string) {
    return await this.userReactionLoader.load(id);
  }
}
