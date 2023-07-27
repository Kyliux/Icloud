import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';
import Navbarrm from './Navbarrm';
import { EnhancedModal } from './EnhancedModal';
import { useState } from 'react';
import { EnhancedTable } from "./EnhancedTable";



const MapComponent = () => {
  const position = [47.5596, 7.5886]; // The coordinates for Basel
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <Navbarrm showModal={showModal} setShowModal={setShowModal}/>
    <EnhancedModal notes="spot" images="spot" videos="spot" defaultratio="" showModal={showModal} setShowModal={setShowModal}/>
    <EnhancedTable notes="spot" images="spot" videos="spot" defaultratio=""  />
</>
  );
};

export default MapComponent;
