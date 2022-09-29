import React, {useState, useEffect} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../firebase/firebase'
import {doc, getDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'

const Contact = () => {
    const [landLord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()
    console.log(params.landlordId)

    useEffect(() => {
        const getLandlord = async() => {
            const userRef = doc(db, 'users', params.landlordId)
            const documentSnapshot = await getDoc(userRef)
          

            if(documentSnapshot.exists()){
                console.log(documentSnapshot.data())
                    setLandlord(documentSnapshot.data())
            }else{

                toast.error('cannot get land lord data')
            
            }
        }

        getLandlord()

       
    }, [params.landlordId])

    const handleChange = (e) => setMessage(e.target.value)

  return (
   <div className="pageContainer">
   {console.log(landLord)}
   <header>
              <p className="pageHeader">
                  Contact Landlord
              </p>
   </header>
  
  {landLord !==null  && (
    <main>
        <div className="contactLandlord">
  
                          <p className="landlordName">
                              Contact {landLord?.name}
               </p> 
    </div>
            <div className="messageForm">
                <div className="messageDiv">
                    <label className="messageLabel">
                        Message
                    </label>
                    <textarea name="message" id="message" value={message} onChange={handleChange} className="textarea"></textarea>
                </div>

                <a href={`mailto:${landLord.email}?Subject=${searchParams}.get('listingName)&body=${message}`}>
                    <button className="primaryButton" type='button'> Send Message</button>
                </a>
            </div>
 
    </main>
  )}
   </div>
  )
}

export default Contact