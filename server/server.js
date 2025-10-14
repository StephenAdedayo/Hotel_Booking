import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoute.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoute.js"
import bookingRouter from "./routes/bookingRoute.js"


connectDB()
connectCloudinary()


const app = express()


// middlewares
app.use(express.json())
app.use(clerkMiddleware())

// api to listen to clerk webhook
app.use("/api/clerk", clerkWebhooks)


app.use(cors())

app.get("/", (req, res) => res.send("API Working"))
app.use("/api/user", userRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/rooms", roomRouter)
app.use("/api/bookings", bookingRouter)

const PORT = process.env.PORT || 3000


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
