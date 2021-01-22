/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import nodemailer, { TestAccount } from "nodemailer";

import Mail from "nodemailer/lib/mailer";

interface INotificationsConfig {
  from: string;
}

/**
 * Notification service (email, sms, etc.)
 * @param {INotificationsConfig} config
 */
export class NotificationService {
  config: INotificationsConfig;
  account: TestAccount;
  transporter: Mail;

  constructor(config: INotificationsConfig) {
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
   * TODO - Use an html template for all emails
   * @param {string[]} to
   * @param {string} subject
   * @param {string} text
   */
  async sendEmail(to: string[], subject: string, text: string) {
    // eslint-disable-next-line no-console
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
   * @param {string} to
   * @param {string} message
   */
  async sendSMS(to: string[], message: string) {
    // eslint-disable-next-line no-console
    console.log(`Sending sms: '${message}' to ${to.join(", ")}.`);
  }
}
