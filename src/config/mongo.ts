/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

const host = process.env.DB_HOST;

const port = process.env.DB_PORT;

const name = process.env.DB_NAME;

export const uri = `mongodb://${host}:${port}/${name}`;

export const user = process.env.DB_USER;

export const password = process.env.DB_PASS;
