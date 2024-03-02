import { Request,Response,NextFunction } from "express";
import { responseStatus } from "../utils/statusCode";
import jwt from "jsonwebtoken";
import "dotenv/config"

const JWT_SECRET = process.env.JWT_SECRET

interface authRequest extends Request {
    userId?: any;
    authorization?: string
}

export default function authmiddleware(req: authRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(responseStatus.unauthorized).json({
            message: "Unauthorized"
        })
    }
    const token = authHeader.split(" ")[1]
    console.log(token)

    if(!JWT_SECRET){
        throw new Error("JWT secret key problem")
    }
    try {
        const decoded= <jwt.JwtPayload>jwt.verify(token,JWT_SECRET);
        if(!decoded?.userId){
            return res.status(responseStatus.unauthorized).json({
                message:"Invalid Credintials!"
            })
        }
        req.userId = decoded.userId
        console.log(decoded.userId)
        next()
        
    } catch (error) {
        console.log(Error) 
        throw new Error("Invalid Credintials!")
    }

}