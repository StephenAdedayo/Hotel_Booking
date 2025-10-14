import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/uploadMiddleware.js'
import { createRoom, getOwnerRooms, getRoom, toggleAvailabilty } from '../controllers/roomControllers.js'

const roomRouter = express.Router()


roomRouter.post("/", upload.array("images", 4), protect, createRoom)
roomRouter.get("/",  getRoom)
roomRouter.get("/owner", protect, getOwnerRooms)
roomRouter.post("/toggle-availability", protect,  toggleAvailabilty)

export default roomRouter