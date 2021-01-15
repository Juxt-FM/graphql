/**
 * @author Andrew Perera
 * Copyright (C) 2020 - All rights reserved
 */

export const host = process.env.NEO4J_HOST || "neo4j://localhost:7687";

export const user = process.env.NEO4J_USER || "neo4j";

export const password = process.env.NEO4J_PASSWORD || "password";
