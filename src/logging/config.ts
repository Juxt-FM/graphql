/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { stMonitor, stLogger } from "sematext-agent-express";

export const logInfo = (msg: string) => {
  try {
    stLogger.info(msg);
  } catch {
    // tslint:disable-next-line:no-console
    console.log(`Logger inactive: "${msg}"`);
  }
};

export const logError = (msg: string) => {
  try {
    stLogger.error(msg);
  } catch {
    // tslint:disable-next-line:no-console
    console.log(`Logger inactive: "${msg}"`);
  }
};

export const start = () => {
  try {
    stMonitor.start();
  } catch {
    // tslint:disable-next-line:no-console
    console.log("Sematext unavailable.");
  }
};
