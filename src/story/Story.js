import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import Navbarx from '../navbar/Navbarx';
import { Modalx } from '../gallery/Modalx';
import { EnhancedTable } from "../gallery/EnhancedTable";
import { useLocation } from 'react-router-dom';

//data type button to give Navbarx
// button name + onclickfct

//data type modal for the story
// 1. title, date, author, publishedbool, imgurl, articleurl, text
// 2.                                                             , poolid
// 3. 
// keyDBname





const Story = (props) => { // Use props instead of navitems
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbarx navitems={props.navitems} showModal={showModal} setShowModal={setShowModal} />
      <Modalx notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Story;