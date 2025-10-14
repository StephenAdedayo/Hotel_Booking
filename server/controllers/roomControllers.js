


// API to  create a new room for a hotel

import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"

export const createRoom = async (req, res) => {

    try {
        const {roomType, amenities, pricePerNight} = req.body
        
        // check if owner stored in the hotel model is === req.auth.userId of the middleware 
        // in the hotel controller owner has been saved as an ID from req.user._id from the user model
        //find owner by clerkId and clerkID has been saved when a user is created and owner is saved as clerkId in the registerHotel controller
        const hotel = await Hotel.findOne({owner: req.auth.userId})
        
        if(!hotel) res.json({success : false, message : "Not found"})
        

            // upload all images to cloudinary
            const uploadImages = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path)
                return response.secure_url
            })

            const images = await Promise.all((uploadImages))

             await Room.Create({
                // hotel._id is purely mongodb id
                hotel : hotel._id,
                roomType,
                // +pricePerNight was added because originallly it was sent in as string but +pricePerNight makes it Number
                pricePerNight : +pricePerNight,
                amenities : JSON.parse(amenities),
                images
             })

             res.json({success : true, message : "Room Created Successfully"})
    } catch (error) {
             res.json({success : false, message : error.message})

    }

}


// API to get all rooms
export const getRoom = async (req, res) => {

    try {
        // this will find all the rooms where isAvailable is true then .populate and add the entire hotel details instead just hotel id then also select of the hotel and the image of the owner then .sort will sort based on recent date

        // when ref "hotel" is added in the model of the hotel in room model, the hotel default holds the hotel ID 
        // .populate it now gives the entire hotel details and in the hotel model, owner has ref of User so also populates it agains because the owner default is UserId alone but when populated the select means just select just the owner image
        const rooms = await Room.find({isAvailable : true}).populate({
            path : "hotel",
            populate: {
            path : "owner",
            select : "image"
            }
        }).sort({createdAt: - 1})
        res.json({success : true, rooms})
    } catch (error) {
        res.json({success : false, message : error.message})
    }

}

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {

    try {
        const hotelData = await Hotel.findOne({owner:req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel")

        res.json({success : true, rooms})

    } catch (error) {
        res.json({success : false, message : error.message})

    }

}


// API to toggle availability of room
export const toggleAvailabilty = async (req, res) => {

    try {
        const {roomId} = req.body

        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable

        await roomData.save()

        res.json({success: true, message: "Room availablility updated"})
    } catch (error) {
        res.json({success : false, message : error.message})

    }

}