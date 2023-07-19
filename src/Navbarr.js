import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./Auth";
import { signIn, signOut } from "@junobuild/core";


const Navbarr = ({ setShowTopTags }) => {
  const { user } = useContext(AuthContext);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rightNavItems = ["Tags 👀", user !== undefined && user !== null ? "Logout" : "Login"];
  const rightMenuRef = useRef(null);

 


  const handleRightNavToggle = () => {
    setRightIsOpen(prevState => !prevState);
  };

  const handleItemClick = (item) => {
    if (item === "Login") {
      user ? signOut() : signIn();
    } else if (item === "Logout") {
      user ? signOut() : signIn();
    } else if (item === "Tags 👀") {
      setShowTopTags((prevShowTopTags) => !prevShowTopTags);

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
      <nav style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 2 }}>
        <button type="button" onClick={handleRightNavToggle} style={{ backgroundColor: rightIsOpen ? '#B36704' : '#D97706', border: 'none', boxShadow: '5px 5px #000' }}>
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

  if (reorderedNavItems.includes("Login")) {
    reorderedNavItems = ["Login", ...reorderedNavItems.filter(item => item !== "Login")];
  }


  return (
    <div ref={menuRef} style={menuStyle}>
      <ul style={ulStyle}>
        {reorderedNavItems.map((item, index) => (
          <li key={index} style={liStyle}>
            <div 
              style={{
                ...navItemStyle,
                backgroundColor: item === selectedItem ? '#B36704' : 'inherit'
              }}
              onClick={() => handleItemClick(item)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B36704'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
            >
              {item === "Login" ? (user ? 'Logout' : 'Sign In') : item}
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
  backgroundColor: '#D97706', 
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

export default Navbarr;