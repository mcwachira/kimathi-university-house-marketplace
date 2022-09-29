import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import Spinner from './Spinner'

const locationIcon = new Icon({
    iconUrl:'../assets/svg/icon-location.svg',
    iconSize: [25, 41], iconAnchor: [12, 41]
})
const MapComponent = ({latitude, longitude , location}) => {

    const [loading, setLoading] = useState(false)
  return (
    <>
   { loading ? (<Spinner/>) : (
    <div  className='leafletContainer'>
 {   console.log(latitude)}

          <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{height:'100%', width:'100%'}}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, -longitude]} icon={locationIcon}>
                  <Popup>
                    {location}
                  </Popup>
              </Marker>
          </MapContainer>
    </div>
   )
   }
    </>
  )
}

export default MapComponent



// icon = { new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] }) } />