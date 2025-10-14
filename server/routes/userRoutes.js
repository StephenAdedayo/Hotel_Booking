import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { getUserData, storeRecenteSearchedCities } from '../controllers/userControllers.js'

const userRouter = express.Router()


userRouter.get("/", protect, getUserData)
userRouter.post("/store-recent-search", protect, storeRecenteSearchedCities)

export default userRouter