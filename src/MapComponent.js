import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';

// Style for MapContainer to make it take full screen
const StyledMapContainer = styled(MapContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
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

const MapComponent = () => {
  const position = [47.5596, 7.5886]; // The coordinates for Basel

  return (
    <StyledMapContainer center={position} zoom={13}>
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Basel 🌟<br />A place of interest.
        </Popup>
      </Marker>
      <MenuButton>Menu</MenuButton>
      <ButtonContainer>
        <button>Add Location</button>
        <button>Remove Location</button>
      </ButtonContainer>
    </StyledMapContainer>
  );
};

export default MapComponent;
