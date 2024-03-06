import type { Response } from "express";
export declare function successApiResponse(responseStatus: number, data: string): (res: Response) => void;
