import React, { useState, useEffect, useRef } from "react";
import { colors } from "./Colorpalette";
import { Spinner } from "./Spinner";

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
  packeryInit,
}) => {
  const [showLabel, setShowLabel] = useState(false);
  const [showRemoveLogo, setShowRemoveLogo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null); // Will hold the media url once it's time to load

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
    return ratio < 1 ? `${30}vh` : `${(ratio * 30)}vh`;
  };

  const getUrlHeight = (ratio) => {
    return ratio > 1 ? `${30}vh` : `${(30 / ratio)}vh`;
  };

  const itemStyle = {
    height: getUrlHeight(ratio),
    width: getUrlWidth(ratio),
    position: "relative",
    border: "1px solid white",
    boxSizing: "border-box",
  };

  const handleClickTag = (tag) => {
    filterItems(tag);
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
        <img src={mediaUrl} alt={text} className="media-element w-full h-auto" />
      ) : null}

      {showLabel && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="bg-black opacity-75">
            <p className="text-white text-lg font-semibold text-center">{text}</p>
          </div>
        </div>
      )}

      {showRemoveLogo && hasCRUDAccess && (
        <div
          className="remove-logo"
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "1",
            width: "32px",
            height: "32px",
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
    </div>
  );
};

export default GridItem;
