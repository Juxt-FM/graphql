/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const AWS = require("aws-sdk");
const { MediaService } = require("../media");

jest.mock("aws-sdk");

const mockConfig = {
  bucket: "test",
};

const s3 = new AWS.S3();

const service = new MediaService(s3, mockConfig);

test("buildParams - should correctly build params", () => {
  const params = service.buildParams({ key: "test-key", maxContentLength: 2 });

  const expected = {
    Bucket: mockConfig.bucket,
    Fields: {
      key: "test-key",
    },
    Expires: 300,
    Conditions: [["content-length-range", 0, 2]],
  };

  expect(params).toEqual(expected);
});

test("getResourceURL - should output correct full path to a resource", () => {
  const key = "test-key";

  const url = service.getResourceURL(key);

  const expected = `https://${mockConfig.bucket}.s3.amazonaws.com/${key}`;

  expect(url).toEqual(expected);
});

test("getSignedProfileUpload - should output a signed POST request", async () => {
  s3.createPresignedPost = jest.fn();
  s3.createPresignedPost.mockImplementationOnce((_, callback) =>
    callback(undefined, mockURLOutput)
  );

  const user = "some_user_uuid";

  const url = await service.getSignedProfileUpload(user);

  expect(url).toEqual(mockURLOutput);
  expect(s3.createPresignedPost).toBeCalledWith(
    {
      Bucket: mockConfig.bucket,
      Fields: {
        key: expect.stringContaining(user),
      },
      Expires: 300,
      Conditions: [["content-length-range", 0, 512000]],
    },
    expect.any(Function)
  );
});

test("getSignedCoverUpload - should output a signed POST request", async () => {
  s3.createPresignedPost = jest.fn();
  s3.createPresignedPost.mockImplementationOnce((_, callback) =>
    callback(undefined, mockURLOutput)
  );

  const user = "some_user_uuid";

  const url = await service.getSignedCoverUpload(user);

  expect(url).toEqual(mockURLOutput);
  expect(s3.createPresignedPost).toBeCalledWith(
    {
      Bucket: mockConfig.bucket,
      Fields: {
        key: expect.stringContaining(user),
      },
      Expires: 300,
      Conditions: [["content-length-range", 0, 1024000]],
    },
    expect.any(Function)
  );
});

const mockURLOutput = {
  url: "https://s3.us-east-1.amazonaws.com/test-bucket",
  fields: {
    key: "test-key",
    bucket: "test-bucket",
  },
};
