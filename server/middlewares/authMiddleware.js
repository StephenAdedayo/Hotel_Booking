import User from "../models/User.js";



// middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    //   destructure userId from req.auth to check if there is user authenticated
     const {userId} = req.auth

     if(!userId){
        res.json({success: false, message: "not authenticated"})
        
     }else{
        // find user by the id when authenticated
        const user = await User.findById(userId)
        // store user in req.user to be used in getuserdata controller
        req.user = user
        
        next()
     }
    

}