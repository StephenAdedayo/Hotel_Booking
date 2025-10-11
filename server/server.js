import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"


connectDB()


const app = express()


// middlewares
app.use(express.json())
app.use(clerkMiddleware())

// api to listen to clerk webhook
app.use("/api/clerk", clerkWebhooks)


app.use(cors())

app.get("/", (req, res) => res.send("API Working"))

const PORT = process.env.PORT || 3000


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
