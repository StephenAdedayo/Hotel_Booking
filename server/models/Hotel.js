import mongoose from 'mongoose'


const HotelSchema = mongoose.Schema({

    name : {type: String, required: true},
    address : {type: String, required: true},
    contact : {type: String, required: true},
    // owner already has id of the user as the default value
    owner : {type: String, required: true, ref : "User"},
    city: {type: String, required: true},

}, {timestamps : true})


const Hotel = mongoose.model("Hotel", HotelSchema)


export default Hotel