import express,{ Router } from "express";
import { responseStatus } from "../utils/statusCode"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { User } from "../db";
import { zodSigninSchema, zodSignupSchema, zodUpdateSchema } from "../utils/zod/userRoute";
import authmiddleware from "../middlewares/authmiddleware";

const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

interface authRequest extends express.Request{
    userId?:any
}


router.post('/signup', async (req, res, next) => {
    //const {firstName, lastName, userName, password } = req.body
    const body = req.body
    
    //Zod validation
    const validation = zodSignupSchema.safeParse(body)
    if (!validation.success) {
        //console.log(validation.error)
        res.status(responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
        })
        return
    }

    try {
        //creating user in DB
        const dbUser = await User.findOne({ userName: body.username })
        if (dbUser?._id) {
            return res.status(responseStatus.incorrectInput).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        const user = await User.create({
            firstName: body.firstname,
            lastName: body.lastname,
            password: body.password,

        })
        if (!user._id) {
            throw new Error("User creation failed")
        }

        //creating jwt token 
        if (!JWT_SECRET) {
            throw new Error("JWT secret undefined")
        }
        let token
        token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.status(responseStatus.success).json({
            message: "User created successfully",
            token: token
        })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/signin', async (req, res, next) => {
    // const username = req.body.username;
    // const password = req.body.password;
    const body = req.body

    const validation = zodSigninSchema.safeParse(body)
    if (!validation.success) {
        //console.log(validation.error)
        return res.status(responseStatus.incorrectInput).json({
            message: "Incorrect inputs"
        })
    }


    const dbUser = await User.findOne({
        userName: body.username,
        password: body.password
    })
    if (!dbUser?._id) {
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
        token = jwt.sign({ userId: dbUser._id }, JWT_SECRET);

        res.status(responseStatus.success).json({
            message: "Signin successfully",
            token: token
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.put('/update',authmiddleware, async (req:authRequest, res,next) => {
    const body = req.body;
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
        const update = await User.updateOne( {
            _id: req.userId
        },body)
        console.log(update)

        res.status(responseStatus.success).json({
            message: "Info updated successfully",
        })

    } catch (error) {
        console.log(error)
        next(error)
    }

})

export default router