import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./Auth";
import { signIn, signOut } from "@junobuild/core";
import { principal } from "./Principalid";
import textureImage from './paper.jpg';


const Navbarrm = ({ setShowTopTags, showModal, setShowModal }) => {
  const { user } = useContext(AuthContext);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rightNavItems = ["Show GPSlist", "Add spot", user !== undefined && user !== null ? "Logout 🔒 " : "Login 🔑 "];
  const rightMenuRef = useRef(null);

  const Overlay = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 998, // increase the zIndex
      }}></div>
    )
  }


  const handleRightNavToggle = () => {
    setRightIsOpen(prevState => !prevState);
  };

  const handleItemClick = (item) => {
    if (item === "Login 🔑 ") {
      user ? signOut() : signIn();
    } else if (item === "Logout 🔒 ") {
      user ? signOut() : signIn();
    } else if (item === "Show GPSlist") {
      setShowTopTags((prevShowTopTags) => !prevShowTopTags);

    } else if (item === "Add spot") {
      console.log("userkey :", user.key);

      console.log("has cliked on add spot principal ? :", principal.includes(user.key));

      setShowModal(true);
      console.log(showModal);
    }
    setSelectedItem(item);
    setRightIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
      if (rightMenuRef.current && !rightMenuRef.current.contains(event.target)) {
        setRightIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {rightIsOpen && <Overlay />}
      <nav style={{ position: 'fixed', right: '10px', top: '10px', zIndex: 1000 }}>
        <button type="button" onClick={handleRightNavToggle} style={{ backgroundColor: rightIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)', border: 'none', boxShadow: '5px 5px #000' }}>
          <svg height="60px" width="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,20)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,14.0246)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,8.04921)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g></svg>
        </button>
      </nav>
      
      {renderMenu(rightIsOpen, rightMenuRef, rightNavItems, handleItemClick, user, setShowTopTags, selectedItem, true)}
    </>
  );
};

const renderMenu = (isOpen, menuRef, navItems, handleItemClick, user, setShowTopTags, selectedItem = false) => {
  if (!isOpen) return null;

  let reorderedNavItems = [...navItems];

  if (reorderedNavItems.includes("Login 🔑 ")) {
    reorderedNavItems = ["Login 🔑 ", ...reorderedNavItems.filter(item => item !== "Login 🔑 ")];
  }


  return (
    <div ref={menuRef} style={menuStyle}>
      <ul style={ulStyle}>
        {reorderedNavItems.map((item, index) => (
          <li key={index} style={liStyle}>
            <div 
              style={{
                ...navItemStyle,
                backgroundColor: item === selectedItem ? 'rgba(0, 0, 0, 0.3)' : 'inherit'
              }}
              onClick={() => handleItemClick(item)}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
            >
              {item === "Login 🔑 " ? (user ? 'Logout 🔒 ' : 'Login 🔑 ') : item}
            </div>
          </li>
        ))}
        {/*hasExtraItems && (
          <li style={liStyle}>
            <div 
              style={{
                ...navItemStyle,
                backgroundColor: selectedItem === "Donate" ? '#B36704' : 'inherit'
              }}
              onClick={() => handleItemClick("Donate")}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B36704'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
            >
              Donate
            </div>
          </li>
            )*/}
      </ul>
    </div>
  );
};

const menuStyle = {
  position: 'fixed', 
  top: '15%', 
  left: '15%', 
  width: '70%',  
  background: `linear-gradient(0deg, rgba(169, 169, 169, 0.7), rgba(169, 169, 169, 0.7)), url(${textureImage})`,
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



export default Navbarrm;