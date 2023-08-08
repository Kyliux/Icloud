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
import { CircleMarker } from 'react-leaflet';


const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
`;

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

const TextContainer = styled.div`
  font-size: 16px;
  line-height: 1.5;
  min-height: calc(1.5em * 4); // 1.5em line-height multiplied by 4 lines
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
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
  const [items2, setItems2] = useState([]);
  const [itemg, setItemg] = useState([]);
  const [user, setUser] = useState(undefined);
  const [busy, setBusy] = useState(undefined);
  const navigate = useNavigate();
  const [bikeRoutes, setBikeRoutes] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [centerPosition, setCenterPosition] = useState([48.5734, 7.7521]);
  const [mapStyle, setMapStyle] = useState('watercolor');
  const sortedItems = [...items].sort((a, b) => new Date(a.data.date) - new Date(b.data.date));
  const coordinates = sortedItems.map(item => [item.data.gps.lat, item.data.gps.lng]);



 /* useEffect(() => {
    fetch('https://data.public.lu/fr/datasets/r/ca2c3945-6c5c-4ce6-a0cb-4164ce6112af')
      .then(response => response.json())
      .then(data => setBikeRoutes(data));
  }, []);*/

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

  useEffect(() => {
    printmarkerinit();
  }, []);

  async function list() {
    const { items } = await listDocs({
      collection: "spot",
      filter: {},
    });
    //console.log("Fetched items: ", items); // Debug line
    setItems(items);

  }

  async function getCountryOrCityData(locationName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Response:', response);
      console.log('Data:', data);

      if (data.length > 0) {
        const firstResult = data[0];
        if (firstResult.type === 'country' || firstResult.type === 'city') {
          console.error('is a country or city', locationName);
          return {

            isCountryOrCity: true,
            lat: parseFloat(firstResult.lat),
            lng: parseFloat(firstResult.lon),
          }; // The location is a country or city, return the coordinates
        }
      }
  
      return { isCountryOrCity: false }; // The location is neither a country nor a city
    } catch (error) {
      console.error('Error fetching location data:', error);
      return { isCountryOrCity: false }; // Handle error as you see fit
    }
  }

  async function printmarkerinit() {
    const tags = ['Indonesia', 'Taiwan', 'Singapore', 'USA'];
    const newItemg = [];
    
    for (const tag of tags) {
      try {
        const result = await getCountryOrCityData(tag);
        if (result.isCountryOrCity) {
          newItemg.push({
            tag: tag, // Changed from 'tags' to 'tag'
            position: [result.lat, result.lng],
            icon: "🖼️",
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${tag}:`, error);
      }
    }
    
    console.log("Generated itemg:", newItemg);
    setItemg(newItemg);
  }

  


  const getIntermediatePoints = (start, end) => {
    const count = 10; // Number of intermediate points
    const points = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const lat = start[0] + t * (end[0] - start[0]);
      const lng = start[1] + t * (end[1] - start[1]);
      points.push([lat, lng]);
    }
    return points;
  };

  const handleMarkerClick = (item) => {
    const tagSuffix = item.data.tags;
    const currentUrl = location.pathname;
    const newUrl = currentUrl.replace(/\/map\/.*$/, "/map");
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

    const TextContainer = styled.div`
    font-size: 16px;
    line-height: 1.5;
    min-height: calc(1.5em * 4); // 1.5em line-height multiplied by 4 lines
    border: 1px solid #ddd;
    padding: 10px 15px;
    box-sizing: border-box;
    overflow: auto;
    background-color: #f9f9f9; // Soft background color
    color: black; // Black text color
    border-radius: 5px; // Rounded corners
  `;
  
  const DateText = styled.span`
    font-size: 16px;
    color: gray;
  `;

  const TitleDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


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
<TitleDateContainer className="text-xl font-bold mb-2" style={{ color: 'black' }}>
    <span>{item.data.tags}</span>
    <DateText className="text-sm">{format(new Date(item.data.date), 'dd MM yyyy')}</DateText>
  </TitleDateContainer>
  <TextContainer className="text-xl">
    {item.data.text}
  </TextContainer>
  <div className="flex justify-between items-center mt-4" style={{ color: 'black' }}>
    <span></span>
    <span 
      className="underline cursor-pointer ml-5"
      style={{ color: 'black' }} // Black text color
      onClick={() => handleMarkerClick(item)}
    >
      Show Gallery
    </span>
  </div>
</Popup>






      </Marker>
    );
  };

  return (

      <BackgroundContainer key={key}>
        <StyledMapContainer
          center={centerPosition}
          zoom={9}
          style={{
            filter: showMap ? "none" : "brightness(70%)",
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
{coordinates.reduce((acc, curr, index, array) => {
        if (index < array.length - 1) {
          acc.push(...getIntermediatePoints(curr, array[index + 1]));
        }
        return acc;
      }, []).map((point, index) => (
        <CircleMarker
          key={index}
          center={point}
          radius={2} // Adjust the radius of the dots
          fillColor="blue"
          color="blue"
        />
      ))}
          {bikeRoutes && <GeoJSON data={bikeRoutes} />}
          <MapUpdater center={shiftedCenterPosition} />
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
            opacity={0.5}
          />
{items.map(item => createMarker(item))}
{itemg.map(item => createMarker(item))}
        </StyledMapContainer>
        {!showMap && <DarkOverlay height={window.innerHeight} />}
      </BackgroundContainer>
    );
  };
  
export default Background;