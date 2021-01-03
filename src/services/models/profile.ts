/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { Schema, Model, Document } from "mongoose";

export interface IUserProfile {
  _id: any;
  name?: string;
  location?: string;
  summary?: string;
  imageURL?: string;
  bannerImageURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileDocument extends IUserProfile, Document {}

export interface IUserProfileModel extends Model<IUserProfileDocument> {}

export const ProfileSchema = new Schema(
  {
    name: String,
    location: String,
    summary: String,
    imageURL: String,
    bannerImageURL: String,
    platforms: {
      twitter: String,
    },
  },
  {
    timestamps: true,
    collection: "user_profiles",
  }
);
