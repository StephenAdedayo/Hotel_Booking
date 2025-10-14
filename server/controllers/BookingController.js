
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"

// function to check availability

const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
//   room is an ID from model ref="Room"
    try {
        const bookings = await Booking.find({

            room,
            checkInDate : {$lte : checkOutDate},
            checkOutDate : {$gte : checkInDate}
        })

        const isAvailable = bookings.length === 0
        return isAvailable
    } catch (error) {
        console.error(error.message);
        
    }

}

// API to check availability of room

export const checkAvailabilityApi = async (req, res) => {

    try {
        const {room, checkInDate, checkOutDate} = req.body

        const isAvailable = await checkAvailability({room, checkInDate, checkOutDate})

        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success : false, message : error.message})
    }

}


// API for bookings

export const createBooking = async (req, res) => {

    try {
        const {room, checkInDate, checkOutDate, guests} = req.body

        const user = req.user._id

        // check room availability

        const isAvailable = await checkAvailability({room, checkInDate, checkOutDate})

        if(!isAvailable){
            res.json({success : false, message: "Room is not available"})
        }

        // get total price for room
        const roomData = await Room.findById(room).populate("hotel")
        let totalPrice = roomData.pricePerNight

        // calculate total price based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 *24))

        totalPrice *= nights

        const booking = await Booking.create({
            user,
            room,
            hotel : roomData.hotel._id,
            guests : +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })

        res.json({success : true, message: "Booking created successfully"})

    } catch (error) {
        console.log(error.message);
        
        res.json({success: false, message : "Failed to create booking"})
    }


}


export const getUserBookings = async (req, res) => {

    try {
        const user = req.user._id

        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt : -1})


        res.json({success: true, bookings})
    } catch (error) {
        res.json({success: false, message : "Failed to fetch booking"})
    }


}


export const getHotelBookings = async (req, res) => {

    try {
        const hotel = await Hotel.findOne({owner : req.auth.userId})
       
        if(!hotel) res.json({success: false, message :"No hotel found"})

        const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt : -1})

        // Total bookings

        const totalBookings = bookings.length

        // Total Revenue
        const totalRevenue = bookings.reduce((acc,booking) => acc + booking.totalPrice, 0)

        res.json({success : true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        res.json({success: false, message : "failed to fetch bookings"})
    }

}