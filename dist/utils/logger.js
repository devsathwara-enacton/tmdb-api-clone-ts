"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = "logs";
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const logFile = path_1.default.join(logDir, "errors.log");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message, meta }) => {
        console.log(meta);
        return `${timestamp} [${level}]: ${message} ${meta ? JSON.stringify(meta) : ""}`;
    })),
    transports: [
        new winston_1.default.transports.File({ filename: logFile, level: "error" }),
    ],
});
exports.default = logger;
