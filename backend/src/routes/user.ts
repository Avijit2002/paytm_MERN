import express, { Router } from "express";
import { responseStatus } from "../utils/statusCode"
import jwt from "jsonwebtoken"
import 'dotenv/config'
//import { User } from "../db";
import { zodSigninSchema, zodSignupSchema, zodUpdateSchema } from "@avijit2002/zodvalidationandtypes";
import { signupType, signinType, updateType } from "@avijit2002/zodvalidationandtypes";
//import { successApiResponse } from "../utils/successResponse";
import authmiddleware from "../middlewares/authmiddleware";
import { asyncFunction } from "../utils/asyncHandler";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

interface authRequest extends express.Request {
    userId?: string
}

router.post('/signup', asyncFunction(async (req, res, next) => {
    //const {firstName, lastName, userName, password } = req.body
    const body: signupType = req.body
    //const body = req.body

    //Zod validation
    const validation = zodSignupSchema.safeParse(body)
    if (!validation.success) {
        console.log(validation.error.message)
        res.status(responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
            //message:validation.error.message
        })
        return
    }

    //creating user in DB
    const dbUser = await prisma.users.findUnique({
        where: {
            username: body.username,
        },
    })
    if (dbUser?.id) {
        console.log("2")
        return res.status(responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await prisma.users.create({
        data: body
    })

    if (!user.id) {
        throw new Error("User creation failed")
    }

    const account = await prisma.accounts.create({
        data: {
            balance: Math.random() * 100,
            userId: user.id
        }
    })

    if (!account.id) {
        throw new Error("User account creation failed")
    }

    //creating jwt token 
    if (!JWT_SECRET) {
        throw new Error("JWT secret undefined")
    }
    let token
    token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(responseStatus.success).json({
        success: true,
        message: "User created successfully",
        token: token
    })
    //successApiResponse(responseStatus.success, token) 
}))

router.post('/signin', asyncFunction(async (req, res, next) => {
    // const username = req.body.username;
    // const password = req.body.password;
    const body: signinType = req.body

    const validation = zodSigninSchema.safeParse(body)
    if (!validation.success) {
        //console.log(validation.error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }


    const dbUser = await prisma.users.findUnique({
        where: {
            username: body.username,
            password: body.password
        }
    })
    if (!dbUser?.id) {
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }

    //creating jwt token 
    if (!JWT_SECRET) {
        throw new Error("JWT token undefined")
    }
    let token
    token = jwt.sign({ userId: dbUser.id }, JWT_SECRET);

    res.status(responseStatus.success).json({
        success: true,
        message: "Signin successfully",
        token: token
    })

}))

router.put('/update', authmiddleware, asyncFunction(async (req: authRequest, res, next) => {
    const body: updateType = req.body;
    //console.log(body)
    const validation = zodUpdateSchema.safeParse(body)

    if (!validation.success) {
        //console.log(validation.error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }

    //console.log(req.userId)
    const update = await prisma.users.update({
        where: {
            id: req.userId
        },
        data: body
    })
    console.log(update)

    res.status(responseStatus.success).json({
        success: true,
        message: "Info updated successfully",
    })



}))

// filtering users based on query, query can be 1st name, last name or username
router.get('/bulk', authmiddleware, asyncFunction(async (req: authRequest, res, next) => {
    const query = req.query.filter as string;
    console.log(query)
    const data = await prisma.users.findMany({
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
    })
    console.log(data)
    res.status(responseStatus.success).json({
        success: true,
        data: data.map(x => {
            return {
                firstname: x.firstname,
                lastname: x.lastname,
                username: x.username
            }
        })
    })



}))

export default router