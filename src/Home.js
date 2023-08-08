import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import Navbarx from './navbar/Navbarx';
import { Modalx } from './gallery/Modalx';
import { EnhancedTable } from "./gallery/EnhancedTable";
import { useLocation } from 'react-router-dom';
import { stylo } from '@papyrs/stylo/';

//data type button to give Navbarx
// button name + onclickfct

//data type modal for the story
// 1. title, date, author, publishedbool, imgurl, articleurl, text
// 2.                                                             , poolid
// 3. 
// keyDBname





const Home = (props) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbarx navitems={props.navitems} showModal={showModal} setShowModal={setShowModal} />
      <stylo />
      <Modalx notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
      <div style={{ position: 'absolute', top: 100, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 2 }}>
        <h1 style={{ textAlign: 'center', paddingTop: '10%', fontSize: '3em', fontWeight: 'bold', color: 'white' }}>Site Under Construction</h1>
        <hr style={{ margin: '0 auto', width: '50%', borderColor: 'white', opacity: 0.3 }} />
        <p style={{ textAlign: 'center', marginTop: '5%', fontSize: '1.5em', fontWeight: 'bold', color: 'white' }}>We're working hard to finish this page. Please check back later!</p>
      </div>
    </>
  );
};

export default Home;
