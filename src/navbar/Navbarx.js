import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Auth";
import ReactDOM from "react-dom";
import MapComponent from "../map/MapComponent";
import textureImage from '../config/paper.jpg';
import { signIn, signOut } from "@junobuild/core";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";


const Navbarx = ({ setShowTopTags, navitems, showModal, setShowModal  }) => {
  const [leftIsOpen, setLeftIsOpen] = useState(false);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  const [selectedRightItem, setSelectedRightItem] = useState(null);
  const { user } = useContext(AuthContext);
  const leftNavItems = navitems.navitemsleft;
  const rightNavItems = navitems.navitemsright;
  const [showMap, setShowMap] = useState(false);
  const leftMenuRef = useRef(null);
  const rightMenuRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const navigate = useNavigate();


  const handleNavToggleLeft = () => {
    setLeftIsOpen(prevState => !prevState);
    if (rightIsOpen) {
      setRightIsOpen(false);
    }
  };

  const handleNavToggleRight = () => {
    setRightIsOpen(prevState => !prevState);
    if (leftIsOpen) {
      setLeftIsOpen(false);
    }
  };

  const handleDonate = () => {
    const address = "c6469203131ae3a107f303fd85de7e39bd148e74643c97d5131da08eea567124";
    const message = `Cheers 🥂 ! If you like what I do, feel free to donate to keep this page online. Just send ICP to the following address, it is instantly 🔥 to create cycle 🔄 for this website: ${address}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(address).then(() => {
        alert("Address copied to clipboard!");
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    };

    const Modal = () => {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded p-8 shadow-lg">
            <p>{message}</p>
            <button className="bg-blue-500 text-white py-1 px-2 mt-2 rounded" onClick={handleCopy}>
              Copy Address
            </button>
            <button className="bg-gray-500 text-white py-1 px-2 mt-2 rounded" onClick={() => ReactDOM.unmountComponentAtNode(modalRoot)}>
              Close
            </button>
          </div>
        </div>
      );
    };

    const modalRoot = document.getElementById("modal-root");
    ReactDOM.render(<Modal />, modalRoot);
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 2, // Make sure it's below the menu's z-index but above the overlayStyle
    display: 'none', // By default, set it to not display
  };

  const buttonStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(245, 226, 133)',
    border: 'none',
    zIndex: 2,
    transition: '0.3s all ease',
  };
  

  const buttonContainerStyle = {
    position: 'fixed',
    width: '60px',
    height: '60px',
    top: '10px',
  };
  
  const buttonShadowStyle = {
    content: '""',
    position: 'absolute',
    top: '5px',
    left: '5px',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1,
  };

  const handleItemClick = (item, menuSide) => {
    console.log(`Item clicked: ${item.name}, menuSide: ${menuSide}`);
    const setSelectedItem = menuSide === 'left' ? setSelectedLeftItem : setSelectedRightItem;
    setSelectedItem(item);
    if (item.name === "💰 Donate") {
      console.log('Handling donate');
      handleDonate();
    } else if (item.name === "🔑" || item === "Logout 🔒 ") {
      console.log(`Handling login/logout: ${user ? 'Logging out' : 'Logging in'}`);
      user ? signOut() : signIn();
    } else if (item.name === "Tags 👀") {
      console.log('Toggling tags');
      setShowTopTags((prevShowTopTags) => !prevShowTopTags);
    } else if (item.name === "Add media" && user) {
      console.log('Showing Add media modal');
      setShowModal(true);
    } else if (item.name === "✍️" && user) {
      console.log('Showing Add Story modal');
      setShowModal(true);
    } else if (item.path) {
      console.log(`Navigating to path: ${item.path}`);
      navigate(item.path);
    } else {
      console.error('No path found for this item:', item);
    }
    if (menuSide === 'left') {
      setLeftIsOpen(false);
    } else {
      setRightIsOpen(false);
    }
  };
  

  const renderMenu = (isOpen, navItems, handleItemClick, user, selectedItem, ref, menuSide) => {
    if (!isOpen) return null;
    let reorderedNavItems = [...navItems];
    if (reorderedNavItems.includes("🔑")) {
      reorderedNavItems = ["Login", ...reorderedNavItems.filter(item => item.name !== "Login")];
    }
    if (leftIsOpen || rightIsOpen) {
      overlayStyle.display = 'block';
    } else {
      overlayStyle.display = 'none';
    }
    return (
      <div ref={ref} style={menuStyle} className="menu">
        <ul style={ulStyle} onClick={() => console.log('UL was clicked!')}>
        {reorderedNavItems.map((item, index) => (
  <li 
    key={index} 
    style={{
      ...liStyle,
      borderBottom: index === reorderedNavItems.length - 1 ? 'none' : liStyle.borderBottom
    }}
  >
    <div 
      style={{
        ...navItemStyle,
        backgroundColor: item === selectedItem ?  'rgba(0,0,0,0.7)' : 'inherit'
      }}
      onClick={() => handleItemClick(item, menuSide)}
      onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
      onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
    >
      {item.name === "🔑" ? (user ? '🔒 ' : '🔑') : item.name}
    </div>
  </li>
))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leftMenuRef.current && leftMenuRef.current.contains(event.target)) return;
      if (rightMenuRef.current && rightMenuRef.current.contains(event.target)) return;
      setLeftIsOpen(false);
      setRightIsOpen(false);
    };
  
    // Attach the handleClickOutside function to the document click event
    document.addEventListener('mousedown', handleClickOutside);
  
    // Return a function to be run on component unmount to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [leftIsOpen, rightIsOpen]); // Re-run

  return (
    <>
    <div style={overlayStyle}></div>
    <div style={{ ...buttonContainerStyle, left: '8px' }}>
      <div style={buttonShadowStyle}></div>
      <button 
        type="button" 
        onClick={handleNavToggleLeft} 
        style={{ 
          ...buttonStyle, 
          backgroundColor: leftIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)', 
          transform: leftIsOpen ? 'translate(5px, 5px)' : 'none' 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 0 24 24" width="60px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
      </button>
    </div>
    <div style={{ ...buttonContainerStyle, right: '8px' }}>
      <div style={buttonShadowStyle}></div>
      <button 
        type="button" 
        onClick={handleNavToggleRight} 
        style={{ 
          ...buttonStyle, 
          backgroundColor: rightIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)', 
          transform: rightIsOpen ? 'translate(5px, 5px)' : 'none' 
        }}
      >
          <svg height="60px" width="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,20)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,14.0246)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,8.04921)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g></svg>
      </button>
    </div>
    {showMap && <MapComponent />}
    {renderMenu(leftIsOpen, leftNavItems, handleItemClick, user, selectedLeftItem, leftMenuRef, 'left')}
    {renderMenu(rightIsOpen, rightNavItems, handleItemClick, user, selectedRightItem, rightMenuRef, 'right')}
  </>
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
  fontSize: `calc(2em * ${window.innerHeight / 1000})`,
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Light thin line
  padding: '0 20px'
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


export default Navbarx;
