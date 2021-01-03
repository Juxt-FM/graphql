const { AnalysisAPI } = require("../analysis");

const mocks = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

const ds = new AnalysisAPI();

ds.get = mocks.get;

describe("sample", () => {
  it("should do nothing", () => {
    expect(typeof "string").toEqual("string");
  });
});
