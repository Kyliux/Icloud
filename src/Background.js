import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
`;


// Style for MapContainer to make it take full screen
const StyledMapContainer = styled(MapContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${props => props.height}px;
  z-index: 0;

`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${props => props.height}px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MenuButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
`;

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const position = [47.5596, 7.5886]; // The coordinates for Basel


const Background = () => {
  const location = useLocation();
  const showMap = location.pathname.startsWith("/map"); // Check if the current location starts with "/map"

  const key = location.pathname;


    return (
      <BackgroundContainer key={key}>
        { (

        <StyledMapContainer
          center={position}
          zoom={13}
          style={{
            filter: showMap ? "none" : "brightness(50%)",
            height: '100%'
          }}
        >
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              Basel 🌟<br />A place of interest.
            </Popup>
          </Marker>
        </StyledMapContainer>
          )}
        {!showMap && <DarkOverlay height={window.innerHeight} />}

      </BackgroundContainer>
    );
  };

export default Background;