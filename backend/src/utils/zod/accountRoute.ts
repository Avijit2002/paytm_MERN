import { z } from "zod";

export const zodTransferSchema = z.object({
    tousername: z.string()
    .min(3, { message: "Must be 3 or more characters long" })
    .max(10, { message: "Must be 10 or less characters" }),
    amount: z.number().positive({message:"amount must be positive number"}),
});



export type transferType = z.infer<typeof zodTransferSchema>
