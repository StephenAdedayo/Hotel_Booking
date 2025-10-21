import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { roomsDummyData } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {

    const [rooms, setRooms] = useState([])
    const {axios, getToken, user, currency} = useAppContext()


    const fetchRooms = async () => {
           try {
          const {data} = await axios.get("/api/rooms/owner", {headers: {Authorization : `Bearer ${await getToken()}`}})
            if(data.success){
              setRooms(data.rooms)
            }else{
              toast.error(data.message)
            }
           } catch (error) {
              toast.error(error.message)
           }
    }

    // toggle availabilty

    const toggleAvailability = async (roomId) => {
         const {data} = await axios.post("/api/rooms/toggle-availability", {roomId},  {headers: {Authorization : `Bearer ${await getToken()}`}})
         if(data.success){
          toast.success(data.message)
          fetchRooms()
         }else{
          toast.error(data.message)
         }
    }

    useEffect(() => {
      if(user){
      fetchRooms()
      }
    }, [user])
    
  return (
    <div>
        <Title title={"Room Listings"} align={"left"} font={"Outfit"} subTitle={"View, edit, or manage all listed rooms. Keep the information up to date to provide the best experience for users"}/>
        <p className='text-gray-800 mt-4'>All Rooms</p>

        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
       <thead className='bg-gray-50'>
        <tr>
            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
            <th className='py-3 px-4 text-gray-800 font-medium '>Price / night</th>
            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
        </tr>
       </thead>


       <tbody className='text-sm'>
           {rooms.map((item, index) => (
            <tr className='' key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.roomType}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>  {item.amenities.join(", ")}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>  {currency} {item.pricePerNight}</td>
                <td className='py-3 px-4 text-red-500 border-t border-gray-300 text-sm text-center'>
                     <label class="relative inline-flex cursor-pointer items-center gap-3 text-gray-900">
        <input type="checkbox" onChange={() => toggleAvailability(item._id)} class="peer sr-only" checked={item.isAvailable} />
        <div class="peer h-7 w-12 rounded-full bg-slate-300 ring-offset-1 transition-colors duration-200 peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500"></div>
        <span class="dot absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span></label>

                    
                </td>
              
            </tr>
           ))}
       </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListRoom
