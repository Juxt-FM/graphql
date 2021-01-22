/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";
import moment from "moment";

import GraphDB from "..";

import BaseHandler from "./base";

import { ResourceNotFoundError } from "../errors";
import { labels, relationships, IPost, IIdea } from "../constants";

const {
  statics: __,
  order: { desc },
} = gremlin.process;

export interface IPostInput {
  publicationStatus: "public" | "draft";
  contentFormat: "markdown" | "html";
  title: string;
  summary?: string;
  imageURL?: string;
  content: string;
}

export interface IIdeaInput {
  replyStatus?: string;
  message: string;
}

export interface IReactionInput {
  to: string;
  reaction: "like" | "dislike" | "love" | "hate";
}

export interface IUpdateReactionInput {
  id: string;
  reaction: "like" | "dislike" | "love" | "hate";
}

/**
 * User content database handler.
 * @param {GraphDB} graph
 */
export class ContentHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);

    this.transform = this.transform.bind(this);
  }

  private transform(content: IPost | IIdea): IPost | IIdea {
    return {
      ...content,
      created: this.toDate(content.created),
      updated: this.toDate(content.updated),
    };
  }

  /**
   * Fetches content by it's ID
   * @param {string} id
   */
  async findById(id: string, label: typeof labels.IDEA | typeof labels.POST) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(label)
      .as("content")
      .in_(relationships.AUTHORED)
      .as("author")
      .select("content", "author")
      .by(__.elementMap())
      .by(__.id())
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const record: any = Object.fromEntries(result.value);
    const content: any = Object.fromEntries(record.content);

    return this.transform({ ...content, author: record.author });
  }

  /**
   * Fetches content by it's author
   * @param {string} author
   * @param {number} limit
   * @param {number} offset
   */
  async findByAuthor(
    author: string,
    limit: number,
    offset: number,
    label: typeof labels.IDEA | typeof labels.POST
  ) {
    const query = this.graph.query();

    const result = await query
      .V(author)
      .out(relationships.AUTHORED)
      .hasLabel(label)
      .order()
      .by("created", desc)
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((item: any) => {
      const record: any = Object.fromEntries(item);
      return this.transform({ ...record, author });
    });
  }

  /**
   * Creates and returns a new idea
   * @param {string} user
   * @param {IIdeaInput} data
   */
  async createIdea(user: string, data: IIdeaInput): Promise<IIdea> {
    const query = this.graph.query();

    const result = await query
      .addV(labels.POST)
      .property("message", data.message)
      .property("created", moment().valueOf())
      .property("updated", moment().valueOf())
      .as("idea")
      .V(user)
      .as("user")
      .addE(relationships.AUTHORED)
      .from_("user")
      .to("idea")
      .select("idea")
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const record: any = Object.fromEntries(result.value);

    if (data.replyStatus)
      await query
        .addE(relationships.REPLY_TO)
        .from_(record.id)
        .to(data.replyStatus)
        .next();

    return this.transform(record) as IIdea;
  }

  /**
   * Updates and returns an idea
   * @param {string} id
   * @param {string} user
   * @param {string} message
   */
  async updateIdea(id: string, user: string, message: string): Promise<IIdea> {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.IDEA)
      .as("idea")
      .hasNot("deleted")
      .in_(relationships.AUTHORED)
      .hasId(user)
      .select("idea")
      .property("message", message)
      .property("updated", moment().valueOf())
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const record: any = Object.fromEntries(result.value);

    return this.transform(record) as IIdea;
  }

  /**
   * Updates and returns an idea
   * @param {string} id
   * @param {string} user
   */
  async deleteIdea(id: string, user: string) {
    const query = this.graph.query();

    await query
      .V(id)
      .hasLabel(labels.IDEA)
      .hasNot("deleted")
      .as("idea")
      .in_(relationships.AUTHORED)
      .hasId(user)
      .select("idea")
      .properties()
      .drop()
      .select("idea")
      .property("deleted", moment().valueOf())
      .next();
  }

  /**
   * Creates and returns a new post
   * @param {string} user
   * @param {IPostInput} data
   */
  async createPost(user: string, data: IPostInput): Promise<IPost> {
    const query = this.graph.query();

    const result = await query
      .addV(labels.POST)
      .property("publicationStatus", data.publicationStatus)
      .property("contentFormat", data.contentFormat)
      .property("title", data.title)
      .property("summary", data.summary)
      .property("imageURL", data.imageURL)
      .property("content", data.content)
      .property("created", moment().valueOf())
      .property("updated", moment().valueOf())
      .as("post")
      .V(user)
      .as("user")
      .addE(relationships.AUTHORED)
      .from_("user")
      .to("post")
      .select("post")
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const record: any = Object.fromEntries(result.value);

    return this.transform(record) as IPost;
  }

  /**
   * Updates and returns a post
   *
   * NEED TO ADD SUPPORT FOR DRAFTING
   *
   * @param {string} id
   * @param {string} user
   * @param {IPostInput} data
   */
  async updatePost(id: string, user: string, data: IPostInput): Promise<IPost> {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.IDEA)
      .hasNot("deleted")
      .as("idea")
      .in_(relationships.AUTHORED)
      .hasId(user)
      .select("idea")
      .property("publicationStatus", data.publicationStatus)
      .property("contentFormat", data.contentFormat)
      .property("title", data.title)
      .property("summary", data.summary)
      .property("imageURL", data.imageURL)
      .property("content", data.content)
      .property("updated", moment().valueOf())
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const record: any = Object.fromEntries(result.value);

    return this.transform(record) as IPost;
  }

  /**
   * Updates and returns an idea
   * @param {string} id
   * @param {string} user
   */
  async deletePost(id: string, user: string) {
    const query = this.graph.query();

    await query
      .V(id)
      .hasLabel(labels.POST)
      .hasNot("deleted")
      .as("post")
      .in_(relationships.AUTHORED)
      .hasId(user)
      .select("post")
      .properties()
      .drop()
      .select("post")
      .property("deleted", moment().valueOf())
      .next();
  }

  /**
   * Creates and returns a new reaction. Deletes the
   * existing reaction if needed.
   * @param {string} user
   * @param {IIdeaInput} data
   */
  async createReaction(user: string, data: IReactionInput) {
    const query = this.graph.query();

    const result = await query
      .V(data.to)
      .or(__.hasLabel(labels.IDEA), __.hasLabel(labels.POST))
      .as("to")
      .V(user)
      .as("user")
      .sideEffect(
        __.outE(relationships.REACTED_TO).where(__.inV().hasId(data.to)).drop()
      )
      .addE(relationships.REACTED_TO)
      .property("reaction", data.reaction)
      .property("created", moment().valueOf())
      .as("rel")
      .from_("user")
      .to("to")
      .select("rel")
      .values("reaction")
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    return result.value;
  }

  /**
   * Deletes a reaction
   * @param {string} user
   * @param {IIdeaInput} data
   */
  async deleteReaction(user: string, id: string) {
    const query = this.graph.query();

    await query.E(id).as("rel").outV().hasId(user).select("rel").drop().next();
  }

  /**
   * Reports a post or idea
   * @param {string} user
   * @param {id} id
   */
  async reportContent(user: string, id: string) {
    const query = this.graph.query();

    await query
      .V(id)
      .or(__.hasLabel(labels.POST), __.hasLabel(labels.IDEA))
      .as("content")
      .addE(relationships.REPORTED)
      .property("timestamp", moment().valueOf())
      .to("content")
      .from_(user)
      .next();
  }

  /**
   * Finds replies to a post or idea
   *
   * NEED TO GET AUTHOR ID TOO
   *
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async findReplies(id: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .or(__.hasLabel(labels.POST), __.hasLabel(labels.IDEA))
      .in_(relationships.REPLY_TO)
      .order()
      .by("created", desc)
      .range(offset, limit)
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const records: any = Object.fromEntries(result.value);

    return records.map(this.transform);
  }

  /**
   * Load a user's reactions to content
   * @param {string[]} ids
   * @param {string} user
   */
  async loadReactions(ids: string[], user: string) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .group()
      .by(__.id())
      .by(
        __.inE(relationships.REACTED_TO)
          .as("rel")
          .outV()
          .hasNot("deactivated")
          .hasId(user)
          .select("rel")
          .elementMap()
      )
      .next();

    const records: any = Object.fromEntries(result.value);

    Object.keys(records).forEach((key: string) => {
      const inner: any = Object.fromEntries(records[key]);

      const to = Object.fromEntries(inner.IN).id;
      const from = Object.fromEntries(inner.OUT).id;

      records[key] = {
        id: inner.id,
        reaction: inner.reaction,
        timestamp: moment(inner.timestamp).toDate(),
        from,
        to,
      };
    });

    return records;
  }

  /**
   * Load reply counts
   * @param {string} ids
   */
  async loadReplyCounts(ids: string[]) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .group()
      .by(__.id())
      .by(__.in_(relationships.REPLY_TO).hasNot("deactivated").count())
      .next();

    return Object.fromEntries(result.value);
  }

  /**
   * Load reaction counts
   * @param {string} ids
   */
  async loadReactionCounts(ids: string[]) {
    const query = this.graph.query();

    const result = await query
      .V(...ids)
      .group()
      .by(__.id())
      .by(__.in_(relationships.REACTED_TO).hasNot("deactivated").count())
      .next();

    return Object.fromEntries(result.value);
  }
}
