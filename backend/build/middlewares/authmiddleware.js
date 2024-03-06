"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../utils/statusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;
function authmiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(statusCode_1.responseStatus.unauthorized).json({
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!JWT_SECRET) {
        throw new Error("JWT secret key problem");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
            return res.status(statusCode_1.responseStatus.unauthorized).json({
                message: "Invalid Credintials!"
            });
        }
        req.userId = decoded.userId;
        console.log(decoded.userId);
        next();
    }
    catch (error) {
        console.log(Error);
        throw new Error("Invalid Credintials!");
    }
}
exports.default = authmiddleware;
