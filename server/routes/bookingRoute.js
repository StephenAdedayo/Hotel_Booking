import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { checkAvailabilityApi, createBooking, getHotelBookings, getUserBookings } from '../controllers/BookingController.js'

const bookingRouter = express.Router()


bookingRouter.post("/check-availability", checkAvailabilityApi)
bookingRouter.post("/book", protect, createBooking)
bookingRouter.post("/user", protect, getUserBookings)
bookingRouter.post("/hotel", protect, getHotelBookings)

export default bookingRouter