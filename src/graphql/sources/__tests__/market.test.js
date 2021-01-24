/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { MarketAPI } = require("../market");

const mockMarketService = require("../../../services/__mocks__/market");
const {
  mockCompany,
  mockList,
  mockIndustry,
  mockSector,
} = require("../../../database/__mocks__/market");

const mockContext = {
  user: { id: "1", profile: "2", verified: true },
  host: "127.0.0.1",
  marketService: mockMarketService,
};

const ds = new MarketAPI();

ds.initialize({ context: mockContext });

test("getListsByAuthor - should return a user's lists", async () => {
  mockMarketService.getListsByAuthor.mockReturnValueOnce([mockList]);

  const result = await ds.getUserLists("1", 10, 0);

  expect(mockMarketService.getListsByAuthor).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockList]);
});

test("getAllSectors - should return a list of sectors", async () => {
  mockMarketService.getAllSectors.mockReturnValueOnce([mockSector]);

  const result = await ds.getAllSectors(10, 0);

  expect(mockMarketService.getAllSectors).toBeCalledWith(10, 0);

  expect(result).toEqual([mockSector]);
});

test("getAllIndustries - should return a list of industries", async () => {
  mockMarketService.getAllIndustries.mockReturnValueOnce([mockIndustry]);

  const result = await ds.getAllIndustries(10, 0);

  expect(mockMarketService.getAllIndustries).toBeCalledWith(10, 0);

  expect(result).toEqual([mockIndustry]);
});

test("getCompaniesBySector - should return a list of companies", async () => {
  mockMarketService.getCompaniesBySector.mockReturnValueOnce([mockCompany]);

  const result = await ds.getCompaniesBySector("tech", 10, 0);

  expect(mockMarketService.getCompaniesBySector).toBeCalledWith("tech", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("getCompaniesByIndustry - should return a list of companies", async () => {
  mockMarketService.getCompaniesByIndustry.mockReturnValueOnce([mockCompany]);

  const result = await ds.getCompaniesByIndustry("tech", 10, 0);

  expect(mockMarketService.getCompaniesByIndustry).toBeCalledWith(
    "tech",
    10,
    0
  );

  expect(result).toEqual([mockCompany]);
});

test("getRelatedCompanies - should return a list of companies", async () => {
  mockMarketService.getRelatedCompanies.mockReturnValueOnce([mockCompany]);

  const result = await ds.getRelatedCompanies("1", 10, 0);

  expect(mockMarketService.getRelatedCompanies).toBeCalledWith("1", 10, 0);

  expect(result).toEqual([mockCompany]);
});

test("getSuggestedCompanies - should return a list of companies", async () => {
  mockMarketService.getSuggestedCompanies.mockReturnValueOnce([mockCompany]);

  const result = await ds.getSuggestedCompanies(10, 0);

  expect(mockMarketService.getSuggestedCompanies).toBeCalledWith(
    mockContext.user.profile,
    10,
    0
  );

  expect(result).toEqual([mockCompany]);
});

test("createList - should create and return a list", async () => {
  mockMarketService.createList.mockReturnValueOnce(mockList);

  const data = {
    name: "Tech",
    private: true,
  };

  const result = await ds.createList(data);

  expect(mockMarketService.createList).toBeCalledWith(
    mockContext.user.profile,
    data
  );

  expect(result).toEqual(mockList);
});

test("updateList - should update and return a list", async () => {
  mockMarketService.updateList.mockReturnValueOnce(mockList);

  const data = {
    name: "Tech",
    private: true,
  };

  const result = await ds.updateList("1", data);

  expect(mockMarketService.updateList).toBeCalledWith(
    "1",
    mockContext.user.profile,
    data
  );

  expect(result).toEqual(mockList);
});

test("deleteList - should update and return a list", async () => {
  mockMarketService.deleteList.mockReturnValueOnce("success");

  const result = await ds.deleteList("1");

  expect(mockMarketService.deleteList).toBeCalledWith(
    "1",
    mockContext.user.profile
  );

  expect(result).toEqual("success");
});
