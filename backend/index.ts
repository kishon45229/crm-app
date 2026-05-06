import "dotenv/config";

import { env } from "./src/config/env";
import { disconnectDB } from "./src/db/connectDB";
import { connectDB } from "./src/db/connectDB";
import { app } from "./src/server";
import { prisma } from "./src/db/prisma";
import { seedDatabase } from "./prisma/seed";

const seedIfNeeded = async (): Promise<void> => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await seedDatabase();
      console.log("Database seeded successfully.");
    } else {
      console.log("Database already seeded, skipping seeding.");
    }
  } catch (error) {
    console.error("Error checking or seeding database:", error);
    throw error;
  }
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    try {
      await seedIfNeeded();
    } catch (seedError) {
      console.error(
        "Seeding failed, but continuing with server start:",
        seedError,
      );
    }

    app.listen(env.PORT, () => {
      console.log(`API listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  try {
    await disconnectDB();
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

void startServer();
