import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
const Offers = () => {

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)


  const params = useParams()

  useEffect(() => {

    const fetchListings = async () => {
      try {


        //instead of creating a collection reference we can directly create a snapshot of the data
        // const querySnapshot = await (getDocs(collection(db, 'listings')))

        //get collection reference
        const listingRef = collection(db, 'listings')

     
        //create a query 
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        )


        //create a snapshot
        const querySnapshot = await getDocs(q)


        //create an array to store data gotten from firebase
        const listing = []



        querySnapshot.forEach((doc) => {


          console.log(doc.data());
          return listing.push({
            id: doc.id,
            data: doc.data()
          })
        })

        console.log(listing)
        setListings(listing)
        setLoading(false)


      } catch (error) {
        toast.error('Could not fetch listings')
        console.log(error)
      }
    }



    fetchListings()
  }, [])
  return (
    <div className="category">
      <p className="pageHeader">

Offers
      </p>

      {loading ? <Spinner /> : listings && listings.length > 0 ? (<>

        <main>
          <ul className="categoryListings">
            {listings.map((listing) => (<ListingItem listing={listing.data} id={listing.id} key={listing.id} />))}
          </ul>
        </main>


      </>) : (<h1>

There are no current Offers
      </h1>)}
    </div>
  )
}

export default Offers