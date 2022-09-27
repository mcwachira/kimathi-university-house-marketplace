import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import BathtubIcon  from '../assets/svg/bathtubIcon.svg'
import BedIcon from '../assets/svg/bedIcon.svg'
const ListingItem = ({listing, id, onDelete}) => {
  return (
 <li className="categoryListing">
 <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
              <img src={listing.imageUrls[0]} alt={listing.name} className='categoryListingImg'/>
              <div className="categoryListingDetails">
                <p className="categoryListingLocation">
{listing.location}
                </p>

                <p className="categoryListingPrice">
                    ${listing.offer? (listing.discountedPrice
                          .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : (listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
                          {listing.type ==='rent' &&  ' / Month '}
                </p>
                <div className="categoryListingInfoDiv">
                <img src={BedIcon} alt="bed" />
                <p className="categoryInfoText">
                          {listing.bedroom > 1 ? `${listing.bedrooms} bedrooms ` : '1 bedroom '}
                </p>
               

                      <img src={BathtubIcon} alt="bathtub" />
                      <p className="categoryInfoText">
                          {listing.bathrooms> 1 ? `${listing.bathrooms} bathrooms` : '1 bathroom '}
                      </p>
                </div>
              </div>
 </Link>
  
  {onDelete && (
    <DeleteIcon className='removeIcon' fill='rgba(231, 76,60' onClick={() => onDelete(listing.id, listing.name)}/>
  )}

 </li>
  )
}

export default ListingItem