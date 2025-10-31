import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const RoomDetails = () => {

    const {id} = useParams()
    const [room, setRoom] = useState(null)
    const {rooms, getToken, axios, navigate} = useAppContext()
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState(1)
    const [mainImage, setMainImage] = useState(null)
    const [isAvailable, setIsAvailable] = useState(false)

    const checkAvailability = async () => {
        try {
            // check if check in date is greater is greater than check out date
            if(checkInDate >= checkOutDate){
                toast.error("Check-In-Date should be less than check out date")
                return
            }

            const {data} = await axios.post("/api/bookings/check-availability", {room : id, checkInDate, checkOutDate})
            if(data.success){
                if(data.isAvailable){
                    setIsAvailable(true)
                    toast.success("Room is available")
                }else{
                    setIsAvailable(false)
                    toast.error("Room is not available")
                }
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //  function to check availabilty and book the room

    const onSubmitHandler = async (e) => {

        try {
            e.preventDefault()
            if(!isAvailable){
                return checkAvailability()
            }else{
                const {data} = await axios.post("/api/bookings/book", {room : id, checkInDate, checkOutDate, guests, paymentMethod : "Pay At Hotel"}, {headers : {Authorization : `Bearer ${await getToken()}`}})

                if(data.success){
                    toast.success(data.message)
                    navigate("/my-bookings")
                    scrollTo(0,0)
                }else{
                    toast.error(data.message)
                }
            }


        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
      const room = rooms.find(room => room._id === id)
      room && setRoom(room)
      room && setMainImage(room.images[0])
    }, [rooms])

  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span></h1>
            <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
        </div>
{/* room rating */}
        <div className='flex items-center gap-1 mt-2'>
            <StarRating rating={room?.hotel.rating}/>
            <p className='ml-2'>200+ reviews</p>
        </div>

        {/* room address */}
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
            <img src={assets.locationIcon} alt="location-icon" className=''/>
            <span>{room.hotel.address}</span>
        </div>

        {/* room images */}
        <div className='flex flex-col md:flex-row mt-6 gap-6'>
            <div className='lg:w-1/2 w-full'>
                <img src={mainImage} alt="main-image" className='w-full rounded-xl shadow-lg object-cover'/>
            </div>

            <div className='grid grid-cols-2 lg:w-1/2 w-full gap-4'>
                {room?.images.length > 1 && room.images.map((image, index) => (
                <img onClick={() => setMainImage(image)} src={image} key={index} alt="room-image" className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && "outline -3 outline-orange-500"}`}/>
                ))}
            </div>
        </div>

        {/* room highlights */}
        <div className='flex flex-col md:flex-row md:justify-between mt-10'>
            <div className='flex flex-col'>
                <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.map((item, index) => (
                        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                        <img key={index} src={facilityIcons[item]} alt={item} className='w-5 h-5'/>
                        <p className='text-xs'>{item}</p>
                    </div>
                    ))}

                </div>
            </div>
            {/* room price */}
            <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
        </div>

        {/* check in check out form */}
        <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between  bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
         
         <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center  gap-4 md:gap-10 text-gray-500'>
            <div className='flex flex-col'>

            <label htmlFor="checkInDate">
                Check-In
            </label>
            {/* from min= we can only select date from today's or recent date only we can select yesterday date */}
            <input  onChange={(e) => setCheckInDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
             type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
            </div>
         <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

         <div className='flex flex-col'>

            <label htmlFor="checkOutDate">
                Check Out
            </label>
            {/* min is added to enusre we cannot choose any date before check in and disabled because we can only select checkout when we have check in date */}
            <input onChange={(e) => setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate} 
             type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
            </div>
        <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
        <div className='flex flex-col'>

            <label htmlFor="guests">
                Guests
            </label>
            <input onChange={(e) => setGuests(e.target.value)} value={guests} type="number" id='guests' placeholder='0' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
            </div>

         </div>

         <button type='submit' className=' bg-primary hover hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
            {isAvailable ? "Book Now" : "Check Availability"}
         </button>
        </form>

        {/* common specifications */}
        <div className='mt-25 space-y-4'>
            {roomCommonData.map((spec, index) => (
                <div key={index} className='flex items-start gap-2'>
                    <img className='w-6.5' src={spec.icon} alt={`${spec.title}-icon`}/>
                    <div>
                        <p className='text-base'>{spec.title}</p>
                        <p className='text-gray-500'>{spec.description}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
            <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
        </div>


        {/* hosted by */}
        <div className='flex flex-col items-start gap-4'>
            <div className='flex gap-4'>
                <img src={room.hotel.owner.image} alt="host" className='h-14 w-14 rounded-ful md:w-18 md:h-18'/>
                <div>
                    <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
                    <div className='flex items-center mt-1'>
                        <StarRating rating={room?.hotel.rating}/>
                        <p className='ml-2'>200+ reviews</p>
                    </div>
                </div>
            </div>

            <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>
        </div>
    </div>
  )
}

export default RoomDetails
