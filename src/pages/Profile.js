import React , {useState , useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {toast } from 'react-toastify';
import { getAuth ,signOut, updateProfile } from 'firebase/auth'
import { updateDoc, serverTimestamp, doc  , where,orderBy, deleteDoc,getDocs, collection, query} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ListingItem from '../components/ListingItem'
import ArrowRight from  '../assets/svg/keyboardArrowRightIcon.svg'
import HomeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
  const auth = getAuth()
  const[changeDetails, setChangeDetails] = useState(false)
 const  [loading, setLoading ] = useState(false)
  const [listings, setListings] = useState(null)
  const [formData, setFormData]= useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  })
  

  const {name,  email} = formData
  const navigate = useNavigate()

  console.log(auth.currentUser.uid)

  useEffect(() => {

    //where('type', '==', params.categoryName),
    
    const fetchUserListing = async() => {
      const listingRefs = collection(db, 'listing')
      const q = query(listingRefs, where('userRef', '==',auth.currentUser?.uid), 
      orderBy('timestamp', 'desc') )

      const querySnapshot = await getDocs(q)

      let listings =[]

    querySnapshot.forEach((doc) => {
  return listings.push({
    id:doc.id,
    data: doc.data()
  })
})

       
setListings(listings)
  setLoading(false)
    }



    fetchUserListing()



  }, [auth.currentUser.uid])


  const handleLogOut = () => {
    //signOut(auth)
    auth.signOut()
    toast.success('Logged out successfully')
    navigate('/')
  }


  const handleChange = (e) => {
    setFormData((prevState) => (
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    ))
  }
  const handleSubmit = async() => {

 
    try{
      if (auth.currentUser.displayName !== name ) {

        //&& auth.currentUser.email !== email

  await updateProfile(auth.currentUser, {
        displayName: name,
        // email: email

      })
      // const formDataCopy = { ...formData }
 

      // formDataCopy.timestamp = serverTimestamp()
      // await updateDoc(doc(db, 'users', user.uid), formDataCopy) 
      
      //update user in firestore db
      //1.create an user ref first then update using userDoc
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name:name,
        // email:email
      })
      toast.success('successfully  updated user profile')
      // navigate('/')
    }
    }catch(error){
      toast.error('error in updating the user profile')
      console.log('error', error)
    }
    
   

  }

  const handleDelete = async (listingId) => {
//listings.filter((listing) => listing.id  === id)
if(window.confirm('Are you sure you want to delete?')){

  const listingRef = doc(db, 'listings', listingId)
  await deleteDoc(listingRef)
  toast.success('listing deleted successfully')
  const updateListings = listings.filter((listing) => listing.id !== listingId)
  setListings(updateListings)
}

  }

  const handleEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return  auth.currentUser ? (
  <>
  <div className="profile">
    <div className="profileHeader">
      <p className="pageHeader">
        My Profile
      </p>

          <button type='button' className="logOut" onClick={handleLogOut}>
            Log Out
          </button>
    </div>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
            <p className="changePersonalDetails" onClick={() => { changeDetails && handleSubmit() 
            setChangeDetails((prevState) => !prevState)}}>
          {changeDetails? 'done': 'change'}
        </p>
      </div>

   

      <form onSubmit={handleSubmit}> 
            <div className="profileCard">
              <input type="text"
                id='name'
                className={changeDetails ? 'profileNameActive' : 'profileName'}
                value={name}
                onChange={handleChange}
                disabled={!changeDetails}
              />
</div>

            <div className="profileCard">
              <input type="email"
                id='email'
                className={changeDetails ? 'profileEmailActive' : 'profileEmail'}
                value={email}
                onChange={handleChange}
                disabled={!changeDetails}
               

              />
  </div>
            <button type='submit' className="logOut" >
             Update Profile
            </button>
      </form>
          

          <Link to='/create-listing' className='createListing'>
          <img src={HomeIcon  } alt="Home  icon" /> 
          
          <p>Sell or rent your home</p>
        <img src={ArrowRight} alt="arrow right " /> </Link>

        {!loading && listings?.length > 0 && (
<>
  <p className="listingText">
    Your Listing
  </p>
  <ul className="listingsList">
  {listings.map((listing) => (
    <ListingItem key={listing.id} 
    listing={listing.data} 
    id={listing.id}

      onDelete ={()=> handleDelete(listing.id)}
      onEdit = {() => handleEdit(listing.id)}
    />
  ))
  }

  </ul>
</>
        )}
    
    </main>
  </div>
    

   
  </>
  
  

  
  
  ): <h1>Not signed In</h1>
}

export default Profile