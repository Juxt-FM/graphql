const { ApolloError, UserInputError } = require("apollo-server-express");
const { Error: MongooseError } = require("mongoose");
const { default: BaseService } = require("../base");

const baseConfig = {
  req: {
    headers: {},
    connection: {},
    signedCookies: jest.fn(),
  },
  res: {
    cookie: jest.fn(),
  },
};

const service = new BaseService(baseConfig);

describe("getHost", () => {
  it("should return the request host from remoteAddress", async () => {
    const host = "http://127.0.0.1";
    baseConfig.req.connection.remoteAddress = host;
    const res = service.getHost();

    expect(res).toEqual(host);
  });

  it("should return the request host from x-forwarded-for", async () => {
    const host = "http://127.0.0.1";
    baseConfig.req.headers["x-forwarded-for"] = host;
    const res = service.getHost();

    expect(res).toEqual(host);
  });
});

describe("getDefaultError", () => {
  it("should return an instance of apollo error", async () => {
    const res = service.getDefaultError();

    expect(res instanceof ApolloError).toEqual(true);
  });
});

describe("handleValidationError", () => {
  it("should throw an instance of user input error", async () => {
    const message = "Enter a valid email address";
    const error = {
      errors: {
        email: {
          message,
        },
      },
    };

    expect(() => service.handleValidationError(error)).toThrow(UserInputError);
    expect(() => service.handleValidationError(error)).toThrow(message);
  });
});

describe("handleConstraintError", () => {
  it("should throw an instance of user input error", async () => {
    const error = {
      keyValue: {
        email: "something",
      },
    };

    expect(() => service.handleConstraintError(error)).toThrow(UserInputError);
    expect(() => service.handleConstraintError(error)).toThrow(
      "This email is already in use."
    );
  });
});

describe("handleMutationError", () => {
  it("should handle a validation error", async () => {
    const message = "Invalid email.";

    service.handleValidationError = jest.fn();
    service.handleValidationError.mockImplementation(() => {
      throw new UserInputError(message, { invalidArgs: ["email"] });
    });

    expect(() =>
      service.handleMutationError(new MongooseError.ValidationError())
    ).toThrow(UserInputError);

    expect(() =>
      service.handleMutationError(new MongooseError.ValidationError())
    ).toThrow(message);
  });

  it("should handle a constraint error", async () => {
    const message = "Email in use.";

    service.handleConstraintError = jest.fn();
    service.handleConstraintError.mockImplementation(() => {
      throw new UserInputError(message, { invalidArgs: ["email"] });
    });

    expect(() => service.handleMutationError({ code: 11000 })).toThrow(
      UserInputError
    );

    expect(() => service.handleMutationError({ code: 11000 })).toThrow(message);
  });
});

module.exports = { baseConfig };
