"use strict";
// Added as npm package
// import { z } from "zod";
// export const zodSignupSchema = z.object({
//     firstname: z.string(),
//     lastname: z.string(),
//     password: z.string().min(6, { message: "Must be 6 or more characters long" }),
//     username: z.string()
//         .min(3, { message: "Must be 3 or more characters long" })
//         .max(10, { message: "Must be 10 or less characters" })
// });
// export const zodSigninSchema = z.object({
//     username: z.string(),
//     password: z.string()
// })
// export const zodUpdateSchema = z.object({
//     firstName: z.string().optional(),
//     lastName: z.string().optional(),
//     password: z.string().min(6, { message: "Must be 6 or more characters long" }).optional(),
// })
// export type signupType = z.infer<typeof zodSignupSchema>
// export type signinType = z.infer<typeof zodSigninSchema>
// export type updateType = z.infer<typeof zodUpdateSchema>
