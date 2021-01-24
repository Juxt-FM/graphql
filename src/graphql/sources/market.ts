/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { BaseAPI } from "./base";

import { ListInput } from "../types";

export class MarketAPI extends BaseAPI {
  constructor() {
    super();
  }

  /**
   * Returns a profile's lists
   * @param {string} user
   * @param {number} limit
   * @param {number} offset
   */
  async getUserLists(user: string, limit: number, offset: number) {
    return this.handler("getUserLists", async () => {
      const { marketService } = this.context;

      return await marketService.getListsByAuthor(user, limit, offset);
    });
  }

  /**
   * Returns all business sectors
   * @param {number} limit
   * @param {number} offset
   */
  async getAllSectors(limit: number, offset: number) {
    return this.handler("getAllSectors", async () => {
      const { marketService } = this.context;

      return await marketService.getAllSectors(limit, offset);
    });
  }

  /**
   * Returns all business industries
   * @param {number} limit
   * @param {number} offset
   */
  async getAllIndustries(limit: number, offset: number) {
    return this.handler("getAllIndustries", async () => {
      const { marketService } = this.context;

      return await marketService.getAllIndustries(limit, offset);
    });
  }

  /**
   * Returns all companies in a sector
   * @param {string} sector
   * @param {number} limit
   * @param {number} offset
   */
  async getCompaniesBySector(sector: string, limit: number, offset: number) {
    return this.handler("getCompaniesBySector", async () => {
      const { marketService } = this.context;

      return await marketService.getCompaniesBySector(sector, limit, offset);
    });
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
    return this.handler("getCompaniesByIndustry", async () => {
      const { marketService } = this.context;

      return await marketService.getCompaniesByIndustry(
        industry,
        limit,
        offset
      );
    });
  }

  /**
   * Returns all suggested companies for the logged in user
   * @param {number} limit
   * @param {number} offset
   */
  async getSuggestedCompanies(limit: number, offset: number) {
    return this.handler("getSuggestedCompanies", async () => {
      const { user, marketService } = this.context;

      return await marketService.getSuggestedCompanies(
        user.profile,
        limit,
        offset
      );
    });
  }

  /**
   * Returns all companies in relation to another
   * @param {string} id
   * @param {number} limit
   * @param {number} offset
   */
  async getRelatedCompanies(id: string, limit: number, offset: number) {
    return this.handler("getRelatedCompanies", async () => {
      const { marketService } = this.context;

      return await marketService.getRelatedCompanies(id, limit, offset);
    });
  }

  /**
   * Creates and returns a new list
   * @param {ListInput} data
   */
  async createList(data: ListInput) {
    return this.handler("createList", async () => {
      const { user, marketService } = this.context;

      return await marketService.createList(user.profile, data);
    });
  }

  /**
   * Updates and returns a list
   * @param {string} id
   * @param {ListInput} data
   */
  async updateList(id: string, data: ListInput) {
    return this.handler("updateList", async () => {
      const { user, marketService } = this.context;

      return await marketService.updateList(id, user.profile, data);
    });
  }

  /**
   * Deletes a list
   * @param {string} id
   */
  async deleteList(id: string) {
    return this.handler("deleteList", async () => {
      const { user, marketService } = this.context;

      return await marketService.deleteList(id, user.profile);
    });
  }
}
