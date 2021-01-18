/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { ProfileService } = require("../profiles");

const { mockProfile } = require("../../db/__mocks__/profile");

const mockDbHandler = {
  findById: jest.fn(),
};

const service = new ProfileService(mockDbHandler);

test("getById - should return a user's profile", async () => {
  mockDbHandler.findById.mockReturnValueOnce(mockProfile);

  const result = await service.getById(mockProfile.id);

  expect(mockDbHandler.findById).toHaveBeenLastCalledWith(mockProfile.id);
  expect(result).toEqual(mockProfile);
});
