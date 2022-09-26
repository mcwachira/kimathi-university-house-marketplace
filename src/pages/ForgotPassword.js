import React , {useState} from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { ReactComponent as ArrowRight } from '../assets/svg/keyboardArrowRightIcon.svg'
const ForgotPassword = () => {

  const [email , setEmail] = useState("")

  const navigate = useNavigate()
const handleChange = (e) => {
  setEmail(e.target.value)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const auth = getAuth();

  try{
    await sendPasswordResetEmail(auth, email)
    toast.success('password reset link sent')
    navigate('/sign-in')

  }catch(error){
    toast.error('error resetting password')
    console.log(error)
  }


}
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">
       Reset Password
        </p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input type="email" className="emailInput" id='email' placeholder='Email' onChange={handleChange} value={email} />

  

          <div className="signInBar">
            <p className="signInText">Sign In </p>
            <button className="signInButton">
             <ArrowRight/>
            </button>
          </div>
        </form>
        <Link to='/sing-in' className="forgotPasswordLink">Sign In</Link>


      </main>
    </div>
  )
}



export default ForgotPassword