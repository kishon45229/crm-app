import "dotenv/config";

import { env } from "./src/config/env";
import { app } from "./src/server";

const startServer = async (): Promise<void> => {
  try {
    // await connectDB();

    app.listen(env.PORT, () => {
      console.log(`API listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();