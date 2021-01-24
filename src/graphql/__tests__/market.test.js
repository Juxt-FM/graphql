/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { createTestClient } = require("apollo-server-testing");

const { buildTestServer } = require("./__utils");

const {
  mockSector,
  mockIndustry,
  mockCompany,
  mockList,
} = require("../../database/__mocks__/market");
const { queries, mutations } = require("../__mocks__/market");

test("QUERY sectors", async () => {
  const { server, mockMarketService } = await buildTestServer();

  mockMarketService.getAllSectors.mockReturnValueOnce([mockSector]);

  const { query } = createTestClient(server);
  const res = await query({
    query: queries.SECTORS,
    variables: {
      limit: 10,
      offset: 0,
    },
  });

  const { sectors } = res.data;

  expect(Array.isArray(sectors)).toBe(true);
});

test("QUERY industries", async () => {
  const { server, mockMarketService } = await buildTestServer();

  mockMarketService.getAllIndustries.mockReturnValueOnce([mockIndustry]);

  const { query } = createTestClient(server);
  const res = await query({
    query: queries.INDUSTRIES,
    variables: {
      limit: 10,
      offset: 0,
    },
  });

  const { industries } = res.data;

  expect(Array.isArray(industries)).toBe(true);
});

test("MUTATION createList", async () => {
  const { server, mockMarketService } = await buildTestServer();

  mockMarketService.createList.mockReturnValueOnce(mockList);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.CREATE_LIST,
    variables: {
      data: {
        name: "Tech",
        private: false,
      },
    },
  });

  const { createList } = res.data;

  expect(createList.name).toEqual(mockList.name);
  expect(createList.private).toEqual(mockList.private);
});

test("MUTATION updateList", async () => {
  const { server, mockMarketService } = await buildTestServer();

  mockMarketService.updateList.mockReturnValueOnce(mockList);

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.CREATE_LIST,
    variables: {
      id: "1",
      data: {
        name: "Tech",
        private: false,
      },
    },
  });

  const { updateList } = res.data;

  expect(updateList.name).toEqual(mockList.name);
  expect(updateList.private).toEqual(mockList.private);
});

test("MUTATION deleteList", async () => {
  const { server, mockMarketService } = await buildTestServer();

  mockMarketService.deleteList.mockReturnValueOnce("success");

  const { mutate } = createTestClient(server);
  const res = await mutate({
    mutation: mutations.CREATE_LIST,
    variables: {
      id: "1",
    },
  });

  const { deleteList } = res.data;

  expect(deleteList).toEqual("success");
});
