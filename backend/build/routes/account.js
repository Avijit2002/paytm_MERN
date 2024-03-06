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
const authmiddleware_1 = __importDefault(require("../middlewares/authmiddleware"));
const asyncHandler_1 = require("../utils/asyncHandler");
const zodvalidationandtypes_1 = require("@avijit2002/zodvalidationandtypes");
const client_1 = require("@prisma/client");
const statusCode_1 = require("../utils/statusCode");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get('/balance', authmiddleware_1.default, (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findUnique({
        where: {
            id: req.userId
        },
        select: {
            id: true,
            username: true,
            accounts: {
                select: {
                    balance: true
                }
            }
        }
    });
    console.log(user);
    res.status(statusCode_1.responseStatus.success).json({
        success: true,
        data: user
    });
})));
router.post('/transfer', authmiddleware_1.default, (0, asyncHandler_1.asyncFunction)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //console.log(typeof(body.amount))  // string
    // issue here  // 
    // const body =JSON.parse(req.body) ;
    // console.log(typeof(body.amount))
    // body.amount = eval(body.amount)
    const userId = req.userId;
    const validation = zodvalidationandtypes_1.zodTransferSchema.safeParse(body);
    if (!validation.success) {
        console.log(validation.error);
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        });
    }
    // verifying sender account and balance
    const senderUser = yield prisma.users.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            accounts: {
                select: {
                    id: true,
                    balance: true
                }
            }
        }
    });
    if (!(senderUser === null || senderUser === void 0 ? void 0 : senderUser.id)) {
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        });
    }
    const isSufficient = senderUser.accounts[0].balance >= body.amount;
    if (!isSufficient) {
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Insufficient Balance!"
        });
    }
    // verifing receiver account details
    const receiverUser = yield prisma.users.findUnique({
        where: {
            username: body.tousername
        },
        select: {
            id: true,
            accounts: {
                select: {
                    id: true,
                    balance: true
                }
            }
        }
    });
    if (!(receiverUser === null || receiverUser === void 0 ? void 0 : receiverUser.id)) {
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Invalid Account"
        });
    }
    console.log(senderUser.accounts[0].balance, receiverUser.accounts[0].balance);
    // https://www.prisma.io/docs/orm/prisma-client/queries/transactions
    // tx is a prisma client passed as an argument in callback 
    try {
        const transferResult = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const sender = yield tx.accounts.update({
                data: {
                    balance: {
                        decrement: body.amount,
                    }
                },
                where: {
                    id: senderUser.accounts[0].id
                }
            });
            if (sender.balance < 0) {
                throw new Error('insufficent balance');
            }
            const receiver = yield tx.accounts.update({
                data: {
                    balance: {
                        increment: body.amount
                    }
                },
                where: {
                    id: receiverUser.accounts[0].id
                }
            });
        }));
    }
    catch (error) {
        console.log(error);
        return res.status(statusCode_1.responseStatus.incorrectInput).json({
            message: "Transaction failed!"
        });
    }
    return res.status(statusCode_1.responseStatus.success).json({
        success: true,
        message: "Transaction success!"
    });
})));
exports.default = router;
