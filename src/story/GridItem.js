import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../config/Colorpalette";


const GridItem = ({   itemKey,
  text,
  url,
  ratio,
  type,
  tags,
  item,
  filterItems,
  handleRemoveItem,
  inProgress,
  index,
  hasCRUDAccess,
  setShowSwiper,
  packeryInit}) => {
  const navigate = useNavigate();
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const itemRef = useRef();
  const [showLabel, setShowLabel] = useState(false);
  const [gridItemStyle, setGridItemStyle] = useState({});


// Code related to the Intersection Observer API
useEffect(() => {
  if (packeryInit) {
    // Add a delay of 1 second (1000 milliseconds) before executing the Intersection Observer code
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              setMediaUrl(url); // Load the media
            } else {
              setIsInView(false);
            }
          });
        },
        {
          rootMargin: "0px",
          threshold: 0.1,
        }
      );

      if (itemRef.current) {
        observer.observe(itemRef.current);
      }

      return () => {
        if (itemRef.current) {
          observer.unobserve(itemRef.current);
        }
      };
    }, 1000); // delay in milliseconds

    return () => {
      clearTimeout(timeoutId);
    };
  }
}, [packeryInit, url]);

  const handleClickTitle = () => {
    navigate(`/titlename`);
  };

  const handleClickTag = (tag) => {
    filterItems(tag);
  };

  useEffect(() => {
    const updateGridItemStyle = () => {
      const elementWidth = 400; // Original element width in pixels
      const numElementsPerLine = Math.floor(window.innerWidth / elementWidth);
      const gutter = 40; // Packery gutter in pixels
  
      const margin = (window.innerWidth % elementWidth) - ((numElementsPerLine+1) * gutter);
      const additionalWidth = margin / numElementsPerLine;
  
      const newStyle = {
        maxWidth: `${elementWidth + additionalWidth}px`,
        width: '90%',
        background: 'white', // White background
      };
  
      setGridItemStyle(newStyle);
    };
  
    // Update styles initially and on window resize
    updateGridItemStyle();
    window.addEventListener('resize', updateGridItemStyle);
  
    return () => {
      window.removeEventListener('resize', updateGridItemStyle);
    };
  }, []);
  
  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
  
    const colorIndex = Math.abs(hashCode) % colors.length;
  
    return colors[colorIndex];
  };

  const tagsArray = item.data.tags ? String(item.data.tags).toLowerCase().split(",") : [];

  return (
    <div ref={itemRef} style={gridItemStyle} className="grid-item">
      {/* Media Element */}
      {type === "video" && mediaUrl ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            src={mediaUrl}
            controls
            className="media-element w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : mediaUrl ? (
        <img src={mediaUrl} alt={item.data.text} className="media-element w-full h-auto" />
      ) : null}


{/* Title*/}
<div
    style={{
      position: 'relative',
      top: '-42px',
      left: '0px',
      textAlign: 'left',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      padding: '10px 1vw', // Adding padding to make it 20% wider
    }}
  >
    <a
      onClick={handleClickTitle}
      className="text-bold text-lg"
      style={{ fontWeight: 'bold', fontSize: '3rem' }}
    >
      {item.data.title}
    </a>
  </div>

{/* Author and Date */}
<div style={{ display: 'flex',  top: '-30px', position: 'relative'  }}>
<div className="author-section text-grey" style={{ color: 'grey', fontSize: '1rem' , position: 'absolute', right: '10px'  }}>
  @{item.data.authorName ?item.data.authorName : 'Kyliux'} {/* Assuming author name is available */}
</div>
  <div className="date-section text-grey" style={{ color: 'grey', fontSize: '1rem', position: 'absolute', left: '10px'}}>
    {new Date(item.data.date).toLocaleDateString()}
  </div>
</div>



      <hr style={{ borderColor: 'rgba(34,36,38,.03)', borderWidth: '1px', width: '100%' }} />

      {/* Text */}
      <div style={{  width : '85%', marginLeft:'7%', marginTop: '10px' }} className="text-section">{item.data.text}</div>

      {/* Horizontal Line */}
      <hr style={{ borderColor: 'rgba(34,36,38,.1)', borderWidth: '1px', width: '100%' }} />

        {/* Tags */}
  <div className="py-2 flex flex-wrap justify-center bg-white p-2">
    {tagsArray.length > 0 ? (
      tagsArray.map((tag) => (
        <button
          key={tag}
          className={`rounded-lg py-0.4 px-1 text-white text-lg font-semibold mr-2 ${getTagColor(
            tag
          )}`}
          onClick={() => handleClickTag(tag)}
        >
          {tag}
        </button>
      ))
    ) : (
      <p>No tags available</p>
    )}
  </div>


      {showLabel && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="bg-black opacity-75">
            <p className="text-white text-lg font-semibold text-center">{text}</p>
          </div>
        </div>
      )}

    </div>
  );
};
export default GridItem;