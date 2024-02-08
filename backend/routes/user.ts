import { Router } from "express";
import { z } from "zod";
import { responseStatus } from "../utils/statusCode"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { User } from "../db";

const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

const zodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6, { message: "Must be 6 or more characters long" }),
    userName: z.string()
        .min(3, { message: "Must be 3 or more characters long" })
        .max(10, { message: "Must be 10 or less characters" })
});

router.get('/', (req, res) => {
    throw new Error("test")
    res.send("userRouter")
})
router.post('/signup', async (req, res, next) => {
    //const { firstName, lastName, userName, password } = req.body
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const userName = req.body.username;
    const password = req.body.password;
    console.log(password)
    const validation = zodSchema.safeParse({
        firstName, lastName, userName, password
    })
    if (!validation.success) {
        console.log(validation.error)
        res.status(responseStatus.incorrectInput).json({
            message: "Email already taken / Incorrect inputs"
        })
        return
    }
    try {
        if (!JWT_SECRET) {
            throw new Error("JWT token undefined")
        }
        let token
        token = jwt.sign({ userName }, JWT_SECRET);
        const user = await User.create({
            firstName, lastName, password, userName
        })
        if (!user) {
            throw new Error("User creation failed")
        }
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

router.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    

})

router.post('/update', (req, res) => {
})




export default router