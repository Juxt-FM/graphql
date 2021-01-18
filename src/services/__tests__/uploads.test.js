/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const { S3 } = require("aws-sdk");
const { FileUploadService } = require("../uploads");

jest.mock("aws-sdk");

const s3 = new S3();

const service = new FileUploadService(s3);

describe("getFileUploadURL", () => {
  it("should return a URL", async () => {
    const url = "https://127.0.0.1/uploads";

    s3.getSignedUrlPromise = jest.fn();
    s3.getSignedUrlPromise.mockImplementationOnce(() => url);

    const bucket = "some-bucket";
    const key = "new-file-1";

    const result = await service.getFileUploadURL(bucket, key);

    const expectedOptions = {
      Bucket: bucket,
      Key: key,
      Expires: 30,
    };

    expect(s3.getSignedUrlPromise).toBeCalledWith("putObject", expectedOptions);
    expect(result).toEqual(url);
  });

  it("should return a URL with custom expiration", async () => {
    const url = "https://127.0.0.1/uploads";

    s3.getSignedUrlPromise = jest.fn();
    s3.getSignedUrlPromise.mockImplementationOnce(() => url);

    const bucket = "some-bucket";
    const key = "new-file-1";

    const result = await service.getFileUploadURL(bucket, key, 75);

    const expectedOptions = {
      Bucket: bucket,
      Key: key,
      Expires: 75,
    };

    expect(s3.getSignedUrlPromise).toBeCalledWith("putObject", expectedOptions);
    expect(result).toEqual(url);
  });
});
