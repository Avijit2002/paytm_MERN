import express from "express"

import {User,Admin} from "./db"
import rootRouter from "./routes"


const app = express()

app.use('/api/v1',rootRouter)

app.listen(3000)


