import express ,{ Router } from "express";
import authmiddleware from "../middlewares/authmiddleware";
import { asyncFunction } from "../utils/asyncHandler";

import { PrismaClient } from "@prisma/client";
import { responseStatus } from "../utils/statusCode";
const prisma = new PrismaClient()

const router = Router()

interface authRequest extends express.Request {
    userId?: string
}

router.get('/balance', authmiddleware, asyncFunction(async (req:authRequest, res, next) => {

    const account = await prisma.accounts.findMany({
        where:{
            userId:req.userId
        }
    })

    console.log(account[0])

    res.status(responseStatus.success).json({
        message: "success",
        data: account[0].balance
    })



}))

export default router