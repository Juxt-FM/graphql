/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import mongoose, { Schema, Model, Document } from "mongoose";

import { validateEmail, validatePhone } from "./validators";

import { ProfileSchema, IUserProfile, IUserProfileDocument } from "./profile";

export interface IUser {
  _id: any;
  email: {
    address: string;
    verified: boolean;
  };
  phone?: {
    number: string;
    verified: boolean;
  };
  emailAddress: string;
  phoneNumber?: string;
  password: string;
  profile: IUserProfile;
  active: boolean;
  verified: boolean;
  suspended: boolean;
  deactivated: boolean;
  lastLogin: Date;
  updatedAt: Date;
  createdAt: Date;
  deactivatedAt?: Date;
}

export interface ProfileOverride extends IUser {
  profile: IUserProfileDocument;
}

export interface IUserDocument extends ProfileOverride, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const PhoneSchema = new Schema(
  {
    number: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      validate: {
        validator: validatePhone,
        message: "Please enter a valid phone number",
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "user_email_addresses" }
);

const EmailSchema = new Schema(
  {
    address: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "An email address is required."],
      validate: {
        validator: validateEmail,
        message: "Please enter a valid email address.",
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "user_phone_numbers" }
);

const UserSchema = new Schema(
  {
    email: {
      type: EmailSchema,
      required: [true, "An email address is required."],
    },
    phone: PhoneSchema,
    password: {
      type: String,
      trim: true,
      required: true,
    },
    profile: ProfileSchema,
    active: {
      type: Boolean,
      default: true,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    deactivated: {
      type: Boolean,
      default: false,
    },
    deactivatedAt: {
      type: Date,
      expires: "30d",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

UserSchema.virtual("emailAddress").get(function () {
  return this.email.address;
});

UserSchema.virtual("phoneNumber").get(function () {
  if (this.phone) return this.phone.number;
  return null;
});

UserSchema.virtual("verified").get(function () {
  if (this.email) return this.email.verified;
  else return this.phone.verified;
});

UserSchema.pre<IUserDocument>("save", function (next) {
  this.profile._id = this._id;

  if (this.isModified("email.address")) {
    this.email.address = this.email.address.toLowerCase();
    this.email.verified = false;
  }

  if (this.isModified("phone.number")) this.phone.verified = false;

  next();
});

export default mongoose.model<IUserDocument>("User", UserSchema);
