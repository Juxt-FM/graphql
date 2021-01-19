/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";

import GraphDB from "..";

import BaseHandler from "./base";
import { labels, relationships } from "../constants";
import { ResourceNotFoundError } from "../errors";

const {
  statics: __,
  P: { neq },
} = gremlin.process;

/**
 * Company database handler.
 *
 * ALL QUERIES ARE EXPERIMENTAL AND HAVE
 * NOT BEEN TESTED OR EVEN USED
 *
 * (they might work tho)
 *
 *
 * @param {GraphDB} graph
 */
export class MarketHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);
  }

  /**
   * Finds and returns paginated business sectors
   * @param {number} limit
   * @param {number} offset
   */
  async findAllSectors(limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.BUSINESS_SECTOR)
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const records: any = Object.fromEntries(result.value);

    return records;
  }

  /**
   * Finds and returns paginated business industries
   * @param {number} limit
   * @param {number} offset
   */
  async findAllIndustries(limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.BUSINESS_INDUSTRY)
      .elementMap()
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const records: any = Object.fromEntries(result.value);

    return records;
  }

  /**
   * Fetches a company with the given symbol
   * @param {string} symbol
   */
  async findCompanyBySymbol(symbol: string) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.COMPANY, "symbol", symbol)
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const company: any = Object.fromEntries(result.value);

    return company;
  }

  /**
   * Fetches all companies in the given sector
   * with pagination
   * @param {string} sector
   * @param {number} limit
   * @param {number} offset
   */
  async findCompaniesBySector(sector: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.BUSINESS_SECTOR, "name", sector)
      .inE(relationships.IN_SECTOR)
      .outV()
      .hasLabel(labels.COMPANY)
      .elementMap()
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const companies: any = Object.fromEntries(result.value);

    return companies;
  }

  /**
   * Fetches all companies in the given sector
   * with pagination
   * @param {string} industry
   * @param {number} limit
   * @param {number} offset
   */
  async findCompaniesByIndustry(
    industry: string,
    limit: number,
    offset: number
  ) {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.BUSINESS_INDUSTRY, "name", industry)
      .inE(relationships.IN_INDUSTRY)
      .outV()
      .hasLabel(labels.COMPANY)
      .elementMap()
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const companies: any = Object.fromEntries(result.value);

    return companies;
  }

  /**
   * Fetches companies/securities typically in lists together
   * based on the assets the user's is currently watching
   *
   * Probably not very efficient but will optimize later
   * @param {string} user
   * @param {number} limit
   * @param {number} offset
   */
  async findSuggestedCompanies(user: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V(user)
      .outE(relationships.CREATED_LIST)
      .inV()
      .hasLabel(labels.USER_CREATED_LIST)
      .inE(relationships.IN_LIST)
      .outV()
      .as("currently_watching")
      .outE(relationships.IN_LIST)
      .inV()
      .outE(relationships.IN_LIST)
      .inV()
      .where(neq("currently_watching"))
      .dedup()
      .elementMap()
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const companies: any = Object.fromEntries(result.value);

    return companies;
  }

  /**
   * Finds the related companies for a specified company
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async findRelatedCompanies(id: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .as("source")
      .outE(relationships.IN_INDUSTRY)
      .inV()
      .inE(relationships.IN_INDUSTRY)
      .outV()
      .where(neq("source"))
      .order(__.count())
      .dedup()
      .elementMap()
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const companies: any = Object.fromEntries(result.value);

    return companies;
  }
}
