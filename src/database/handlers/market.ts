/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import gremlin from "gremlin";
import moment from "moment";

import GraphDB from "..";

import BaseHandler from "./base";
import { IList, labels, relationships } from "../constants";
import { ResourceNotFoundError } from "../errors";

const {
  statics: __,
  P: { neq },
} = gremlin.process;

export interface IListInput {
  name: string;
  private: boolean;
}

/**
 * Company database handler.
 * @param {GraphDB} graph
 */
export class MarketHandler extends BaseHandler {
  constructor(graph: GraphDB) {
    super(graph);
  }

  /**
   * Transforms a list object
   * @param list
   */
  transformList(list: IList) {
    return {
      ...list,
      created: moment(list.created).toDate(),
      updated: moment(list.updated).toDate(),
    };
  }

  /**
   * Returns a user's list
   * @param {string} author
   * @param {number} limit
   * @param {number} offset
   */
  async findListsByAuthor(author: string, limit: number, offset: number) {
    const query = this.graph.query();

    const result = await query
      .V(author)
      .out(relationships.AUTHORED)
      .hasLabel(labels.LIST)
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((record: any) => {
      const list: any = Object.fromEntries(record);
      return this.transformList(list);
    });
  }

  /**
   * Creates and returns a new list
   * @param {string} author
   * @param {IListInput} data
   */
  async createList(author: string, data: IListInput) {
    const query = this.graph.query();

    const result = await query
      .V(author)
      .as("author")
      .addV(labels.LIST)
      .as("list")
      .property("name", data.name)
      .property("private", data.private)
      .property("created", moment().valueOf())
      .property("updated", moment().valueOf())
      .addE(relationships.AUTHORED)
      .from_("author")
      .to("list")
      .select("list")
      .elementMap()
      .next();

    const list: any = Object.fromEntries(result.value);

    return this.transformList(list);
  }

  /**
   * Updates and returns a list
   * @param {string} id
   * @param {string} author
   * @param {IListInput} data
   */
  async updateList(id: string, author: string, data: IListInput) {
    const query = this.graph.query();

    const result = await query
      .V(id)
      .hasLabel(labels.LIST)
      .where(__.in_(relationships.AUTHORED).hasId(author))
      .property("name", data.name)
      .property("private", data.private)
      .property("updated", moment().valueOf())
      .elementMap()
      .next();

    const list: any = Object.fromEntries(result.value);

    return this.transformList(list);
  }

  /**
   * Deletes a list
   * @param {string} id
   * @param {string} author
   */
  async deleteList(id: string, author: string) {
    const query = this.graph.query();

    await query
      .V(id)
      .hasLabel(labels.LIST)
      .where(__.in_(relationships.AUTHORED).hasId(author))
      .drop()
      .next();
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
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((record: any) => Object.fromEntries(record));
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
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((record: any) => Object.fromEntries(record));
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
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((company: any) => Object.fromEntries(company));
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
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((company: any) => Object.fromEntries(company));
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
      .hasLabel(labels.LIST)
      .inE(relationships.IN_LIST)
      .outV()
      .as("currently_watching")
      .outE(relationships.IN_LIST)
      .inV()
      .outE(relationships.IN_LIST)
      .inV()
      .where(neq("currently_watching"))
      .dedup()
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((company: any) => Object.fromEntries(company));
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
      .range(offset, limit)
      .elementMap()
      .toList();

    return result.map((company: any) => Object.fromEntries(company));
  }
}
