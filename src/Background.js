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
import { format } from 'date-fns';


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
  const showMap = location.pathname.includes("/map"); // Check if the current location contains "/map"
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
    const newUrl = currentUrl.replace(/\/map\/[^/]+$/, "/map"); // Remove any previous suffix from the current URL
    navigate(`${newUrl}/${tagSuffix}`);
    setShowPopup(true);
    // Update the center of the map to the clicked marker's position
    setCenterPosition([item.data.gps.lat, item.data.gps.lng]);
  };

  // Find the latest item by date
  const latestItem = items.reduce((latest, item) => {
    if (!latest) {
      return item;
    }
    if (new Date(item.data.date) > new Date(latest.data.date)) {
      return item;
    }
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

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  let result;
  result = screenWidth > screenHeight? 1.1 : 1 ;

    // Calculate the shifted center position to center the map 25% higher
    const shiftedCenterPosition = [
      centerPosition[0] - (centerPosition[0] * 0.30 * result * 0.01 * (100 / screenHeight)),
      centerPosition[1]
    ];


  const createMarker = (item) => {
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
        {/* Custom template for the Popup */}
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.data.tags}</div>
        <div>{item.data.text}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '20px',
            }}
            onClick={() => handleMarkerClick(item)}
          >
            Show Gallery
          </div>
          <div style={{ fontSize: '0.8em' }}>
            {format(new Date(item.data.date), 'EEEE, dd MMMM yyyy')}
          </div>
        </div>
      </Popup>
      </Marker>
    );
  };

  return (
    <BackgroundContainer key={key}>
      {(
        <StyledMapContainer
        center={centerPosition}
        zoom={13}
        style={{
          filter: showMap ? "none" : "brightness(70%)", // Apply overlay if not in "/map"
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          }}
        >
          {bikeRoutes && <GeoJSON data={bikeRoutes} />}

          <MapUpdater center={shiftedCenterPosition} />

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