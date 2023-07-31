import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { listDocs, delDoc, deleteAsset, listAssets } from "@junobuild/core";
import { authSubscribe } from "@junobuild/core";
import { initJuno } from "@junobuild/core";
import { GeoJSON } from 'react-leaflet';

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



const Background = () => {
  const location = useLocation();
  const showMap = location.pathname.startsWith("/map"); // Check if the current location starts with "/map"
  const key = location.pathname;
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(undefined);
  const [busy, setBusy] = useState(undefined);
  const navigate = useNavigate();
  const [bikeRoutes, setBikeRoutes] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [centerPosition, setCenterPosition] = useState([48.5734, 7.7521]);

  useEffect(() => {
    fetch('https://data.public.lu/fr/datasets/r/ca2c3945-6c5c-4ce6-a0cb-4164ce6112af')
      .then(response => response.json())
      .then(data => setBikeRoutes(data));
  }, []);

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "m5rwi-daaaa-aaaal-acrpq-cai",
      }))();
  }, []);

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));
    return () => sub();
  }, []);

  useEffect(() => {
    list();
  }, []);

  async function list() {
    const { items } = await listDocs({
      collection: "spot",
      filter: {},
    });
    console.log("Fetched items: ", items); // Debug line
    setItems(items);
  }

  const handleMarkerClick = (item) => {
    const tagSuffix = item.data.tags;
    const currentUrl = location.pathname;
    navigate(`${currentUrl}/${tagSuffix}`);
    setShowPopup(true);
    // Update the center of the map to the clicked marker's position
    setCenterPosition([item.data.gps.lat, item.data.gps.lng]);
  };

  // Find the latest item by date
  const latestItem = items.reduce((latest, item) => {
    console.log("Current item date:", item.data.date); // Debug line
    if (!latest) {
      console.log("No latest item yet, setting current item as latest"); // Debug line
      return item;
    }
    if (new Date(item.data.date) > new Date(latest.data.date)) {
      console.log("Current item is newer than latest, updating latest"); // Debug line
      return item;
    }
    console.log("Current item is not newer than latest, keeping existing latest"); // Debug line
    return latest;
  }, null);

  // Update the center position whenever the latestItem changes
  useEffect(() => {
    if (latestItem && latestItem.data.gps) {
      setCenterPosition([latestItem.data.gps.lat, latestItem.data.gps.lng]);
    }
  }, [latestItem]);

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center);
    }, [center]); // Re-run when 'center' changes
    return null; // No need to return anything
  };

  const createMarker = (item) => {
    console.log("Creating marker for item: ", item); // Debug line
    if (!item.data.gps) {
      console.log('Missing gps data for item: ', item);
      return null; // or handle it in any other way
    }
    const icon = new L.DivIcon({
      html: `<div style="font-size:24px;">${item.data.logos}</div>`
    });
    return (
      <Marker
        position={[item.data.gps.lat, item.data.gps.lng]}
        icon={icon}
        key={item.data.date}
        onClick={() => handleMarkerClick(item)} // Attach the onClick handler directly to the Marker component
      >
        <Popup>
          {/* Customize the content of the popup */}
          <div>{item.data.text}</div>
        </Popup>
      </Marker>
    );
  };

  return (
    <BackgroundContainer key={key}>
      {showMap && (
        <StyledMapContainer
          center={centerPosition}
          zoom={13}
          style={{
            filter: showMap ? "none" : "brightness(50%)",
            height: '100%'
          }}
        >
          {bikeRoutes && <GeoJSON data={bikeRoutes} />}

          <MapUpdater center={centerPosition} />

          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {items.map(item => createMarker(item))}
        </StyledMapContainer>
      )}
      {!showMap && <DarkOverlay height={window.innerHeight} />}
    </BackgroundContainer>
  );
};

export default Background;