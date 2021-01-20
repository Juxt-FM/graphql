/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import AWS from "aws-sdk";
import { PresignedPost } from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

interface IMediaConfig {
  bucket: string;
}

interface IParams {
  key: string;
  expires?: number;
  maxContentLength?: number;
}

/**
 * Profile service (post authors, public profiles, etc.)
 * @param {IBuckets} buckets
 */
export class MediaService {
  s3: AWS.S3;
  bucket: string;

  constructor(s3: AWS.S3, { bucket }: IMediaConfig) {
    this.s3 = s3;
    this.bucket = bucket;
  }

  /**
   * Promisified AWS function to get a presigned POST request
   * to our media bucket
   * @param {AWS.S3.PresignedPost.Params} options
   */
  private createPresignedPost(
    options: AWS.S3.PresignedPost.Params
  ): Promise<PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(options, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  /**
   * Returns AWS pre-signed POST params
   * @param {string} key
   * @param {number} expires
   * @param {number} maxContentLength
   */
  private buildParams({
    key,
    expires = 300,
    maxContentLength = 512000,
  }: IParams): AWS.S3.PresignedPost.Params {
    return {
      Bucket: this.bucket,
      Fields: {
        key,
      },
      Expires: expires,
      Conditions: [["content-length-range", 0, maxContentLength]],
    };
  }

  /**
   * Returns the URL to the S3 bucket holding a key
   * @param {string} key
   */
  getResourceURL(key: string) {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  /**
   * Returns a pre-signed AWS S3 url for the client to upload
   * the image to
   * @param {string} id
   */
  async getSignedProfileUpload(id: string) {
    const key = `profile:${uuidv4()}:${id}`;

    const params = this.buildParams({ key });

    return await this.createPresignedPost(params);
  }

  /**
   * Returns a pre-signed AWS S3 url for the client to upload
   * the image to
   * @param {string} id
   */
  async getSignedCoverUpload(id: string) {
    const key = `cover:${uuidv4()}:${id}`;

    const params = this.buildParams({ key, maxContentLength: 1024000 });

    return await this.createPresignedPost(params);
  }
}
