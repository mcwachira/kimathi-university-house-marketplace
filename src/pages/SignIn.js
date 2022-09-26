import React, {useState} from 'react'
import { useNavigate ,Link } from 'react-router-dom'
import {  toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {ReactComponent as ArrowRight} from '../assets/svg/keyboardArrowRightIcon.svg'
import VisibilityIcon from '../assets/svg/visibilityIcon.svg'
import Oauth from '../components/Oauth';

const SignIn = () => {

  const [formData, setFormData] = useState({
    email:"",
    password:"",
  })
  const [showPassword, setShowPassword]=useState(false)

const {email, password} = formData

const handleChange = (e) => {
  setFormData((prevState) =>(
  { 
     ...formData,
    [e.target.id]:e.target.value
  }
  ))
}


  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    

    try{
      const auth = getAuth()

      const UserCredentials=   await  signInWithEmailAndPassword(auth,email, password )
      if(UserCredentials.user){
        toast.success('user signed in successfully')
        navigate('/profile')
      }


    }catch(error){
      toast.error('error sign in user ')
      console.log(error)
    }

  }

  return (
    <div className="pageContainer">
        <header>
    <p className="pageHeader">
        Welcome Back
    </p>
        </header>

        <main>
            <form onSubmit={handleSubmit}>
                <input type="email" className="emailInput" id='email' placeholder='Email'  onChange={handleChange} value={email}/>
            
            <div className="passwordInputDiv">
            <input type={showPassword? 'text': 'password'} className="passwordInput" id='password' placeholder='password' onChange={handleChange} value={password} />
              <img src={VisibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword((prevState) =>!prevState )} />
            </div>

<div className="signInBar">
  <p className="signInText">Sign In </p>
  <button className="signInButton">
    <ArrowRight fill='#ffffff' width='34px' height='34px'/>
  </button>
</div>
            </form>
        <Link to='/forgot-password' className="forgotPasswordLink"> Forgot Password</Link>


<Oauth/>

            <Link to='/sign-up' className="registerLink"> Sign Up instead</Link>


        </main>


    </div>
  )
}

export default SignIn