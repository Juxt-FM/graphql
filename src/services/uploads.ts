/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { S3 } from "aws-sdk";

/**
 * File upload service for AWS S3
 *
 * We used pre-signed URL's to allow the client
 * to upload images/videos directly to S3 without going
 * throw this server
 *
 * @param {S3} s3
 */
export class FileUploadService {
  private s3: S3;

  constructor(s3: S3) {
    this.s3 = s3;
  }

  /**
   * Returns a pre-signed S3 URL for the client
   * to upload a file to
   * @param bucket
   * @param key
   */
  async getFileUploadURL(bucket: string, key: string, expires?: number) {
    const options = {
      Bucket: bucket,
      Key: key,
      Expires: expires || 30,
    };

    return await this.s3.getSignedUrlPromise("putObject", options);
  }
}
