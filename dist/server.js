"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./src/config/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const server = app_1.default.listen(config_1.default.env.app.port, () => {
    console.log(`Server is running on port ${config_1.default.env.app.port}`);
});
process.on("unhandledRejection", (req, reason) => {
    console.error(req.route + "Unhandled Rejection:", reason);
    // Log the unhandled rejection with additional information
    const routeInfo = { route: global.__currentRoute || "unknown" };
    logger_1.default.error("Unhandled Rejection" + JSON.stringify(reason) + JSON.stringify(routeInfo));
});
