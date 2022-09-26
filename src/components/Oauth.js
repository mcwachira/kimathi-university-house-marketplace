import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router';
import  GoogleIcon from '../assets/svg/googleIcon.svg'
import { db } from '../firebase/firebase';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Oauth = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const handleGoogleLogin = async () => {

        try{

            const auth = getAuth()
            const googleProvider = new GoogleAuthProvider();
            const results = await signInWithPopup(auth, googleProvider)

            const user = results.user
            //creating a reference
            const docRef = doc(db , 'users', user.uid)
            
            //take a snapshot of the data
            const documentSnapShot =  await getDoc(docRef);

            //checking if the document snapshot does not  exist in the database
            if(!documentSnapShot.exists()){
await setDoc(doc (db, 'users', user.uid) , {

    //data we need to save in our firestore  db
    name:user.displayName,
    email:user.email,
    timestamp: serverTimestamp()
})
            } 
            
            toast.success('successfully authenticated using google')
            navigate('/')
            
         
        }catch(error){
            toast.error('Could not authenticate with google')
            console.log(error)
        }

    }




  return (
   <div className="socialLogin">
    <p>
      {location.pathname=== '/sign-up'? 'Sign Up' : 'Sign In ' } 
         with
    </p>
    <button className="socialIconDiv" onClick={handleGoogleLogin}>
              <img src={GoogleIcon} alt="google" className='socialIconImg' />
    </button>
   </div>
  )
}

export default Oauth