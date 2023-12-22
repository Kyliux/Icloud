import React, { useContext, useEffect, useState, useRef } from "react";
import { listDocs, delDoc, deleteAsset, listAssets } from "@junobuild/core";
import { AuthContext } from "../Auth";
import Packery from "packery";
import GridItem from "./GridItem";
import { colors } from "../config/Colorpalette";
import { principal } from "../config/Principalid";
import { ImageSwiper } from './ImageSwiper';
import { useLocation } from "react-router-dom";

export const EnhancedTable = ({ notes, images, videos, defaultratio, leftPadding, showModal, setShowModal, showTopTags, setShowTopTags }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [hasCRUDAccess, setHasCRUDAccess] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [showSwiper, setShowSwiper] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const location = useLocation();
  const gridRef = useRef(null);
  const packeryRef = useRef(null);
  const activeTagsRef = useRef([]);
  const excludedTagsRef = useRef([]);
  const itemTagsMapRef = useRef({}); // New addition here

  //fetchTopTags should populate the toptags
  useEffect(() => {
    fetchTopTags();
  }, [items]);

  useEffect(() => {
    handleItemsFiltering();
  }, [items, location.pathname]);

  useEffect(() => {
  if (gridRef.current) {
    initializePackery();
   }
   return () => {
     if (packeryRef.current) {
       packeryRef.current.destroy();
     }
   };
 }, [filteredItems]); //was no dependency before

  useEffect(() => {
    if (user && principal.includes(user.key)) {
      setHasCRUDAccess(true);
    }
    
    list();
    initializePackery();
  }, [user]);

  const fetchTopTags = () => {
    // Initialize the object to store the count of each tag
    const tagCount = {};
    // Initialize the object to map tags to items
    const itemTagsMap = {};
  
  
    // Iterate over each item
    items.forEach((item) => {
      // Extract tags from the item, or use an empty array if no tags are present
      const tags = item.data.tags ? String(item.data.tags).split(",") : [];
  
      // Iterate over each tag
      tags.forEach((tag) => {
        // Normalize the tag to lowercase
        const normalizedTag = tag.toLowerCase();
  
        // Increase the count for the tag, or set it to 1 if it hasn't been encountered yet
        tagCount[normalizedTag] = tagCount[normalizedTag] ? tagCount[normalizedTag] + 1 : 1;
  
        // If the tag hasn't been encountered yet, initialize an empty array for it in itemTagsMap
        if (!itemTagsMap[normalizedTag]) {
          itemTagsMap[normalizedTag] = [];
        }
        // Add the current item to the array for the current tag in itemTagsMap
        itemTagsMap[normalizedTag].push(item);
      });
    });
  
  
    // Sort the tags by their counts in descending order
    const sortedTags = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a]);
    // Get the top 20 tags
    const topTags = sortedTags.slice(0, 40);
    setTopTags(topTags);
  
  
    // Initialize a Set to store the selected items
    const selectedItems = new Set();
    // Initialize an array to store the filtered items
    const filtered = [];
  
  
    // Iterate over each top tag
    topTags.forEach((tag) => {
      // Get the items with the current tag, or use an empty array if none exist
      const itemsWithTag = itemTagsMap[tag] || [];
  
  
      if (itemsWithTag.length > 0) {
        // Filter out the items that have already been selected
        const remainingItems = itemsWithTag.filter((item) => !selectedItems.has(item));
  
        if (remainingItems.length > 0) {
          // Select a random item from the remaining ones
          const randomIndex = Math.floor(Math.random() * remainingItems.length);
          const selectedItem = remainingItems[randomIndex];
  
          // Add the selected item to the filtered items
          filtered.push(selectedItem);
          // Add the selected item to the selected items
          selectedItems.add(selectedItem);
        }
      }
    });
    
    // Set the filtered items
    setFilteredItems(filtered);
    initializePackery();
  
    };
  
    const handleRemoveAllWithTag = async () => {
      const tagSuffix = getTagFromURL();
      
      if (tagSuffix) {
        const confirmRemoveAll = window.confirm(`Are you sure you want to remove all items with the tag "${tagSuffix}"?`);
        
        if (confirmRemoveAll) {
          try {
            setInProgress(true);
  
            // Filter items with the current tag
            const itemsToRemove = items.filter((item) => {
              const itemTags = item.data.tags
                ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
                : [];
              return itemTags.includes(tagSuffix.toLowerCase());
            });
  
            // Remove each item
            for (const itemToRemove of itemsToRemove) {
              const {
                data: { url },
              } = itemToRemove;
  
              await delDoc({
                collection: notes,
                doc: itemToRemove,
              });
  
              const updatedItems = items.filter((item) => item.key !== itemToRemove.key);
              setItems(updatedItems);
              setFilteredItems(updatedItems);
            }
  
            reloadPackery();
          } catch (error) {
            console.error("Error removing items:", error);
          } finally {
            setInProgress(false);
          }
        }
      }
    };

  
  const handleShowSwiper = (index) => {
    setShowSwiper(true);
    setSwiperIndex(index);
  };

  const handleCloseSwiper = () => {
    setShowSwiper(false);
  };

  async function list () {
    const { items } = await listDocs({
      collection: notes,
      filter: {},
    });
    setItems(items);
  };

  const initializePackery = () => {
    if (packeryRef.current) {
      packeryRef.current.destroy();
    }
    packeryRef.current = new Packery(gridRef.current, {
      itemSelector: ".grid-item",
      percentPosition: true,
      gutter: 0,
    });
  };

  const reloadPackery = () => {
    if (packeryRef.current) {
      packeryRef.current.reloadItems();
      packeryRef.current.layout();
    }
  };

  const getTagFromURL = () => {
    let tagSuffix = undefined;
    if (location.pathname.includes('/gallery/')) {
      tagSuffix = location.pathname.split('/gallery/')[1];
    } else if (location.pathname.includes('/map/')) {
      tagSuffix = location.pathname.split('/map/')[1];
    }
    return tagSuffix;
  };

  const handleItemsFiltering = () => {

    // Extract tag from URL
    const tagSuffix = getTagFromURL();
    let filtered;

    // Check if tagSuffix is empty or null
    if (tagSuffix == undefined ) {
      return;
      
    } else  if  ( tagSuffix === "") {
      // Use all items
      filtered = items;
    } else {
      // Filter items with tag matching tagSuffix
      filtered = items.filter((item) => {
        const itemTags = item.data.tags
          ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
          : [];
        return itemTags.includes(tagSuffix.toLowerCase());
      });
    }
    // Update state with the filtered items
    setFilteredItems(filtered);
    // Initialize packery after items filtering
    initializePackery();
  }


  const filterItems = (tag, exclude = false, items = []) => {
    tag = tag.toLowerCase();
    const activeTags = exclude
      ? activeTagsRef.current.filter((t) => t !== tag)
      : [...activeTagsRef.current, tag];
    const excludedTags = exclude
      ? [...excludedTagsRef.current, tag]
      : excludedTagsRef.current.filter((t) => t !== tag);

    setActiveTags(activeTags.map((tag) => tag.toLowerCase()));
    excludedTagsRef.current = excludedTags.map((tag) => tag.toLowerCase());

    const filtered = items.filter((item) => {
      const itemTags = item.data.tags
        ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
        : [];
      return (
        activeTags.every((t) => itemTags.includes(t)) &&
        excludedTags.every((t) => !itemTags.includes(t))
      );
    });

    return filtered;
  };

  const handleRemoveItem = async (doc, key, url) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      setInProgress(true);

      if (url !== undefined) {
        const { pathname } = new URL(url);
        const extension = pathname.split(".").pop();
        const collection = (extension === "jpg" || extension === "jpeg" || extension === "png") ? images : videos;

        const { assets } = await listAssets({
          collection,
          filter: {
            matcher: {
              key: pathname,
            },
          },
        });

        if (assets.length !== 1) {
          setInProgress(false);
          alert("More than one corresponding asset found");
          return;
        }

        await deleteAsset({
          collection,
          storageFile: assets[0],
        });
      }

      const {
        data: { url },
      } = doc;

      await delDoc({
        collection: notes,
        doc,
      });

      const updatedItems = items.filter((item) => item.key !== key);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      reloadPackery();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setInProgress(false);
    }
  };

  const resetFilters = () => {
    setActiveTags([]);
    excludedTagsRef.current = [];
    setFilteredItems(items);
  };

  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hashCode % colors.length);
    return colors[index];
  };



  return (
    <div className="w-full">
      {showSwiper && (
        <ImageSwiper items={filteredItems} activeIndex={swiperIndex} onClose={handleCloseSwiper} />
      )}
      <header className=" w-full flex flex-col items-center justify-center">
      {hasCRUDAccess && (
            <button
            className="rounded-lg py-0.4 px-1 text-white text-lg font-semibold bg-red-500 mb-2"
            onClick={handleRemoveAllWithTag}
            style={{ zIndex: 9999 }}
          >
            Remove All
          </button>
        )}
        <h2 className="font-semibold text-gray-800 text-center" style={{ zIndex: 999
}}>
          {topTags.length > 0 && showTopTags && (
            <div className="mt-2 mx-auto">
              <div className="flex flex-wrap justify-center mt-2"                     style={{ width: "90%",marginLeft: "4%"  }} // Add this line
>
                <button
                  className={`rounded-lg py-0.4 px-1 text-white text-lg font-semibold mr-2 ${
                    activeTags.length === 0 ? "bg-indigo-600" : "bg-gray-400"
                  }`}
                  onClick={resetFilters}
                >
                  All
                </button>
                {topTags.map((tag) => (
                  <button
                    key={tag}
                    className={`rounded-lg py-0.4 px-1 text-white text-lg font-semibold mr-2 ${getTagColor(tag)}`}
                    onClick={() => {
                      // Update active tags and refilter items a bit ugly but works as intented for now

  // Extract tag from URL
  const tagSuffix = tag;
  let filtered;

  // Check if tagSuffix is empty or null
  if (!tagSuffix || tagSuffix === "") {
    // Use all items
    filtered = items;
  } else {
    // Filter items with tag matching tagSuffix
    filtered = items.filter((item) => {
      const itemTags = item.data.tags
        ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
        : [];
      return itemTags.includes(tagSuffix.toLowerCase());
    });
  }
  // Update state with the filtered items
  setFilteredItems(filtered);
  // Initialize packery after items filtering
  initializePackery();



                    }}
                  >
                    {tag}
                  </button>
                ))}
                
              </div>
            </div>
          )}
        </h2>
      </header>
      <div>
        <div
          ref={gridRef}
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {filteredItems.map((item, index) => {
            const {
              key,
              data: { text, url, ratio, tags, type },
            } = item;

            return (
              <GridItem
                key={key}
                itemKey={key}
                packeryInit={packeryRef.current !== null}
                item={item}
                text={text}
                url={url}
                ratio={defaultratio ? defaultratio : ratio}
                tags={tags}
                setShowSwiper={handleShowSwiper}
                type={type}
                filterItems={filterItems}
                hasCRUDAccess={hasCRUDAccess}
                index={index}
                inProgress={inProgress}
                handleRemoveItem={handleRemoveItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTable;
