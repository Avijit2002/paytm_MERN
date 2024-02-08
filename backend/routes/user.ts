import { Router } from "express";
import { z } from "zod";
import { responseStatus } from "../utils/statusCode"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { User } from "../db";

const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

const zodSignupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6, { message: "Must be 6 or more characters long" }),
    userName: z.string()
        .min(3, { message: "Must be 3 or more characters long" })
        .max(10, { message: "Must be 10 or less characters" })
});

const zodSigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

const zodUpdateSchema = z.object({
    username: z.string(),
    password: z.string(),
    newPassword: z.string().min(6, { message: "Must be 6 or more characters long" }),
})



router.post('/signup', async (req, res, next) => {
    //const { firstName, lastName, userName, password } = req.body
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const userName = req.body.username;
    const password = req.body.password;


    //Zod validation
    const validation = zodSignupSchema.safeParse({
        firstName, lastName, userName, password
    })
    if (!validation.success) {
        //console.log(validation.error)
        res.status(responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
        })
        return
    }


    try {
        //creating user in DB
        const dbUser = await User.findOne({ userName })
        if (dbUser?._id) {
            return res.status(responseStatus.incorrectInput).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        const user = await User.create({
            firstName, lastName, password, userName
        })
        if (!user._id) {
            throw new Error("User creation failed")
        }

        //creating jwt token 
        if (!JWT_SECRET) {
            throw new Error("JWT token undefined")
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

router.post('/update', async (req, res) => {
    const body = req.body;

    const validation = zodUpdateSchema.safeParse(body)
    if(!validation.success){
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
            message: "Incorrect password. Not allowed!"
        })
    }

    const update = await User.updateOne({
        _id: dbUser._id
    },{
        password: body.newPassword
    })

    res.status(responseStatus.success).json({
        message: "Password changed successfully",
    })


})




export default router