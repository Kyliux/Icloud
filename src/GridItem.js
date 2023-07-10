import React, { useState, useEffect, useRef } from "react";
import { colors } from "./Colorpalette";
import Draggabilly from "draggabilly";
import { delDoc, deleteAsset } from "@junobuild/core";
import { Spinner } from "./Spinner";


const GridItem = ({ itemKey, text, url, ratio, type, tags, item, filterItems,handleRemoveItem, inProgress,
  index,
  items,
  setItems,
  setFilteredItems, hasCRUDAccess }) => {
  const getUrlWidth = (ratio) => {
    return ratio < 1 ? `${200}px` : `${ratio * 200}px`;
  };

  const getUrlHeight = (ratio) => {
    return ratio > 1 ? `${200}px` : `${200 / ratio}px`;
  };

  
  const itemStyle = {
    height: getUrlHeight(ratio),
    width: getUrlWidth(ratio),
    position: "relative",
  };

  const [showLabel, setShowLabel] = useState(false);
  const [showRemoveLogo, setShowRemoveLogo] = useState(false);
  const gridItemRef = useRef(null);
  const draggieRef = useRef(null);

  const handleMouseEnter = () => {
    setShowLabel(true);
    setShowRemoveLogo(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
    setShowRemoveLogo(false);
  };

  const tagsArray = tags ? String(tags).split(",") : [];

  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colorIndex = Math.abs(hashCode) % colors.length;

    return colors[colorIndex];
  };

  const tagButtonStyle = {
    fontSize: "0.75rem",
    opacity: showLabel ? "1" : "0.3",
  };

  const handleClickTag = (tag) => {
    filterItems(tag);
  };

  const handleDoubleClickTag = (tag) => {
    filterItems(tag, true);
  };

  useEffect(() => {
    draggieRef.current = new Draggabilly(gridItemRef.current);
    return () => {
      draggieRef.current.destroy();
    };
  }, []);

  return (
    <div
      key={itemKey}
      className="grid-item"
      style={itemStyle}
      ref={gridItemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {type === "video" ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            src={url}
            controls
            className="media-element w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <img src={url} alt={text} className="media-element w-full h-auto" />
      )}

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
