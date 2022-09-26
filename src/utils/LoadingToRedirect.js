import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const LoadingToRedirect = () => {
    
    const navigate = useNavigate()
    const [count, setCount] = useState(5)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount)
        }, 1000)


        count === 0 && navigate('/sign-in')

        return () => clearInterval(interval)
    }, [count, navigate])
  return (
    <div>{count &&(<h3>We are redirecting you in {count} seconds </h3>)} </div>
  )
}

export default LoadingToRedirect