import React, { useState, useMemo } from "react";
import GridItem from "./GridItem";

const Gallery = ({ items }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const handleTagDoubleClick = (tag) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(tag)) {
        // Remove the tag from active filters if already present
        return prevFilters.filter((filter) => filter !== tag);
      } else {
        // Add the tag to active filters if not already present
        return [...prevFilters, tag];
      }
    });
  };

  const filteredItems = useMemo(() => {
    if (activeFilters.length === 0) {
      return items;
    } else {
      return items.filter((item) => {
        const itemTags = item.data.tags ? String(item.data.tags).split(",") : [];
        return activeFilters.every((filter) => itemTags.includes(filter));
      });
    }
  }, [items, activeFilters]);

  return (
    <div className="grid-container">
      {filteredItems.map((item) => (
        <GridItem
          key={item.key}
          text={item.data.text}
          url={item.data.url}
          ratio={item.data.ratio}
          type={item.data.type}
          tags={item.data.tags}
        />
      ))}
    </div>
  );
};

export default Gallery;
