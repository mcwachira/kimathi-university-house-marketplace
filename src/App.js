import {Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute';
import ProtectedAuthRoute from './components/AuthRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Category from './pages/Category';
import Explore from "./pages/Explore";
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateListing from './pages/CreateListing';

import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditingListing from './pages/EditingListing';

function App() {


  return (
    <>
<Routes>
  <Route path='/' element={<Explore/>}/>
  <Route path='/offers' element={ 
     <ProtectedAuthRoute>
    <Offers/>
  </ProtectedAuthRoute> }/>

   <Route path='/category/:categoryName' element={<Category/>}/>
        <Route path='/profile' element={<PrivateRoute />} >

          <Route path='/profile' element={<Profile />} />

        </Route>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/category/:categoryName/:listingId' element={<Listing />} />
        <Route path='/contact/:landlordId' element={<Contact />} />
        <Route path='/edit-listing/:listingId' element={<EditingListing/>} />


</Routes>
      <Navbar />
      <ToastContainer/>
      
    </>
  );
}

export default App;
