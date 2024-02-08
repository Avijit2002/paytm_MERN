import { z } from "zod";

export const zodSignupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6, { message: "Must be 6 or more characters long" }),
    userName: z.string()
        .min(3, { message: "Must be 3 or more characters long" })
        .max(10, { message: "Must be 10 or less characters" })
});

export const zodSigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const zodUpdateSchema = z.object({
    username: z.string(),
    password: z.string(),
    newPassword: z.string().min(6, { message: "Must be 6 or more characters long" }),
})