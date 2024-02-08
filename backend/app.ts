import express from "express"
import cors from "cors"
import type { ErrorRequestHandler } from "express";

import {User,Admin} from "./db"
import { responseStatus } from "./utils/statusCode";
import rootRouter from "./routes"


const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1',rootRouter)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err)
    res.status(responseStatus.internalServerError).json({
        message: "Internal Server Error!"
    })
};
app.use(errorHandler);


app.listen(3000)


