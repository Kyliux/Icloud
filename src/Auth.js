import { createContext, useEffect, useState } from "react";
import { authSubscribe } from "@junobuild/core";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import Home from './Home';
import About from './About';
import { Gallery }  from './Gallery';
import MapComponent from './MapComponent';
import Story from './Story';
import Void from './Void';
import Donate from './Donate';

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [busy, setBusy] = useState(undefined);
  const [leftIsOpen, setLeftIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const leftNavItems = [
    {name: "🏠 Home", path: "/"}, 
    {name: "🗺️  Map", path: "/map"},
    {name: "📖  Story", path: "/story"},
    {name: "🖼️ Gallery", path: "/gallery"}, 
    {name: "💰 Donate", path: "/donate"},
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);

  const handleLeftNavToggle = () => {
    setLeftIsOpen(prevState => !prevState);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.name);
    navigate(item.path);
    setLeftIsOpen(false);
  };

  return (
    <AuthContext.Provider value={{ user, setBusy }}>
      <nav style={{ position: 'fixed', top: '20px', zIndex: 2}}>
        <button type="button" onClick={handleLeftNavToggle} style={{ backgroundColor: leftIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)', border: 'none', boxShadow: '5px 5px #000' }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 0 24 24" width="60px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </button>
      </nav>
      {leftIsOpen &&
        <>
          <div 
            onClick={handleLeftNavToggle} 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 998, // One level below the menu
              backgroundColor: 'rgba(0,0,0,0.5)', // Optional, can provide a semi-transparent black background
            }}
          />
          <div style={menuStyle} className="menu">
            <ul style={ulStyle}>
              {leftNavItems.map((item, index) => (
                <li key={index} style={liStyle}>
                  <div 
                    style={{
                      ...navItemStyle,
                      backgroundColor: item.name === selectedItem ? 'rgb(151, 125, 31)' : 'inherit'
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(151, 125, 31)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/story" element={<Story />} />
        <Route path="/donate" element={<Donate />} /> 
      </Routes>
      {busy ? <Spinner /> : undefined}
      {user !== undefined && user !== null ? (
        <div>{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </AuthContext.Provider>
  );
};

const menuStyle = {
  position: 'fixed', 
  top: '15%', 
  left: '15%', 
  width: '70%',  
  backgroundColor: 'rgb(208, 180, 46)', 
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
  backgroundColor: 'inherit', 
  color: '#fff', 
  fontSize: 'calc(2em * 0.7)',
  border: 'none',
  padding: '20px',
  textAlign: 'center',
  transition: '0.5s'
};