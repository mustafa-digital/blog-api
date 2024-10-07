/**
 * -------------- CLIENT ----------------
 * This module initializes the prisma client and exports it so that any other module that requires connecting to the database can import this client
 * The client is first initialized in app.js on start up
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;
