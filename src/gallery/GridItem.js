import React, { useState, useEffect, useRef } from "react";
import { colors } from "../config/Colorpalette";
import { Spinner } from "../Spinner";
import { useNavigate, useLocation } from "react-router-dom";


const GridItem = ({
  itemKey,
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
  items,
  setItems,
  setFilteredItems,
  hasCRUDAccess,
  setShowSwiper,
  packeryInit,
}) => {
  const isFirstItem = index === 0;
  let url2 = window.location.href; // or however you get the URL
  const [showLabel, setShowLabel] = useState(false);
  const [showRemoveLogo, setShowRemoveLogo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null); // Will hold the media url once it's time to load
  const navigate = useNavigate();
  const location = useLocation();

  const itemRef = useRef(); // Reference to the item for intersection observing

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
  
  let division = 1;
  
  /*if (url2.includes('gallery')) {
    division = 1;
  } else if (url2.includes('map')) {
    division = 3;
  }*/

  const handleMouseEnter = () => {
    setShowLabel(true);
    setShowRemoveLogo(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
    setShowRemoveLogo(false);
  };


  const tagsArray = tags ? String(tags).toLowerCase().split(",") : [];

  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colorIndex = Math.abs(hashCode) % colors.length;

    return colors[colorIndex];
  };

  const tagButtonStyle = {
    fontSize: "0.75rem",
    opacity: showLabel ? "1" : "0.1",
    cursor: "pointer",
  };

  const getUrlWidth = (ratio) => {
    return ratio < 1 ? `${19.80 / division }vw` : `${(ratio * 19.80 / division)}vw`;
  };

  const getUrlHeight = (ratio) => {
    return ratio > 1 ? `${19.80 / division }vw` : `${((19.80 / ratio ) / division)}vw`;
  };

  const itemStyle = {
    height: getUrlHeight(ratio),
    width: getUrlWidth(ratio),
    position: isFirstItem ? "" : "absolute",
    border: "1px solid white",
    boxSizing: "border-box",
    left: isFirstItem ? "unset" : "",
    right: isFirstItem ? "unset" : "",
  };

  const handleClickTag = (tag) => {
    // Check if the URL contains "/map/"
    if (location.pathname.includes("/map")) {
      // Change the URL to reflect the filtered tag in "/map/tagname" format
      navigate(`/map/${tag}`);
    } else if (location.pathname.includes("/gallery")) {
      // Change the URL to reflect the filtered tag in "/gallery/tagname" format
      navigate(`/gallery/${tag}`);
    } else {
      // If the URL doesn't contain "/map/" or "/gallery/", use the default behavior
      navigate(`/gallery/${tag}`);
    }
  };


  const handleDoubleClickTag = (tag) => {
    filterItems(tag, true);
  };

  return (
    <div
      ref={itemRef} // Assigning the ref
      key={itemKey}
      className="grid-item"
      style={itemStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showRemoveLogo && hasCRUDAccess && (
        <div
          className="remove-logo"
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "999",
            width: `${32 / division }px`,
            height: `${32 / division }px`,
            borderRadius: "50%",
            background: "rgba(255, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveItem(item, item.key, item.url)} // Pass the necessary arguments
        >
          <span style={{ color: "#fff", fontSize: "20px" }}>&times;</span>
          {inProgress && <Spinner />}
        </div>
      )}

      <div className="absolute top-0 left-0 w-full">
        <div className="top-0 left-0 w-full max-h-80 overflow-y-auto flex flex-wrap justify-center">
          {tagsArray.length > 0 ? (
            tagsArray.map((tag) => (
              <button
                key={tag}
                className={`rounded-lg py-0.4 px-1 text-white text-lg font-semibold mr-2 ${getTagColor(
                  tag
                )}`}
                style={tagButtonStyle}
                onClick={() => handleClickTag(tag)}
                onDoubleClick={() => handleDoubleClickTag(tag)}
              >
                {tag}
              </button>
            ))
          ) : (
            <p>No tags available</p>
          )}
        </div>
      </div>

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
        <img src={mediaUrl} alt={text} className="media-element w-full h-auto" onClick={() => setShowSwiper(index)} />
      ) : null}

      {/*showLabel && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="bg-black opacity-75">
            <p className="text-white text-lg font-semibold text-center">{text}</p>
          </div>
        </div>
      )*/}

    </div>
  );
};

export default GridItem;