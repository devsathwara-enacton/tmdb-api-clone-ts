"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
exports.router = express_1.default.Router();
exports.router.get("/fetch/", controllers_1.movies.display);
exports.router.get("/:mid", controllers_1.movies.fetch);
exports.router.get("/country-revenues", controllers_1.movies.countriesRevenue);
exports.router.get("/revenue", controllers_1.movies.fetchIncome);
// export default router;
