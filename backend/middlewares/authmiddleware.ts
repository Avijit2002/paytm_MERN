import { Request,Response,NextFunction } from "express";
import express from "express"
import { responseStatus } from "../utils/statusCode";
import jwt from "jsonwebtoken";
import "dotenv/config"

const JWT_SECRET = process.env.JWT_SECRET

interface authRequest extends Request {
    authorization?: string
}

export default function authmiddleware(req: authRequest, res: Response, next: NextFunction) {
    const tokenString = req.headers.authorization;
    if(!tokenString){
        return res.status(responseStatus.incorrectInput).json({
            message: "Unauthorized"
        })
    }
    const token = tokenString.split(" ")[1]
    console.log(token)

    if(!JWT_SECRET){
        throw new Error("JWT scret key problem")
    }
    try {
        const decoded= jwt.verify(token,JWT_SECRET);
        if(!(<any>decoded).userId){
            return res.status(responseStatus.incorrectInput).json({
                message:"Invalid Credintials!"
            })
        }
        req.body.userId = (<any>decoded).userId
        console.log((<any>decoded).userId)
        next()
        
    } catch (error) {
        console.log(Error) 
        throw new Error("Invalid Credintials!")
    }



}