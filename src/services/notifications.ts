/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import nodemailer, { TestAccount } from "nodemailer";

import Mail from "nodemailer/lib/mailer";

interface INotificationServiceConfig {
  from: string;
}

export class NotificationService {
  config: INotificationServiceConfig;
  account: TestAccount;
  transporter: Mail;

  constructor(config: INotificationServiceConfig) {
    this.config = config;
  }

  /**
   * Initializes the mailing account and transporter
   */
  async initialize() {
    this.account = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: this.account.user,
        pass: this.account.pass,
      },
    });
  }

  /**
   * Sends email to a list of recipients
   *
   * TODO - Use an html template for all emails
   * @param to
   * @param subject
   * @param text
   */
  async sendEmail(to: string[], subject: string, text: string) {
    // tslint:disable-next-line:no-console
    console.log(`Sending email: '${text}' to ${to.join(", ")}.`);

    return await this.transporter.sendMail({
      from: this.config.from,
      to: to.join(", "),
      subject,
      text,
    });
  }

  /**
   * Sends sms to a list of recipients
   *
   * @param to
   * @param message
   */
  async sendSMS(to: string[], message: string) {
    // tslint:disable-next-line:no-console
    console.log(`Sending sms: '${message}' to ${to.join(", ")}.`);
  }
}
