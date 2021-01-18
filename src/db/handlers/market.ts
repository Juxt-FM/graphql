/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";

import GraphDB from "..";

import BaseHandler from "./base";
import { labels, relationships } from "../constants";
import { ResourceNotFoundError } from "../errors";

const { statics: __ } = gremlin.process;

/**
 * Company database handler.
 * @param {GraphDB} graph
 */
export class MarketHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);
  }

  // Finds and returns all business sectors
  async findAllSectors() {
    const query = this.graph.query();

    const result = await query
      .V()
      .has(labels.BusinessSector)
      .elementMap()
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
      .has(labels.Company, "symbol", symbol)
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
      .has(labels.BusinessSector, "name", sector)
      .inE(relationships.InSector)
      .outV()
      .hasLabel(labels.Company)
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .elementMap()
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
      .has(labels.BusinessIndustry, "name", industry)
      .inE(relationships.InIndustry)
      .outV()
      .hasLabel(labels.Company)
      .fold()
      .by(__.range(__.local, limit + offset, offset))
      .elementMap()
      .next();

    if (!result.value) throw new ResourceNotFoundError();

    const companies: any = Object.fromEntries(result.value);

    return companies;
  }
}
