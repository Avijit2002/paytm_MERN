import express, { Router } from "express";
import authmiddleware from "../middlewares/authmiddleware";
import { asyncFunction } from "../utils/asyncHandler";

import { zodTransferSchema, transferType } from "@avijit2002/zodvalidationandtypes";

import { PrismaClient } from "@prisma/client";
import { responseStatus } from "../utils/statusCode";
const prisma = new PrismaClient()

const router = Router()

interface authRequest extends express.Request {
    userId?: string
}

router.get('/balance', authmiddleware, asyncFunction(async (req: authRequest, res, next) => {

    const account = await prisma.accounts.findMany({
        where: {
            userId: req.userId
        }
    })

    console.log(account[0])

    res.status(responseStatus.success).json({
        message: "success",
        balance: account[0].balance
    })
}))


router.post('/transfer', authmiddleware, asyncFunction(async (req: authRequest, res, next) => {

    const body: transferType = req.body;
    //console.log(typeof(body.amount))  // string

    // issue here  // 

    // const body =JSON.parse(req.body) ;
    // console.log(typeof(body.amount))
    // body.amount = eval(body.amount)


    const userId = req.userId;

    const validation = zodTransferSchema.safeParse(body)
    if (!validation.success) {
        console.log(validation.error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }

    // verifying sender account and balance
    const senderUser = await prisma.users.findUnique({
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
    })

    if (!senderUser?.id) {
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }

    const isSufficient = senderUser.accounts[0].balance >= body.amount

    if (!isSufficient) {
        return res.status(responseStatus.incorrectInput).json({
            message: "Insufficient Balance!"
        })
    }

    // verifing receiver account details
    const receiverUser = await prisma.users.findUnique({
        where: {
            username: body.tousername
        },
        select: {
            id: true,
            accounts: {
                select: {
                    id: true
                }
            }
        }
    })

    if (!receiverUser?.id) {
        return res.status(responseStatus.incorrectInput).json({
            message: "Invalid Account"
        })
    }

    // https://www.prisma.io/docs/orm/prisma-client/queries/transactions
    // tx is a prisma client passed as an argument in callback 
    try {
        const transferResult = await prisma.$transaction(async (tx) => {

            const sender = await tx.accounts.update({
                data: {
                    balance: {
                        decrement: body.amount,
                    }
                },
                where: {
                    id: senderUser.accounts[0].id
                }
            })

            if (sender.balance < 0) {
                throw new Error('insufficent balance')
            }

            const receiver = tx.accounts.update({
                data: {
                    balance: {
                        increment: body.amount
                    }
                },
                where: {
                    id: receiverUser.accounts[0].id
                }
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Transaction failed!"
        })
    }

    return res.status(responseStatus.success).json({
        message: "Transaction success!"
    })



}))

export default router