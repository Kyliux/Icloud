import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./Auth";
import ReactDOM from "react-dom";
import MapComponent from "./MapComponent";



const Navbar = ({ leftPadding  }) => {
  const [leftIsOpen, setLeftIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
const leftNavItems = ["🏠 Home", "🗺️  Map ", "📖  Story ", "🖼️ Gallery", "💰 Donate"];
const [showMap, setShowMap] = useState(false);


  const handleLeftNavToggle = () => {
    setLeftIsOpen(prevState => !prevState);
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

  const handleItemClick = (item) => {
    if (item === "Maps") {
      // Open the MapComponent
      setSelectedItem(item);
    } else if (item === "💰 Donate") {
      handleDonate();
    }
    setSelectedItem(item);
    setLeftIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu")) {
        setLeftIsOpen(false);
      }
    };
  
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav style={{ position: 'fixed', top: '20px', zIndex: 2, padding: leftPadding}}>
        <button type="button" onClick={handleLeftNavToggle} style={{ backgroundColor: leftIsOpen ? '#B36704' : '#D97706', border: 'none', boxShadow: '5px 5px #000' }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 0 24 24" width="60px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </button>
      </nav>
      {showMap && <MapComponent />}
      {renderMenu(leftIsOpen, leftNavItems, handleItemClick, selectedItem)}
    </>
  );
};

const renderMenu = (isOpen, navItems, handleItemClick, user, selectedItem) => {
  if (!isOpen) return null;

  let reorderedNavItems = [...navItems];

  if (reorderedNavItems.includes("Login")) {
    reorderedNavItems = ["Login", ...reorderedNavItems.filter(item => item !== "Login")];
  }

  return (
    <div style={menuStyle} className="menu">
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

export default Navbar;
