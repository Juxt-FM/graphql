/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import mongoose, { Schema, Model, Document } from "mongoose";
import { uid } from "rand-token";

export interface IVerificationCode {
  type: "forgot_password" | "email_verification" | "phone_verification";
  user: string;
  code: string;
  issuedBy: string;
  issuedAt: Date;
  revokedReason?: string;
  revokedBy?: string;
  revokedAt?: Date;
  expiresAt: Date;
  isExpired: boolean;
  isRevoked: boolean;
}

export interface IVerificationCodeDocument
  extends IVerificationCode,
    Document {}

export interface IVerificationCodeModel
  extends Model<IVerificationCodeDocument> {}

const VerificationCodeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["forgot_password", "email_verification", "phone_verification"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      default: () => uid(8).toUpperCase(),
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
      enum: ["replaced", "expired", "verified"],
    },
    revokedBy: String,
    revokedAt: Date,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { collection: "verification_codes" }
);

VerificationCodeSchema.virtual("isExpired").get(function () {
  return Date.now() > this.expiresAt;
});

VerificationCodeSchema.virtual("isRevoked").get(function () {
  return Boolean(this.revokedAt);
});

export default mongoose.model<IVerificationCodeDocument>(
  "VerificationCode",
  VerificationCodeSchema
);
