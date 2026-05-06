import "dotenv/config";

import { env } from "./src/config/env";
import { disconnectDB } from "./src/db/connectDB";
import { connectDB } from "./src/db/connectDB";
import { app } from "./src/server";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

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
