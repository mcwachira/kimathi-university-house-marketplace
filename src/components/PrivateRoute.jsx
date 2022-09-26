import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hookes/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {

    const{ checkingStatus, loggedInStatus } = useAuthStatus()
    if(checkingStatus){
        return <h1>
            <Spinner/>
        </h1>
    }

  return  loggedInStatus ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute