import React,{useState, useEffect, useRef}    from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'

import { useNavigate } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {toast}  from 'react-toastify'

import Spinner from '../components/Spinner'

 const CreateListing = () => {
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true) 
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        "name": "",
        "type": "rent",
        "bedrooms": 1,
        "bathrooms": 1,
        "parking": false,
        "furnished": false,
        "offer": false,
        "regularPrice": 0,
        "discountedPrice": 0,
        address:"",
        "images":[],
        latitude:0,
        longitude:0,
    

    })

     const {name,
         type,
         bedrooms,
        bathrooms,
        parking,
        furnished,
        offer,
         regularPrice,
         discountedPrice,
        address,
        images,
         latitude,
       longitude,
       
} = formData
    const navigate = useNavigate();
    const auth = getAuth()


     const handleChange = (e )=> {

        //check fro boolean
let boolean = null;
if(e.target.value === 'true'){
    boolean =  true
}
if(e.target.value === 'false'){
    boolean = false;
}

//check fro files
if(e.target.files){
    setFormData((prevState) => ({
        ...prevState,
        images:e.target.files
    }))
}

if(!e.target.files){
    setFormData((prevState) =>( {
        ...prevState,
        [e.target.id]:boolean ?? [e.target.value]

    }))
}
     }

     const handleSubmit = async(e) => {
         e.preventDefault();
         setIsLoading(true)
         if(discountedPrice > regularPrice){
            console.log(discountedPrice)
            console.log(regularPrice)
            setIsLoading(false)
            toast.error('Discounted price should be lesser than regular price')
            return
         }
         if(images.length >6){
            toast.error('max images should be 6')
            return
         }

         let geoLocation = {};
         let location = "";
         if(geoLocationEnabled){
      
             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API}`)

             const data = await response.json()
             console.log(data.results)
             geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0
             geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0
             location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0].formatted_address

             if(location === undefined || location.includes('undefined')){
                setIsLoading(false)
                toast.error('Please enter the correct address')
                return 
             }

         }else{
            geoLocation.lat =latitude
            geoLocation.lng=longitude
            // location=address
         }



     //store images in firebase

     const storeImage = async(image) => {
        
        //return a new pro,ise
        return new Promise((resolve, reject) => {

            const storage = getStorage();
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef = ref(storage, 'images/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef,image);
        

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => { 
                  reject(error)
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                        console.log('File available at', downloadURL);
                    });
                }
            );
        })

    }

        const imageUrls = await Promise.all(
        [...images].map((image) => storeImage(image) )
        ).catch(() => {
            setIsLoading(false)
            toast.error('Images not Uploaded ')
            return
        })
        console.log(imageUrls)

 

     const formDataCopy = {
        ...formData,
        imageUrls:imageUrls,
        geoLocation:geoLocation,
         timestamp: serverTimestamp()

      

     }

         formDataCopy.location = address
     delete formDataCopy.images;
     delete formDataCopy.address;
     //location && (formDataCopy.location = location);
     !formDataCopy.offer && delete formDataCopy.discountedPrice;



     //in our document reference we pass three arguments  collection , collection name and data
         const docRef = addDoc( collection(db, 'listings'), formDataCopy)

         setIsLoading(false)
         toast.success('Listing Saved')
navigate(`/category/${formDataCopy.type}/ ${docRef.id}`)


     }

   

//first step
    const  isMounted = useRef(true)
    
    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth,(user) => {
                if(user){
                    setFormData({
                        ...formData, 
                        userRef:user.uid,
                    })
                }else{
                    navigate('/sign-in')
                }
            } )
        }

        return () =>{
            isMounted.current = false;
        }
    }, [isMounted])


    if(isLoading) return <Spinner/>
  return (
 <div className="profile">
    <header>
        <p className="pageHeader">
            Create A Listing
        </p>
    </header>

    <main>
        <form onSubmit={handleSubmit}>
                  <label className='formLabel'>   Sell / Rent  </label>
                <div className="formButtons">
                    <button type='button' 
                          className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                    id='type'
                    value='sale'
                    onClick={handleChange}>
                        Sell
                    </button>
                          <button type='button'
                              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                              id='type'
                              value='sale'
                              onClick={handleChange}>
                              Rent
                          </button>
                </div>
        
                  <label className='formLabel'>  Name      </label>
        <input className='formInput' 
        type="text" id='name'
         value={name} 
         onChange={handleChange}
         maxLength='32'
         minLength='10' 
            required
         />


     

            <div className="formRooms flex">

                <div>
                          <label className='formLabel'>  Bedrooms       </label>
                              <input className='formInputSmall'
                                  type="number" id='bedrooms'
                                  value={bedrooms}
                                  onChange={handleChange}
                                  maxLength='50'
                                  minLength='1'
                                  required
                              />
                    
                          <label className='formLabel'>    Bathrooms   </label>
                              <input className='formInputSmall'
                                  type="number" id='bathrooms'
                                  value={bathrooms}
                                  onChange={handleChange}
                                  maxLength='50'
                                  minLength='1'
                                  required
                              />
                   
                </div>
            </div>
           
            <label className='formLabel'>Parking </label>
                  <div className="formButtons">
                      <button type='button'
                          className={parking ? 'formButtonActive' : 'formButton'}
                          id='parking'
                          value={true}
                          onClick={handleChange}>
                         Yes
                      </button>
                      <button type='button'
                          className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                          id='type'
                          value={false}
                          onClick={handleChange}>
                     No
                      </button>
                  </div>
            <label className='formLabel'> Furnished</label>
                  <div className="formButtons">
                      <button type='button'
                          className={furnished ? 'formButtonActive' : 'formButton'}
                          id='furnished'
                          value={true}
                          onClick={handleChange}>
                          Yes
                      </button>
                      <button type='button'
                          className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                          id='type'
                          value={false}
                          onClick={handleChange}>
                          No
                      </button>
                  </div>
            <label className='formLabel'>Address</label>
                  <textarea type="text" className='formInputAddress' id='address' value={address} onChange={handleChange} required/>
                  {!geoLocationEnabled && (
                    <div className="formLatLng flex">
                        <div>
                              <label className='formLabel'>Latitude </label>
                              <input type="number" className="formInputSmall" id={latitude} value={latitude} onChange={handleChange}  required/>
                        </div>
                   
                   
                       
                          <div> 
                            
                              <label className='formLabel'>Longitude </label>
                              <input type="number" className="formInputSmall" id={longitude} value={longitude} onChange={handleChange} required />
                          </div>
                    </div>
                  ) }
         
            
            
            
            <label className='formLabel'>Offer</label>
                  <div className="formButtons">
                      <button type='button'
                          className={offer ? 'formButtonActive' : 'formButton'}
                          id='offer'
                          value={true}
                          onClick={handleChange}>
                          Yes
                      </button>
                      <button type='button'
                          className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                          id='type'
                          value={false}
                          onClick={handleChange}>
                          No
                      </button>
                      </div>
            
            
            <label className='formLabel'>Regular Price </label>
            <div className="formPriceDiv">
                      <input className='formInputSmall'
                          type="number" id='regularPrice'
                          value={regularPrice}
                          onChange={handleChange}
                          minLength='50'
                          maxLength='750000000'
                         
                          required
                      />
                      {formData.type ==='rent' &&(
                      <p className="formPriceText">
                        $ / Month
                      </p>
                      )}
            </div>
             
             {offer && (
                <>
                          <label className='formLabel'>Discounted Price </label>
                          <div className="formPriceDiv">
                              <input className='formInputSmall'
                                  type="number" id='discountedPrice'
                                  value={discountedPrice}
                                  onChange={handleChange}
                                  minLength='50'
                                  maxLength='750000000'
                               
                                  required={offer}
                              />
                              {formData.type === 'rent' && (
                                  <p className="formPriceText">
                                      $ / Month
                                  </p>
                              )}
                          </div>
                </>
             )}

             
                  <label className='formLabel'> Images</label>
                  <p className="imagesInfo">
                    The first Image will be the cover (max 6)
                  </p>
                  <input type="file" className='formInputFile' id='images' onChange={handleChange}  max={6} accept='.jpg,.png,.jpeg' multiple required/>

<button className="primaryButton createListingButton" type='submit'>
    Create Listing
</button>
        </form>
    </main>
 </div>
  )
}

export default CreateListing