/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import mongoose, { Schema, Model, Document } from "mongoose";
import { uid } from "rand-token";

export interface IRefreshToken {
  user: string;
  token: string;
  issuedBy: string;
  issuedAt: Date;
  revokedReason?: string;
  revokedBy?: string;
  revokedAt?: Date;
  expiresAt: Date;
  isExpired: boolean;
  isRevoked: boolean;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

export interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {}

const RefreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      default: () => uid(256),
    },
    issuedBy: {
      type: String,
      trim: true,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    revokedReason: {
      type: String,
      enum: ["logout", "replaced", "expired"],
    },
    revokedBy: {
      type: Schema.Types.ObjectId,
      ref: "RefreshToken",
    },
    revokedAt: Date,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    collection: "refresh_tokens",
  }
);

RefreshTokenSchema.index({ token: 1, issuedBy: 1 });

RefreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() > this.expiresAt;
});

RefreshTokenSchema.virtual("isRevoked").get(function () {
  return typeof this.revokedAt === undefined;
});

export default mongoose.model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
