const {
  default: { Mutation, Query },
} = require("../market");

const mockMarketAPI = require("../../sources/__mocks__/market");
const {
  mockCompany,
  mockSector,
  mockIndustry,
  mockList,
} = require("../../../database/__mocks__/market");

const context = {
  user: { id: "1", profile: "2", verified: true },
  dataSources: {
    market: mockMarketAPI,
  },
};

test("MUTATION createList", async () => {
  mockMarketAPI.createList.mockReturnValueOnce(mockList);

  const args = {
    data: {
      name: "Test list",
      private: false,
    },
  };

  const result = await Mutation.createList(undefined, args, context);

  expect(mockMarketAPI.createList).toBeCalledWith(args.data);
  expect(result).toEqual(mockList);
});

test("MUTATION updateList", async () => {
  mockMarketAPI.updateList.mockReturnValueOnce(mockList);

  const args = {
    id: "1",
    data: {
      name: "Test list",
      private: false,
    },
  };

  const result = await Mutation.updateList(undefined, args, context);

  expect(mockMarketAPI.updateList).toBeCalledWith(args.id, args.data);
  expect(result).toEqual(mockList);
});

test("MUTATION deleteList", async () => {
  mockMarketAPI.deleteList.mockReturnValueOnce(mockList);

  const args = { id: "1" };

  const result = await Mutation.deleteList(undefined, args, context);

  expect(mockMarketAPI.deleteList).toBeCalledWith(args.id);
  expect(result).toEqual(mockList);
});

test("QUERY sectors", async () => {
  mockMarketAPI.getAllSectors.mockReturnValueOnce([mockSector]);

  const args = { limt: 10, offset: 0 };

  const result = await Query.sectors(undefined, args, context);

  expect(mockMarketAPI.getAllSectors).toBeCalledWith(args.limit, args.offset);
  expect(result).toEqual([mockSector]);
});

test("QUERY industries", async () => {
  mockMarketAPI.getAllIndustries.mockReturnValueOnce([mockSector]);

  const args = { limt: 10, offset: 0 };

  const result = await Query.industries(undefined, args, context);

  expect(mockMarketAPI.getAllIndustries).toBeCalledWith(
    args.limit,
    args.offset
  );
  expect(result).toEqual([mockSector]);
});
