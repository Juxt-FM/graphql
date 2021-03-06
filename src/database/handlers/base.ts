/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import moment from "moment";

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
   * Converts a millisecond timestamp into a JS Date
   * @param {number} timestamp
   */
  protected toDate(timestamp: number | Date) {
    if (typeof timestamp === "number") return moment(timestamp).toDate();
    else return timestamp;
  }
}
