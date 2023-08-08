import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Auth";
import ReactDOM from "react-dom";
import MapComponent from "../map/MapComponent";
import textureImage from '../config/paper.jpg';
import { signIn, signOut } from "@junobuild/core";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import bikeImage1 from '../config/bike0.png';
import bikeImage2 from '../config/bike2.png';

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
  const img = new Image();
  img.src = textureImage;

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

  const randomGrey = () => `rgba(${Math.random() * 40}, ${Math.random() * 40}, ${Math.random() * 40}, 0.5)`;

  
  const handleDonate = () => {
    const address = "c6469203131ae3a107f303fd85de7e39bd148e74643c97d5131da08eea567124";
    const message = `Cheers 🥂 ! If you like what I do, feel free to donate to keep this page online. Just send ICP to the following address, it is instantly 🔥 to create cycle 🔄 for this website: ${address}`;

    setLeftIsOpen(false);
    setRightIsOpen(false);
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
    zIndex: 1000,
    transition: '0.3s all ease',
  };
  

  const buttonContainerStyle = {
    position: 'fixed',
    width: '60px',
    height: '60px',
    top: '10px',
    zIndex: 1000,

  };
  
  const buttonShadowStyle = {
    content: '""',
    position: 'absolute',
    top: '5px',
    left: '5px',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1000,
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
        {reorderedNavItems.map((item, index) => {
             // Skip rendering the item if the name is "✍️" and the user is not logged in
      if (item.name === "✍️" && !user) return null;

          const backgroundColor = randomGrey();
          return (
            <li 
              key={index} 
              style={{
                ...liStyle,
                borderBottom: index === reorderedNavItems.length - 1 ? 'none' : liStyle.borderBottom,
                background: backgroundColor
              }}
              className="nav-item"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = backgroundColor}
            >
              <div style={navItemStyle} onClick={() => handleItemClick(item)}>
                {item.name === "🔑" ? (user ? '🔒 ' : '🔑') : item.name}
              </div>
            </li>
          );
        })}
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
         // backgroundColor: leftIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)',
         background: `linear-gradient(0deg, rgba(169, 169, 169, 0.1), rgba(169, 169, 169, 0.1)), url(${textureImage})`,
          transform: leftIsOpen ? 'translate(5px, 5px)' : 'none' 
        }}
      >
     <div style={{ position: 'relative', height: '60px', width: '60px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      style={{ height: '60px', width: '60px' }}
    >
      {<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="58px" height="58px" baseProfile="basic">
      <path d="M46,39h-0.011c0.002-0.297-0.037-0.597-0.13-0.893c-1.228-3.885-4.502-14.715-8.373-31.334 c-0.063-0.271-0.238-0.503-0.48-0.641c-0.241-0.139-0.529-0.17-0.796-0.086C36.179,6.056,33.072,7,25.51,7 C17.836,7,12.75,6.029,12.7,6.019c-0.271-0.054-0.55,0.009-0.773,0.168c-0.223,0.16-0.371,0.405-0.409,0.678 c-1.315,9.583-4.749,18.678-7.256,25.318c-0.893,2.364-1.664,4.405-2.13,5.945C2.044,38.417,2.009,38.71,2.012,39H2v2h0.015 c-0.002,0.636,0.185,1.26,0.578,1.789C3.165,43.559,4.043,44,5.003,44c0.127,0,0.253-0.024,0.371-0.071L7.7,43h14.725l0.162,0.387 C22.743,43.758,23.107,44,23.51,44h1.431c0.634,0,1.231-0.247,1.678-0.695L26.924,43h13.394l2.301,0.928 C42.738,43.976,42.865,44,42.993,44c0.97,0,1.855-0.448,2.427-1.229c0.385-0.526,0.566-1.143,0.564-1.771H46V39z"/><path fill="#fff" d="M44.902,38.409C43.173,32.938,40.004,22,36.51,7c0,0-3.124,1-11,1s-13-1-13-1 C10.695,20.228,4.8,32.773,3.092,38.418C2.702,39.705,3.661,41,5.006,41l2.504-1H23l0.51,1h1.431c0.364,0,0.713-0.145,0.971-0.402 L26.51,40h14l2.481,1C44.34,41,45.309,39.696,44.902,38.409z"/><path d="M42.99,42c-0.128,0-0.255-0.024-0.374-0.072L40.316,41H26.924l-0.305,0.305C26.171,41.753,25.575,42,24.941,42H23.51 c-0.376,0-0.72-0.211-0.891-0.546L22.387,41H7.702l-2.325,0.929C5.259,41.976,5.133,42,5.006,42c-0.96,0-1.838-0.441-2.41-1.211 c-0.572-0.771-0.74-1.74-0.461-2.661c0.466-1.54,1.237-3.581,2.129-5.945c2.507-6.641,5.94-15.735,7.255-25.318 c0.038-0.272,0.186-0.518,0.409-0.678c0.224-0.159,0.503-0.222,0.773-0.168C12.751,6.028,17.837,7,25.51,7 c7.562,0,10.668-0.944,10.698-0.953c0.267-0.084,0.556-0.053,0.796,0.086c0.242,0.138,0.416,0.369,0.479,0.641 c3.871,16.619,7.145,27.449,8.372,31.334l0,0c0.29,0.917,0.129,1.888-0.439,2.663C44.845,41.552,43.96,42,42.99,42z M24.123,40 h0.818c0.1,0,0.193-0.039,0.263-0.108l0.599-0.599C25.99,39.105,26.245,39,26.51,39h14c0.128,0,0.255,0.024,0.374,0.072l2.269,0.915 c0.26-0.041,0.492-0.182,0.651-0.398c0.188-0.256,0.241-0.576,0.145-0.878l0,0c-1.21-3.83-4.396-14.368-8.184-30.503 C34.248,8.519,31.007,9,25.51,9c-5.92,0-10.269-0.551-12.157-0.843c-1.438,9.423-4.765,18.236-7.217,24.731 c-0.88,2.331-1.64,4.344-2.086,5.819c-0.093,0.308-0.037,0.632,0.153,0.889c0.158,0.213,0.387,0.351,0.643,0.391l2.293-0.916 C7.257,39.024,7.383,39,7.51,39H23c0.376,0,0.72,0.211,0.891,0.546L24.123,40z"/><path d="M14.492,24.718L19,42h-8l2-17.091C13,24.02,14.267,23.857,14.492,24.718z" fill="green"/><path d="M13.992,6.876l-1.984,0.248c1.002,8.018,9.682,32.189,10.051,33.215l1.882-0.678C23.851,39.412,14.967,14.675,13.992,6.876z"/>
      </svg>} </svg>
  </div>
          </button>
    </div>
    <div style={{ ...buttonContainerStyle, right: '8px' }}>
      <div style={buttonShadowStyle}></div>
      <button 
        type="button" 
        onClick={handleNavToggleRight} 
        style={{ 
          ...buttonStyle, 
         // backgroundColor: leftIsOpen ? 'rgb(208, 180, 46)' : 'rgb(245, 226, 133)',
         background: `linear-gradient(0deg, rgba(169, 169, 169, 0.1), rgba(169, 169, 169, 0.1)), url(${textureImage})`,
          transform: rightIsOpen ? 'translate(5px, 5px)' : 'none' 
        }}
      >
  <div style={{ position: 'relative', height: '60px', width: '60px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      style={{ height: '60px', width: '60px' }}
    >
      {<svg fill="none" height="60" viewBox="0 0 40 40" width="60" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
<path d="m19.2883 12.4768c1.0529-5.56302 7.9042-7.67615 11.9076-3.67269 4.0035 4.00349 1.8904 10.85479-3.6726 11.90769l-3.4357.6502c-1.3825.2617-2.4638 1.343-2.7254 2.7255l-.6503 3.4357c-1.0529 5.5629-7.9042 7.6761-11.90766 3.6726-4.00346-4.0034-1.89033-10.8547 3.67266-11.9076l3.4357-.6503c1.3824-.2617 2.4638-1.343 2.7254-2.7254z" fill={'white'}/>
<path d="m28.8389 15.8752c-1.3017 1.3017-3.4123 1.3017-4.714 0-1.3018-1.3018-1.3018-3.4123 0-4.7141 1.3017-1.30172 3.4123-1.30172 4.714 0 1.3018 1.3018 1.3018 3.4123 0 4.7141z" fill={user ? 'green' : 'red'} />
<path d="m15.8753 28.8388c-1.3017 1.3017-3.4123 1.3017-4.714 0-1.30178-1.3018-1.30178-3.4123 0-4.7141 1.3017-1.3017 3.4123-1.3017 4.714 0 1.3018 1.3018 1.3018 3.4123 0 4.7141z" fill="none"/>
</g></svg>}
    </svg>
  </div>
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
  top: '50%',
  left: '50%',
  width: '80%',
  maxWidth: '400px',
  transform: 'translate(-50%, -50%)', // Centers the menu
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
  zIndex: 2000,
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
  height: '100%',
  zIndex: 2000,
};

const liStyle = {
  borderBottom: '1px solid #fff',
  boxShadow: 'none', // Remove left and right semi-shades
};

const navItemStyle = {
  width: '100%',
  background: 'inherit',
  color: '#fff',
  fontSize: 'calc(3em * 0.7)',
  border: 'none',
  padding: '20px',
  textAlign: 'center',
  transition: '0.5s',
  fontFamily: 'Arial Black, Gadget, sans-serif'
};

export default Navbarx;
