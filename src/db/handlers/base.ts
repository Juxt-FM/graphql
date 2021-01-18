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
}
