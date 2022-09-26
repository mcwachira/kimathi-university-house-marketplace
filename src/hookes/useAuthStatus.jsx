import React , {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'


const useAuthStatus = () => {

    const [checkingStatus, setCheckingStatus] = useState(true)
    const [loggedInStatus,setLoggedInStatus] =  useState(false)
    

    const isMounted = useRef(true)

    useEffect(() => {

        if (isMounted){
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedInStatus(!loggedInStatus)
                }
                setCheckingStatus(!checkingStatus)
            })
        }
       

        return () => isMounted.current =false;
    }, [isMounted])


    return { checkingStatus, loggedInStatus }
}

export default useAuthStatus