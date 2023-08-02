import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import Navbarrm from './Navbarrm';
import { EnhancedModal } from './EnhancedModal';
import { EnhancedTable } from "./EnhancedTable";
import { useLocation } from 'react-router-dom';


const MapComponent = () => {
  const location = useLocation();
  const showTable = location.pathname.startsWith('/map/'); // Check if the current location starts with "/map/" followed by a suffix (you can update the condition as needed)
  const position = [47.5596, 7.5886]; // The coordinates for Basel
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbarrm showModal={showModal} setShowModal={setShowModal} />
      <EnhancedModal notes="spot" images="spot" videos="spot" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
      {/^\/map\//.test(location.pathname) &&  <div style={{
  position: 'absolute', 
  top: '70vh', 
  width: '100%', 
  minHeight: '30vh', // this will make sure it stretches at least until the bottom of the viewport
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex', // this will make the child elements (the table) use flexbox
  flexDirection: 'column', // this will make the table stack vertically
  justifyContent: 'flex-end' // this will align the table to the bottom
}}>
  {showTable && <EnhancedTable notes="spot" images="spot" videos="spot" defaultratio="" />}
      </div> }
    </>
  );
};

export default MapComponent;
