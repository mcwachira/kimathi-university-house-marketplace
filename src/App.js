import {Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute';
import ProtectedAuthRoute from './components/AuthRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Explore from "./pages/Explore";
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {


  return (
    <>

<Routes>
  <Route path='/' element={<Explore/>}/>
  <Route path='/offers' element={ 
     <ProtectedAuthRoute>
    <Offers/>
  </ProtectedAuthRoute> }/>

   
        <Route path='/profile' element={<PrivateRoute />} >

          <Route path='/profile' element={<Profile />} />

        </Route>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />


</Routes>
      <Navbar />
      <ToastContainer/>
      
    </>
  );
}

export default App;
