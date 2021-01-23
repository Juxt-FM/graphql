const {
  default: { Mutation, Query },
} = require("../auth");

const mockAuthAPI = require("../../sources/__mocks__/auth");
const { mockUser } = require("../../../database/__mocks__/auth");

const context = {
  dataSources: {
    auth: mockAuthAPI,
  },
};

test("MUTATION createUser", async () => {
  mockAuthAPI.registerUser.mockReturnValueOnce(mockCredentials);
  const args = {
    data: {
      email: "some@email.com",
      password: "ab12cd34",
      confirmPassword: "ab12cd34",
    },
    device: {
      id: "1",
      platform: "ios",
      model: "iPhone 5s",
    },
  };
  const result = await Mutation.createUser(undefined, args, context);

  expect(mockAuthAPI.registerUser).toBeCalledWith(args.data, args.device);
  expect(result).toEqual(mockCredentials);
});

test("MUTATION loginUser", async () => {
  mockAuthAPI.loginUser.mockReturnValueOnce(mockCredentials);
  const args = {
    data: {
      identifier: "some@email.com",
      password: "ab12cd34",
    },
    device: {
      id: "1",
      platform: "ios",
      model: "iPhone 5s",
    },
  };

  const result = await Mutation.loginUser(undefined, args, context);

  expect(mockAuthAPI.loginUser).toBeCalledWith(args.data, args.device);
  expect(result).toEqual(mockCredentials);
});

test("MUTATION updateEmail", async () => {
  mockAuthAPI.updateEmail.mockReturnValueOnce(mockUser);
  const args = {
    email: "updated@email.com",
  };

  const result = await Mutation.updateEmail(undefined, args, context);

  expect(mockAuthAPI.updateEmail).toBeCalledWith(args.email);
  expect(result).toEqual(mockUser);
});

test("MUTATION updatePhone", async () => {
  mockAuthAPI.updatePhone.mockReturnValueOnce(mockUser);
  const args = {
    phone: "+11234567890",
  };

  const result = await Mutation.updatePhone(undefined, args, context);

  expect(mockAuthAPI.updatePhone).toBeCalledWith(args.phone);
  expect(result).toEqual(mockUser);
});

test("MUTATION verifyEmail", async () => {
  mockAuthAPI.verifyEmail.mockReturnValueOnce(null);

  const args = {
    code: "ABCDEFG",
  };

  const result = await Mutation.verifyEmail(undefined, args, context);

  expect(mockAuthAPI.verifyEmail).toBeCalledWith(args.code);
  expect(result).toEqual(null);
});

test("MUTATION verifyPhone", async () => {
  mockAuthAPI.verifyPhone.mockReturnValueOnce(null);

  const args = {
    code: "ABCDEFG",
  };

  const result = await Mutation.verifyPhone(undefined, args, context);

  expect(mockAuthAPI.verifyPhone).toBeCalledWith(args.code);
  expect(result).toEqual(null);
});

test("MUTATION refreshToken", async () => {
  mockAuthAPI.refreshToken.mockReturnValueOnce(mockCredentials);

  const args = {
    device: "1",
  };

  const result = await Mutation.refreshToken(undefined, args, context);

  expect(mockAuthAPI.refreshToken).toBeCalledWith(args.device);
  expect(result).toEqual(mockCredentials);
});

test("MUTATION logoutUser", async () => {
  mockAuthAPI.logoutUser.mockReturnValueOnce("success");

  const args = {
    device: "1",
  };

  const result = await Mutation.logoutUser(undefined, args, context);

  expect(mockAuthAPI.logoutUser).toBeCalledWith(args.device);
  expect(result).toEqual("success");
});

test("MUTATION resetPassword", async () => {
  mockAuthAPI.resetPassword.mockReturnValueOnce("success");

  const args = {
    password: "ab12cd34",
    confirmPassword: "ab12cd34",
  };

  const result = await Mutation.resetPassword(undefined, args, context);

  expect(mockAuthAPI.resetPassword).toBeCalledWith(args);
  expect(result).toEqual("success");
});

test("MUTATION deactivateAccount", async () => {
  mockAuthAPI.deactivateAccount.mockReturnValueOnce("success");

  const result = await Mutation.deactivateAccount(
    undefined,
    undefined,
    context
  );

  expect(mockAuthAPI.deactivateAccount).toBeCalledTimes(1);
  expect(result).toEqual("success");
});

test("QUERY me", async () => {
  mockAuthAPI.getCurrentUser.mockReturnValueOnce(mockUser);

  const result = await Query.me(undefined, undefined, context);

  expect(mockAuthAPI.getCurrentUser).toBeCalledTimes(1);
  expect(result).toEqual(mockUser);
});

const mockCredentials = {
  accessToken: "fdsjkafhdsajklfhdjsakfhjlksadfaf",
  refreshToken: "sadhfkjasdhfadsjkflashfjasldfhlas",
};
