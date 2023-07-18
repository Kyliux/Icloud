import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./Auth";
import { Login } from "./Login";
import { Logout } from "./Logout";
import ReactDOM from "react-dom";
import { signIn } from "@junobuild/core";
import { signOut } from "@junobuild/core";


const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [leftIsOpen, setLeftIsOpen] = useState(false);
  const [rightIsOpen, setRightIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const leftNavItems = ["Home", "Map", "Story", "Gallery"];
  const rightNavItems = ["Tags", user !== undefined && user !== null ? "Logout" : "Login"];
  const leftMenuRef = useRef(null);
  const rightMenuRef = useRef(null);

  const handleDonate = () => {
    closeNavbar();

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
            <button className="bg-gray-500 text-white py-1 px-2 mt-2 rounded" onClick={() => handleClose()}>
              Close
            </button>
          </div>
        </div>
      );
    };

    const handleClose = () => {
      ReactDOM.unmountComponentAtNode(modalRoot);
    };

    const modalRoot = document.getElementById("modal-root");
    ReactDOM.render(<Modal />, modalRoot);
  };

  const handleLeftNavToggle = () => {
    setRightIsOpen(false);  // Close right menu
    setLeftIsOpen(prevState => !prevState);
  };

  const handleRightNavToggle = () => {
    setLeftIsOpen(false);  // Close left menu
    setRightIsOpen(prevState => !prevState);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    closeNavbar();
  };

  const closeNavbar = () => {
    setLeftIsOpen(false);
    setRightIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
  
      if (leftMenuRef.current && !leftMenuRef.current.contains(event.target)) {
        setLeftIsOpen(false);
      }
      if (rightMenuRef.current && !rightMenuRef.current.contains(event.target)) {
        setRightIsOpen(false);
      }
    };
  
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  
  

  return (
    <>
      <nav style={{ position: 'fixed', left: '20px', top: '20px', zIndex: 2 }}>
        <button type="button" onClick={handleLeftNavToggle} style={{ backgroundColor: leftIsOpen ? '#B36704' : '#D97706', border: 'none', boxShadow: '5px 5px #000' }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 0 24 24" width="80px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>

        </button>
      </nav>

      <nav style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 2 }}>
        <button type="button" onClick={handleRightNavToggle} style={{ backgroundColor: rightIsOpen ? '#B36704' : '#D97706', border: 'none', boxShadow: '5px 5px #000' }}>
          <svg height="80px" width="80px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,20)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,14.0246)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g><g transform="matrix(1.03309e-17,-0.168717,1.25,7.65404e-17,-3,8.04921)"><path d="M24,10.4L0,10.4L0,13.6L24,13.6L24,10.4Z"></path></g></svg>
        </button>
      </nav>

      {renderMenu(leftIsOpen, leftMenuRef, leftNavItems, handleDonate, handleItemClick, user, true)}
      {renderMenu(rightIsOpen, rightMenuRef, rightNavItems, handleDonate, handleItemClick, user)}
    </>
  );
};
const renderMenu = (isOpen, menuRef, navItems, handleDonate, handleItemClick, user, hasExtraItems = false) => {
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
            {item === "Login" ? (
              <div 
                style={navItemStyle} 
                onClick={() => user ? signOut() : signIn() }
                onMouseOver={(e) => e.target.style.backgroundColor = '#B36704'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
              >
                {user ? 'Logout' : 'Sign In'}
              </div>
            ) : item}
          </li>
        ))}
        {hasExtraItems && (
          <li>
            <div 
              style={navItemStyle}
              onClick={handleDonate}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B36704'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'inherit'}
            >
              Donate
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

const menuStyle = {
  position: 'fixed', 
  top: '15%', 
  left: '15%', 
  width: '70%', 
  height: '50%', 
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
  fontSize: 'calc(2em * 0.7)'  // Reducing text size by 30%
};

const navItemStyle = {
  width: '100%', 
  backgroundColor: 'inherit', 
  color: '#fff', 
  fontSize: 'calc(2em * 0.7)',  // Reducing text size by 30%
  border: 'none', 
  padding: '20px 0', 
  display: 'block', 
  cursor: 'pointer'
};

export default Navbar;