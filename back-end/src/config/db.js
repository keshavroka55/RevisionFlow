import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./config.js";

const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
        log: config.isDev ? ["query", "warn", "error"] : ["error"],
    });

if (config.isDev) globalForPrisma.prisma = prisma;



/*
what is hte main use of this file: 
the main reason: 
It creates one single Prisma connection shared across your entire app.

the problems it solves:
Every time Node.js hot-reloads in development, without this code it would create a new database connection each time:
- This can lead to too many open connections and exhaust the database connection limit.
*/