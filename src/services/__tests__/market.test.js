/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { MarketService } = require("../market");

const {
  mockCompany,
  mockList,
  mockIndustry,
  mockSector,
} = require("../../database/__mocks__/market");

const mockDbHandler = {
  findListsByAuthor: jest.fn(),
  findAllSectors: jest.fn(),
  findAllIndustries: jest.fn(),
  findCompanyBySymbol: jest.fn(),
  findCompaniesBySector: jest.fn(),
  findCompaniesByIndustry: jest.fn(),
  findRelatedCompanies: jest.fn(),
  findSuggestedCompanies: jest.fn(),
  createList: jest.fn(),
  updateList: jest.fn(),
  deleteList: jest.fn(),
};

const service = new MarketService(mockDbHandler);

test("getListsByAuthor - should return a user's lists", async () => {
  mockDbHandler.findListsByAuthor.mockReturnValueOnce([mockList]);

  const result = await service.getListsByAuthor("1", 10, 0);

  expect(mockDbHandler.findListsByAuthor).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockList]);
});

test("getAllSectors - should return a list of sectors", async () => {
  mockDbHandler.findAllSectors.mockReturnValueOnce([mockSector]);

  const result = await service.getAllSectors(10, 0);

  expect(mockDbHandler.findAllSectors).toBeCalledWith(10, 0);

  expect(result).toEqual([mockSector]);
});

test("getAllIndustries - should return a list of industries", async () => {
  mockDbHandler.findAllIndustries.mockReturnValueOnce([mockIndustry]);

  const result = await service.getAllIndustries(10, 0);

  expect(mockDbHandler.findAllIndustries).toBeCalledWith(10, 0);

  expect(result).toEqual([mockIndustry]);
});

test("getCompaniesBySector - should return a list of companies", async () => {
  mockDbHandler.findCompaniesBySector.mockReturnValueOnce([mockCompany]);

  const result = await service.getCompaniesBySector("tech", 10, 0);

  expect(mockDbHandler.findCompaniesBySector).toBeCalledWith("tech", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("getCompaniesByIndustry - should return a list of companies", async () => {
  mockDbHandler.findCompaniesByIndustry.mockReturnValueOnce([mockCompany]);

  const result = await service.getCompaniesByIndustry("tech", 10, 0);

  expect(mockDbHandler.findCompaniesByIndustry).toBeCalledWith("tech", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("getRelatedCompanies - should return a list of companies", async () => {
  mockDbHandler.findRelatedCompanies.mockReturnValueOnce([mockCompany]);

  const result = await service.getRelatedCompanies("1", 10, 0);

  expect(mockDbHandler.findRelatedCompanies).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("getSuggestedCompanies - should return a list of companies", async () => {
  mockDbHandler.findSuggestedCompanies.mockReturnValueOnce([mockCompany]);

  const result = await service.getSuggestedCompanies("1", 10, 0);

  expect(mockDbHandler.findSuggestedCompanies).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("createList - should create and return a list", async () => {
  mockDbHandler.createList.mockReturnValueOnce(mockList);

  const data = {
    name: "Tech",
    private: true,
  };

  const result = await service.createList("1", data);

  expect(mockDbHandler.createList).toBeCalledWith("1", data);

  expect(result).toEqual(mockList);
});

test("updateList - should update and return a list", async () => {
  mockDbHandler.updateList.mockReturnValueOnce(mockList);

  const data = {
    name: "Tech",
    private: true,
  };

  const result = await service.updateList("1", "1", data);

  expect(mockDbHandler.updateList).toBeCalledWith("1", "1", data);

  expect(result).toEqual(mockList);
});

test("deleteList - should update and return a list", async () => {
  const result = await service.deleteList("1", "1");

  expect(mockDbHandler.deleteList).toBeCalledWith("1", "1");

  expect(typeof result).toEqual("string");
});
