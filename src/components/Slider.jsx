import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from './Spinner';

// Import Swiper styles
import 'swiper/css/bundle';

const Slider = () => {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
   
        const fetchListings = async() => {
            const listingRef = collection(db, 'listings');
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnapshot = await getDocs(q);

            let listings = [];
       
        
            querySnapshot.forEach((doc) => {
                return  listings.push({
                    id:doc.id,
                    data:doc.data(),
                })
            })

    
            setListings(listings)
            setLoading(false)
        }


      fetchListings()
    }, [])

    if(loading){
        <Spinner/>
    }
    
  return (
 <>
    <p className="exploreHeading">
Recommended
    </p>

          <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, A11y]}
              slidesPerView={1}
        
              pagination={{ clickable: true }}
          >

              {listings?.map(({data, id}) => (


                  <SwiperSlide key={id} onClick={() => Navigate(`/category/${data.type}/${id}`)} style={{
                      background: `url(${data.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                      height:'100%'
                      }} className='swiperSlideDiv'> 
                  <p className="swiperSliderText">
                    {data.name}
                  </p>
                          <p className="swiperSlidePrice">
                    ${data.discountedPrice ?? data.regularPrice}{' '}
                    {data.type === 'rent' && '/ month '}
                  </p>
                  
                      </SwiperSlide>



              ))}

          </Swiper>
 </>
  )
}

export default Slider