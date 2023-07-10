import React, { useContext, useEffect, useState, useRef } from "react";
import { listDocs } from "@junobuild/core";
import { AuthContext } from "./Auth";
import Packery from "packery";
import Draggabilly from "draggabilly";
import GridItem from "./GridItem";
import { colors } from "./Colorpalette";
import { delDoc, deleteAsset, listAssets } from "@junobuild/core";
import { Swipeable } from "react-swipeable";

export const Table = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [hasCRUDAccess, setHasCRUDAccess] = useState(false); // Flag for CRUD access
  const [inProgress, setInProgress] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);


  const gridRef = useRef(null);
  const packeryRef = useRef(null);
  const activeTagsRef = useRef([]);
  const excludedTagsRef = useRef([]);

  
  useEffect(() => {
    window.addEventListener("reload", list);
    return () => {
      window.removeEventListener("reload", list);
    };

  }, []);

  useEffect(() => {
    if ([undefined, null].includes(user)) {
      setItems([]);
      setFilteredItems([]);
      return;
    }
    list();
    if (user && user.key === "bejiw-lmmap-dscrd-b6jed-6zrsu-nyrlm-wa4rn-e56p2-wqanx-doasx-zqe") {
      setHasCRUDAccess(true);
    }
  }, [user]);

  useEffect(() => {
    if (gridRef.current) {
      initializePackery();
    }
  }, []);

  useEffect(() => {
    if (packeryRef.current) {
      reloadPackery();
    }
  }, [filteredItems]);

  useEffect(() => {
    fetchTopTags();
  }, [items]);

  const list = async () => {
    const { items } = await listDocs({
      collection: "notes",
      filter: {},
    });
    setItems(items);
    setFilteredItems(items);
  };

  const initializePackery = () => {
    packeryRef.current = new Packery(gridRef.current, {
      itemSelector: ".grid-item",
      percentPosition: true,
      gutter: 2,
    });
  };

  const reloadPackery = () => {
    packeryRef.current.reloadItems();
    packeryRef.current.layout();
  };

  

  const filterItems = (tag, exclude = false) => {
    const activeTags = exclude
      ? activeTagsRef.current.filter((t) => t !== tag)
      : [...activeTagsRef.current, tag];
    const excludedTags = exclude
      ? [...excludedTagsRef.current, tag]
      : excludedTagsRef.current.filter((t) => t !== tag);

    setActiveTags(activeTags);
    excludedTagsRef.current = excludedTags;

    const filtered = items.filter((item) => {
      const itemTags = item.data.tags || [];
      return (
        activeTags.every((t) => itemTags.includes(t)) &&
        excludedTags.every((t) => !itemTags.includes(t))
      );
    });

    setFilteredItems(filtered);
  };

  const handleSwipeLeft = () => {
    setFullscreenIndex((prevIndex) =>
      prevIndex === null ? 0 : Math.min(prevIndex + 1, items.length - 1)
    );
  };
  
  const handleSwipeRight = () => {
    setFullscreenIndex((prevIndex) =>
      prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
    );
  };
  
  const handleRemoveItem = async (doc, key, url) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      setInProgress(true);
      
      
      
      if (url !== undefined) {
        const { pathname } = new URL(url);
        const extension = pathname.split(".").pop();

      
 

        
  
        if (extension === "jpg" || extension === "jpeg" || extension === "png") {
          const { assets } = await listAssets({
            collection: "images",
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
            collection: "images",
            storageFile: assets[0],
          });
        } else if (extension === "mp4" || extension === "mov") {
          const { assets } = await listAssets({
            collection: "videos",
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
            collection: "videos",
            storageFile: assets[0],
          });
        }
      }
  
      const {
        data: { url },
      } = doc;

      await delDoc({
        collection: "notes",
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

  const fetchTopTags = () => {
    const tagCount = {};
    items.forEach((item) => {
      const tags = item.data.tags ? String(item.data.tags).split(",") : [];
      tags.forEach((tag) => {
        tagCount[tag] = tagCount[tag] ? tagCount[tag] + 1 : 1;
      });
    });

    const sortedTags = Object.keys(tagCount).sort(
      (a, b) => tagCount[b] - tagCount[a]
    );
    const topTags = sortedTags.slice(0, 20);
    setTopTags(topTags);
  };

  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colorIndex = Math.abs(hashCode) % colors.length;

    return colors[colorIndex];
  };

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      <header className="px-5 py-4 border-b border-gray-100 w-full">
        <h2 className="font-semibold text-gray-800 text-center">
          Top Tags:
          {topTags.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap justify-center mt-2">
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
                    className={`rounded-lg py-0.4 px-1 text-white text-lg font-semibold mr-2 ${getTagColor(
                      tag
                    )}`}
                    onClick={() => filterItems(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              </div>
          )}
        </h2>
      </header>
      <div className="p-3">
      <Swipeable onSwipedLeft={handleSwipeLeft} onSwipedRight={handleSwipeRight}>

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
          itemKey={key}
          item={item}
          text={text}
          url={url}
          ratio={ratio}
          tags={tags}
          type={type}
          filterItems={filterItems}
          hasCRUDAccess={hasCRUDAccess} // Pass the CRUD access flag as a prop
          index={index}
          inProgress={inProgress}
          handleRemoveItem={handleRemoveItem} // Pass handleRemoveItem as a prop
          items={items} // Pass items as a prop
          setItems={setItems} // Pass setItems as a prop
          setFilteredItems={setFilteredItems} // Pass setFilteredItems as a prop
        />
      );
    })}
  </div>
  </Swipeable>

</div>

    </div>
  );
};

export default Table;