import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ProfileIcon} from '../assets/svg/personOutlineIcon.svg'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if (location.pathname === route) return true;
    }
  return (
  <footer className="navbar">
    <nav className="navbarNav">
        <ul className="navbarListItems">
                  <li className="navbarListItem" onClick={() => navigate('/') }>
<ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>
                      <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' :'navbarListItemName' }>Explore</p>

            </li>
                  <li className="navbarListItem" onClick={() => navigate('/offers')}>
                      <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                      <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>
                        Offer
                      </p>
                   
                  </li>
                  <li className="navbarListItem" onClick={() => navigate('/sign-in')}>
                     
                      <ProfileIcon fill={pathMatchRoute('/sign-in') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                      <p className={pathMatchRoute('/sign-in') ? 'navbarListItemNameActive' : 'navbarListItemName'}>
                          Profile
                      </p>
                    
                  </li>
        </ul>
    </nav>
  </footer>
  )
}

export default Navbar