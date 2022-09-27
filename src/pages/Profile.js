import React , {useState , useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {toast } from 'react-toastify';
import { getAuth ,signOut, updateProfile } from 'firebase/auth'
import { updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ArrowRight from  '../assets/svg/keyboardArrowRightIcon.svg'
import HomeIcon from '../assets/svg/homeIcon.svg'
const Profile = () => {
  const auth = getAuth()
  const[changeDetails, setChangeDetails] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData]= useState({
    name:auth.currentUser?.displayName,
    email:auth.currentUser?.email,
  })
  

  const {name,  email} = formData
  const navigate = useNavigate()


  useEffect(() => {

    setUser(() => auth.currentUser)
  }, [])


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

  return  user? (
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
    
    </main>
  </div>
      <h1> {user.displayName}</h1>

   
  </>
  
  

  
  
  ): <h1>Not signed In</h1>
}

export default Profile