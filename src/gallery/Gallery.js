import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { EnhancedTable } from "./EnhancedTable";
import { EnhancedModal } from "./EnhancedModal";
import Navbarx from '../navbar/Navbarx';

export const Gallery = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showTopTags, setShowTopTags] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const galleryIndex = currentUrl.indexOf('gallery/');

    // Check if "gallery/" is present in the URL and has something right from it
    setShowReturnButton(galleryIndex !== -1 && galleryIndex + 8 < currentUrl.length);
  }, [window.location.pathname]);

  const handleButtonClick = () => {
    // Get the current URL
    const currentUrl = window.location.pathname;

    // Find the last '/' in the URL
    const lastSlashIndex = currentUrl.lastIndexOf('/');

    // Remove the last part of the URL
    const newUrl = currentUrl.substring(0, lastSlashIndex);

    // Navigate to the modified URL
    navigate(newUrl);
    window.location.reload();

  };

  return (
    <>
      <Navbarx
        navitems={props.navitems}
        setShowTopTags={setShowTopTags}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {showReturnButton && (
        <nav style={{
          position: 'fixed',
          top: '10px',
          left: '75px', // Adjusted to 5px right from the button
          zIndex: 2,
          height: '60px', // Same height as the button
          width: '60px', // Same width as the button
          backgroundColor: showTopTags ? '#B36704' : '#D97706',
          border: 'none',
          boxShadow: '5px 5px #000',
        }}>
          <button
            type="button"
            onClick={handleButtonClick}
            style={{
              height: '100%',
              width: '100%',
              border: 'none',
              background: 'transparent',
            }}
          >
            {/* Use a return icon or text as needed */}
            <span style={{ fontSize: '45px' }}>&#8592;</span>
          </button>
        </nav>
      )}

      <EnhancedModal
        notes="note"
        images="image"
        videos="videos"
        defaultratio=""
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <div className="py-8" style={{ marginTop: '10px' }}>
        <EnhancedTable
          notes="note"
          images="image"
          videos="videos"
          defaultratio=""
          showModal={showModal}
          setShowModal={setShowModal}
          showTopTags={showTopTags}
          setShowTopTags={setShowTopTags}
        />
      </div>
    </>
  );
};
