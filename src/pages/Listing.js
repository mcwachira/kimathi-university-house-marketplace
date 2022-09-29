import React ,{useState, useEffect} from 'react'
import { getAuth } from 'firebase/auth'
import {getDoc, doc} from 'firebase/firestore'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { db } from '../firebase/firebase'
import Spinner from '../components/Spinner'
import MapComponent from '../components/MapComponent'
import shareIcon from '../assets/svg/shareIcon.svg'
import { toast } from 'react-toastify'

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css/bundle';


const Listing = () => {



  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {

const fetchListings = async() =>{


  //three parameters in a doc ref  db, name of collection and data you are fetching
  const docRef = doc(db,'listings', params.listingId)
 const docSnapshot = await getDoc(docRef)
 if(docSnapshot.exists()){
  console.log(docSnapshot)
  setListing(docSnapshot.data())
  setIsLoading(false)

 }


}


fetchListings()

  }, [params.listingId])
  if(isLoading){
    return <Spinner/>
  }

  return (
    <main>
  
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination,  A11y]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >

      {listing.imageUrls.map((imageUrl, index ) => (


 <SwiperSlide key={index}  style={{
  background:`url(${listing.imageUrls[index]}) center no-repeat`, 
  backgroundSize:'cover'}} className='swiperSlideDiv'></SwiperSlide>



      ) )}
   
      </Swiper>
      <div className="shareIconDiv" onClick={() => {navigator.clipboard.writeText(window.location.href)
     setShareLinkCopied(true)
    //  toast.success('Linked Copied Successfully')
     setTimeout(() => {
      setShareLinkCopied(false)
     }, 200)
      }
      
      }>
      <img src={shareIcon} alt="share " />

      </div>
      {shareLinkCopied && <p className="linkCopied"> Link Copied !</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}   - $ {listing.offer ? (listing.discountedPrice
): (listing.regularPrice
)}

    </p>
    <p className="listingLocation">
      {listing.location}
    </p>
    <p className="listingType">
      For {listing.type === 'rent' ? 'Rent' : 'Sale'}
    </p>
    {listing.offer && (<p className="discountPrice">
      ${listing.regularPrice
 - listing.discountedPrice} discount
    </p>)}
    <ul className="listingDetailsList">
      <li>
        {
          listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms`:' 1 bedrooms'
        }
      </li>
          <li>
            {
              listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : ' 1 bathrooms'
            }
          </li>

          <li>
            {listing.parking  && 'Parking Spot' }
          </li>

          <li>
            {listing.furnished && 'Furnished'}
          </li>
    </ul>


    <p className="listingLocationTitle">
      Location
    </p>
  

      <MapComponent latitude={listing.geolocation.lat} longitude={listing.geolocation.lng } location={listing.location}/>
        
    {
      auth.currentUser?.uid !== listing.userRef &&(
            <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'> Contact Landlord</Link>
      )}
      </div>
    </main>
  )
}

export default Listing