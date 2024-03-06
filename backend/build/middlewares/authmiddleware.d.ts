import { Request, Response, NextFunction } from "express";
import "dotenv/config";
interface authRequest extends Request {
    userId?: any;
    authorization?: string;
}
export default function authmiddleware(req: authRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export {};
