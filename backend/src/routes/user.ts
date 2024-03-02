import express, { Router } from "express";
import { responseStatus } from "../utils/statusCode"
import jwt from "jsonwebtoken"
import 'dotenv/config'
//import { User } from "../db";
import { zodSigninSchema, zodSignupSchema, zodUpdateSchema } from "../utils/zod/userRoute";
import { signupType, signinType, updateType } from "../utils/zod/userRoute";
//import { successApiResponse } from "../utils/successResponse";
import authmiddleware from "../middlewares/authmiddleware";
import { asyncFunction } from "../utils/asyncHandler";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

interface authRequest extends express.Request {
    userId?: any
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

    //creating jwt token 
    if (!JWT_SECRET) {
        throw new Error("JWT secret undefined")
    }
    let token
    token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(responseStatus.success).json({
        message: "User created successfully",
        token: token
    })
    //successApiResponse(responseStatus.success, token)
}))

router.post('/signin', async (req, res, next) => {
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

    try {
        //creating jwt token 
        if (!JWT_SECRET) {
            throw new Error("JWT token undefined")
        }
        let token
        token = jwt.sign({ userId: dbUser.id }, JWT_SECRET);

        res.status(responseStatus.success).json({
            message: "Signin successfully",
            token: token
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.put('/update', authmiddleware, async (req: authRequest, res, next) => {
    const body: updateType = req.body;
    //console.log(body)
    const validation = zodUpdateSchema.safeParse(body)

    if (!validation.success) {
        //console.log(validation.error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }

    try {
        //console.log(req.userId)
        const update = await prisma.users.update({
            where: {
                id: req.userId
            },
            data: body
        })
        console.log(update)

        res.status(responseStatus.success).json({
            message: "Info updated successfully",
        })

    } catch (error) {
        console.log(error)
        next(error)
    }

})


router.get('/bulk:query', authmiddleware, async (req: authRequest, res, next) => {
    const query = req.params.query;
    console.log(query)
    try {
        const data = await prisma.users.findUnique({
            where:{
                username: query
            }
        })
        console.log(data)
        res.status(responseStatus.success).json({
            message: "succcess",
            data: JSON.stringify(data)
        })

    } catch (error) {
        console.log(error)
        next(error)
    }

})

export default router