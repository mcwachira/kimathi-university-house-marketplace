import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { db } from '../firebase/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ReactComponent as ArrowRight } from '../assets/svg/keyboardArrowRightIcon.svg'
import VisibilityIcon from '../assets/svg/visibilityIcon.svg'
import Oauth from '../components/Oauth';


const SignUp = () => {

  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const {name,  email, password } = formData


  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prevState) => (
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    ))
  }

  const auth = getAuth()


  const handleSubmit = async(e) => {

    e.preventDefault();
    try{


      //creating our user with email and password
     const UserCredentials =  await createUserWithEmailAndPassword(auth, email, password);
     const user = UserCredentials.user
     console.log(user)

    //updating our user details with the user name
     updateProfile(auth.currentUser, {
      displayName:name
     })


     const formDataCopy = {...formData}
     delete formDataCopy.password;

     formDataCopy.timestamp =serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
     toast.success('user signed Up sucesfully ')
     navigate('/')

    }catch(error){
      toast.error('error sign ing up user' , error)
      console.log('error', error)
    }

  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">
        Create Account
        </p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input type="text" className="nameInput" id='name' placeholder='Name' onChange={handleChange} value={name} />


          <input type="email" className="emailInput" id='email' placeholder='Email' onChange={handleChange} value={email} />

          <div className="passwordInputDiv">
            <input type={showPassword? 'text': 'password'} className="passwordInput" id='password' placeholder='password' onChange={handleChange} value={password} showPassword />
            <img src={VisibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
          </div>

          <div className="signUpBar">
            <p className="signUpText">Sign Up </p>
            <button className="signUpButton" type='submit'>
              <ArrowRight fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      
<Oauth/>



        <Link to='/sign-in' className="registerLink"> Sign In instead</Link>
      </main>
    </div>
  )
}

export default SignUp