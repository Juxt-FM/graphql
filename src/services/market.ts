/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { MarketHandler, IListInput } from "../database";

/**
 * Market service (lists, etc.)
 * @param {MarketHandler} dbHandler
 */
export class MarketService {
  private dbHandler: MarketHandler;

  constructor(dbHandler: MarketHandler) {
    this.dbHandler = dbHandler;
  }

  /**
   * Returns a user's lists
   * @param {string} author
   * @param {number} limit
   * @param {number} offset
   */
  async getListsByAuthor(author: string, limit: number, offset: number) {
    return await this.dbHandler.findListsByAuthor(author, limit, offset);
  }

  /**
   * Returns all business sectors
   * @param {number} limit
   * @param {number} offset
   */
  async getAllSectors(limit: number, offset: number) {
    return await this.dbHandler.findAllSectors(limit, offset);
  }

  /**
   * Returns all business industries
   * @param {number} limit
   * @param {number} offset
   */
  async getAllIndustries(limit: number, offset: number) {
    return await this.dbHandler.findAllIndustries(limit, offset);
  }

  /**
   * Returns a company by it's symbol
   * @param {string} symbol
   */
  async getCompanyBySymbol(symbol: string) {
    return await this.dbHandler.findCompanyBySymbol(symbol);
  }

  /**
   * Returns all companies in a sector
   * @param {string} sector
   * @param {number} limit
   * @param {number} offset
   */
  async getCompaniesBySector(sector: string, limit: number, offset: number) {
    return await this.dbHandler.findCompaniesBySector(sector, limit, offset);
  }

  /**
   * Returns all companies in an industry
   * @param {string} industry
   * @param {number} limit
   * @param {number} offset
   */
  async getCompaniesByIndustry(
    industry: string,
    limit: number,
    offset: number
  ) {
    return await this.dbHandler.findCompaniesByIndustry(
      industry,
      limit,
      offset
    );
  }

  /**
   * Returns related companies
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async getRelatedCompanies(id: string, limit: number, offset: number) {
    return await this.dbHandler.findRelatedCompanies(id, limit, offset);
  }

  /**
   * Returns suggested companies
   * @param {string} user
   * @param {number} limit
   * @param {number} offset
   */
  async getSuggestedCompanies(user: string, limit: number, offset: number) {
    return await this.dbHandler.findSuggestedCompanies(user, limit, offset);
  }

  /**
   * Creates and returns a new list
   * @param {string} author
   * @param {IListInput} data
   */
  async createList(author: string, data: IListInput) {
    return await this.dbHandler.createList(author, data);
  }

  /**
   * Updates and returns a list
   * @param {string} id
   * @param {string} author
   * @param {IListInput} data
   */
  async updateList(id: string, author: string, data: IListInput) {
    return await this.dbHandler.updateList(id, author, data);
  }

  /**
   * Deletes a list
   * @param {string} id
   * @param {string} author
   */
  async deleteList(id: string, author: string) {
    await this.dbHandler.deleteList(id, author);
    return "Successfully deleted list.";
  }
}
