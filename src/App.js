import {Routes, Route} from 'react-router-dom'
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
        <Route path='/offers' element={<Offers/>} />
        <Route path='/sign-in' element={<Profile />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />


</Routes>
      <Navbar />
    </>
  );
}

export default App;
