import React, { createContext, useEffect, useState } from "react";
import { authSubscribe } from "@junobuild/core";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import Home from './Home';
import About from './About';
import { Gallery } from './gallery/Gallery';
import MapComponent from './map/MapComponent';
import Story from './story/Story';
import Void from './Void';
import Donate from './Donate';
import Openchat from './Openchat';
import EnhancedTable from './gallery/EnhancedTable'; // Make sure to import EnhancedTable
import textureImage from './config/paper.jpg';

export const AuthContext = createContext();

export const Auth = ({  children }) => {
  const [user, setUser] = useState(undefined);
  const [busy, setBusy] = useState(undefined);
  const [leftIsOpen, setLeftIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navitemsleft = [
    { emoji: "🏠" , name: "Home", path: "/home" },
    { emoji: "🗺️ " ,name: "Map ", path: "/map" },
    { emoji: "📖 " ,name: "Story", path: "/story" },
    { emoji: "🖼️" ,name: "Gallery", path: "/gallery" },
    { emoji: "💰" ,name: "Donate", path: "/donate" } // assuming you have a route for this, change accordingly
  ];
  
  const navitemsright = [
    { emoji: "🔑" ,name: "🔑" }, // assuming you have a route for this, change accordingly
    { emoji: "✍️" , name: "✍️" } // assuming you have a route for this, change accordingly
  ];
  const navitems = {navitemsleft, navitemsright};
  

  const location = useLocation(); // Get the current location

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);



  return (
    <AuthContext.Provider value={{ user, setBusy }}>
    
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home navitems={navitems}/>} />
        <Route path="/about" element={<About />} />
        {/* Render EnhancedTable with or without the tag parameter */}
        <Route path="/gallery/:tag" element={<Gallery navitems={navitems}/>} />
        <Route path="/gallery" element={<Gallery navitems={navitems}/>} />
        <Route path="/map/:tag" element={<MapComponent navitems={navitems}/>} />
        <Route path="/map" element={<MapComponent navitems={navitems}/>} />
        <Route path="/story" element={<Story navitems={navitems} />} />
        <Route path="/story/:tag" element={<Story navitems={navitems} />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/openchat" element={<Openchat />} />
      </Routes>
      {busy ? <Spinner /> : undefined}
      {/*user !== undefined && user !== null ? (
        <div>{children}</div>
      ) : (
        <div>{children}</div>
      )*/}
    </AuthContext.Provider>
  );
};

const menuStyle = {
  position: 'fixed', 
  top: '15%', 
  left: '15%', 
  width: '70%',  
  background: `linear-gradient(0deg, rgba(169, 169, 169, 0.2), rgba(169, 169, 169, 0.2)), url(${textureImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  color: '#fff', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  padding: '20px', 
  boxSizing: 'border-box', 
  zIndex: 999,
  boxShadow: '5px 5px #000'
};


const ulStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%'
};

const liStyle = {
  textAlign: 'center',
  fontSize: `calc(2em * ${window.innerHeight / 1000})`
};

const navItemStyle = {
  width: '100%', 
  background: 'inherit', 
  color: '#fff', 
  fontSize: 'calc(2em * 0.7)',
  border: 'none',
  padding: '20px',
  textAlign: 'center',
  transition: '0.5s'
};

