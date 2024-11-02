import "zod-openapi/extend";

import { db } from "./common/db/db";
import { app, logger } from "./app";
import { apiConfig } from "./common/utils/configs";

const server = app.listen(apiConfig.port, () => {
  logger.info(`Server running on http://${apiConfig.host}:${apiConfig.port}`);
});

const shutDown = () => {
  logger.info("Shutting down...");
  server.close(() => {
    db.destroy();
  });
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
