"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusCode_1 = require("../utils/statusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
//import { User } from "../db";
const zodvalidationandtypes_1 = require("@avijit2002/zodvalidationandtypes");
//import { successApiResponse } from "../utils/successResponse";
const authmiddleware_1 = __importDefault(require("../middlewares/authmiddleware"));
const asyncHandler_1 = require("../utils/asyncHandler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const router = (0, express_1.Router)();
router.post('/signup', (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const {firstName, lastName, userName, password } = req.body
    const body = req.body;
    //const body = req.body
    //Zod validation
    const validation = zodvalidationandtypes_1.zodSignupSchema.safeParse(body);
    if (!validation.success) {
        console.log(validation.error.message);
        res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
            //message:validation.error.message
        });
        return;
    }
    //creating user in DB
    const dbUser = yield prisma.users.findUnique({
        where: {
            username: body.username,
        },
    });
    if (dbUser === null || dbUser === void 0 ? void 0 : dbUser.id) {
        console.log("2");
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const user = yield prisma.users.create({
        data: body
    });
    if (!user.id) {
        throw new Error("User creation failed");
    }
    const account = yield prisma.accounts.create({
        data: {
            balance: Math.random() * 100,
            userId: user.id
        }
    });
    if (!account.id) {
        throw new Error("User account creation failed");
    }
    //creating jwt token 
    if (!JWT_SECRET) {
        throw new Error("JWT secret undefined");
    }
    let token;
    token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
    res.status(statusCode_1.responseStatus.success).json({
        success: true,
        message: "User created successfully",
        token: token
    });
    //successApiResponse(responseStatus.success, token) 
})));
router.post('/signin', (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const username = req.body.username;
    // const password = req.body.password;
    const body = req.body;
    const validation = zodvalidationandtypes_1.zodSigninSchema.safeParse(body);
    if (!validation.success) {
        //console.log(validation.error)
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        });
    }
    const dbUser = yield prisma.users.findUnique({
        where: {
            username: body.username,
            password: body.password
        }
    });
    if (!(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id)) {
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        });
    }
    //creating jwt token 
    if (!JWT_SECRET) {
        throw new Error("JWT token undefined");
    }
    let token;
    token = jsonwebtoken_1.default.sign({ userId: dbUser.id }, JWT_SECRET);
    res.status(statusCode_1.responseStatus.success).json({
        success: true,
        message: "Signin successfully",
        token: token
    });
})));
router.put('/update', authmiddleware_1.default, (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //console.log(body)
    const validation = zodvalidationandtypes_1.zodUpdateSchema.safeParse(body);
    if (!validation.success) {
        //console.log(validation.error)
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        });
    }
    //console.log(req.userId)
    const update = yield prisma.users.update({
        where: {
            id: req.userId
        },
        data: body
    });
    console.log(update);
    res.status(statusCode_1.responseStatus.success).json({
        success: true,
        message: "Info updated successfully",
    });
})));
// filtering users based on query, query can be 1st name, last name or username
router.get('/bulk', authmiddleware_1.default, (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.filter;
    console.log(query);
    const data = yield prisma.users.findMany({
        where: {
            OR: [
                {
                    username: {
                        startsWith: query,
                        mode: 'insensitive'
                    }
                },
                {
                    firstname: {
                        startsWith: query,
                        mode: 'insensitive'
                    }
                },
                {
                    lastname: {
                        startsWith: query,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });
    console.log(data);
    res.status(statusCode_1.responseStatus.success).json({
        success: true,
        data: data.map(x => {
            return {
                firstname: x.firstname,
                lastname: x.lastname,
                username: x.username
            };
        })
    });
})));
exports.default = router;
