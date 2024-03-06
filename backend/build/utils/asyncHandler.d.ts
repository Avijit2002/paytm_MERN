import { Request, Response, NextFunction } from 'express';
export declare function asyncFunction(fn: (req: Request, res: Response, next: NextFunction) => any): (req: Request, res: Response, next: NextFunction) => any;
