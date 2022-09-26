import React ,{useState, useEffect, useRef} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LoadingToRedirect from '../utils/LoadingToRedirect'

const ProtectedAuthRoute = (
    {
        children,
         redirectPath='/sing-in'
        }) => {


    const [checkingStatus, setCheckingStatus] = useState(true)
    const [loggedInStatus, setLoggedInStatus] = useState(false)
  
    //for unmounting my onAuthState
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted){
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedInStatus(true)
                }
                setCheckingStatus(false)
            })
        }

        return () => isMounted.current = false;

    }, [loggedInStatus])


    return loggedInStatus ? ( <div> {children}</div>):( <LoadingToRedirect/>)
        }

        export default ProtectedAuthRoute