/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

import { NextFunction, Request, Response } from "express";

export const authErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    if (err.message === "jwt expired")
      res.status(401).send({ error: { message: "Token expired." } });
    else res.status(401).send({ error: { message: "Invalid token." } });
  } else next();
};
