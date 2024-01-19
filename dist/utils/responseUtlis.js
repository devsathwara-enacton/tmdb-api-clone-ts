"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
function sendResponse(res, StatusCodes, data) {
    return res.status(StatusCodes).json({ data });
}
exports.sendResponse = sendResponse;
exports.default = sendResponse;
