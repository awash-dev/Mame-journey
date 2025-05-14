// lib/prisma.js
import { PrismaClient } from "@prisma/client";

// Extend the NodeJS.Global interface to include the prisma property
declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }

  // Add the prisma property to the global object
  var prisma: PrismaClient | undefined;
}

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
