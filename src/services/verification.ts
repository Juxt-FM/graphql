/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { ApolloError } from "apollo-server-express";

import BaseService, { IBaseConfig } from "./base";

import VerificationCodeModel, {
  IVerificationCodeDocument,
  IVerificationCodeModel,
} from "./models/verification-code";

import { IUserDocument } from "./models/user";

export class VerificationService extends BaseService {
  private codeModel: IVerificationCodeModel;

  constructor(baseConfig: IBaseConfig) {
    super(baseConfig);
    this.codeModel = VerificationCodeModel;
  }

  /**
   * Generic handler for the verification of a code
   * @param code
   */
  private async revoke(code: IVerificationCodeDocument) {
    if (code.isRevoked) {
      if (code.revokedReason === "expired")
        throw new ApolloError("Code expired.");
      throw new ApolloError("Invalid code.");
    } else if (code.isExpired) {
      code.revokedAt = new Date();
      code.revokedReason = "expired";
      code.revokedBy = this.getHost();
      await code.save();
      throw new ApolloError("Code expired.");
    } else {
      code.revokedAt = new Date();
      code.revokedReason = "verified";
      code.revokedBy = this.getHost();
    }

    return code;
  }

  /**
   * Creates and returns a new verification code
   * @param user
   * @param type
   */
  async createCode(
    user: IUserDocument,
    type: "forgot_password" | "email_verification" | "phone_verification"
  ) {
    try {
      const code = new this.codeModel({
        user: user.id,
        type,
        issuedAt: new Date(),
        issuedBy: this.getHost(),
      });
      await code.save();

      if (type === "forgot_password") {
        this.response.cookie("forgot_password", code.id, {
          expires: new Date(Date.now() + 10 * 60 * 1000),
          httpOnly: true,
          path: "/",
          signed: true,
        });
      }

      return code;
    } catch (e) {
      throw this.getDefaultError();
    }
  }

  /**
   * Verifies a code given the associated user. If expired, will revoke the code
   * and if it is valid the code will be marked as "verified"
   * @param user
   * @param code
   */
  async email(user: string, code: string) {
    try {
      const codeObj = await this.codeModel.findOne({
        user,
        code,
        type: "email_verification",
      });

      if (codeObj === null) throw new ApolloError("Invalid code.");

      return await this.revoke(codeObj);
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else throw this.getDefaultError();
    }
  }

  /**
   * Verifies a code given the associated user. If expired, will revoke the code
   * and if it is valid the code will be marked as "verified"
   * @param user
   * @param code
   */
  async phone(user: string, code: string) {
    try {
      const codeObj = await this.codeModel.findOne({
        user,
        code,
        type: "phone_verification",
      });

      if (codeObj === null) throw new ApolloError("Invalid code.");

      return await this.revoke(codeObj);
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else throw this.getDefaultError();
    }
  }

  /**
   * Verifies a code given the associated user. If expired, will revoke the code
   * and if it is valid the code will be marked as "verified"
   * @param user
   * @param code
   */
  async otp(code: string) {
    try {
      const codeId = this.request.signedCookies.forgot_password;
      const codeObj = await this.codeModel.findById(codeId);

      if (codeObj ? codeObj.code !== code : true)
        throw new ApolloError("Invalid code.");

      const revoked = await this.revoke(codeObj);

      // delete cookie
      this.response.cookie("forgot_password", undefined, {
        expires: new Date(),
        httpOnly: true,
        path: "/",
        signed: true,
      });

      return revoked;
    } catch (e) {
      if (e instanceof ApolloError) throw e;
      else throw this.getDefaultError();
    }
  }
}
