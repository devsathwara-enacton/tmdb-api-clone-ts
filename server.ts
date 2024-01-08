import app from "./app";
import config from "./src/config/config";
import { Response, Request } from "express";
import logger from "./utils/logger";
const server = app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
process.on("unhandledRejection", (req: Request, reason: any, promise: any) => {
  console.error(req.route + "Unhandled Rejection:", reason);

  // Log the unhandled rejection with additional information
  const routeInfo = { route: (global as any).__currentRoute || "unknown" };
  logger.error(
    "Unhandled Rejection" + JSON.stringify(reason) + JSON.stringify(routeInfo)
  );
});
