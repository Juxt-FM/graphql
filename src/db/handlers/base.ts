/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import GraphDB from "..";

/**
 * Base database handler.
 * @param {GraphDB} graph
 */
export default class BaseHandler {
  protected graph: GraphDB;

  constructor(graph: GraphDB) {
    this.graph = graph;
  }

  /**
   * Returns a generic not found error.
   */
  protected getNotFoundError() {
    const err = new Error("Not found.");
    err["name"] = "NOTFOUND";
    return err;
  }
}
