import React, { useContext, useEffect, useState, useRef } from "react";
import { listDocs } from "@junobuild/core";
import { AuthContext } from "./Auth";
import Packery from "packery";
import GridItem from "./GridItem";
import { colors } from "./Colorpalette";
import { principal } from "./Principalid";
import { delDoc, deleteAsset, listAssets } from "@junobuild/core";
import { ImageSwiper } from './ImageSwiper';

export const EnhancedTable = ({ notes, images, videos, defaultratio }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [hasCRUDAccess, setHasCRUDAccess] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [showSwiper, setShowSwiper] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [showTopTags, setShowTopTags] = useState(false);


  const gridRef = useRef(null);
  const packeryRef = useRef(null);
  const activeTagsRef = useRef([]);
  const excludedTagsRef = useRef([]);

  const handleShowSwiper = (index) => {
    console.log('handleShowSwiper triggered with index:', index);
    setShowSwiper(true);
    setSwiperIndex(index);
  };

  const handleCloseSwiper = () => {
    console.log('handleCloseSwiper triggered');
    setShowSwiper(false);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) handleCloseSwiper();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("reload", list);
    return () => {
      window.removeEventListener("reload", list);
    };
  }, []);

  useEffect(() => {
    if ([undefined, null].includes(user)) {
     // setItems([]);
     // setFilteredItems([]);
     // return;
    }
    list();
    if (user && user.key === principal[0]) {
      setHasCRUDAccess(true);
    }
  }, [user]);

  useEffect(() => {
    if (gridRef.current) {
      initializePackery();
    }
  }, [filteredItems]);

  useEffect(() => {
    fetchTopTags();
  }, [items]);

  const list = async () => {
    const { items } = await listDocs({
      collection: notes,
      filter: {},
    });
    setItems(items);
    setFilteredItems(items);
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
    packeryRef.current.reloadItems();
    packeryRef.current.layout();
  };

  const toggleTopTags = () => {
    setShowTopTags(!showTopTags);
};

  const filterItems = (tag, exclude = false) => {
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
        ? String(item.data.tags)
            .split(",")
            .map((tag) => tag.toLowerCase().trim())
        : [];
      return (
        activeTags.every((t) => itemTags.includes(t)) &&
        excludedTags.every((t) => !itemTags.includes(t))
      );
    });

    setFilteredItems(filtered);
    reloadPackery();
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
            collection: images,
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
            collection: images,
            storageFile: assets[0],
          });
        } else if (extension === "mp4" || extension === "mov") {
          const { assets } = await listAssets({
            collection: videos,
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
            collection: videos,
            storageFile: assets[0],
          });
        }
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

  const fetchTopTags = () => {
    const tagCount = {};
    const itemTagsMap = {};

    items.forEach((item) => {
      const tags = item.data.tags ? String(item.data.tags).split(",") : [];
      tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        tagCount[normalizedTag] = tagCount[normalizedTag] ? tagCount[normalizedTag] + 1 : 1;

        if (!itemTagsMap[normalizedTag]) {
          itemTagsMap[normalizedTag] = [];
        }
        itemTagsMap[normalizedTag].push(item);
      });
    });

    const sortedTags = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a]);
    const topTags = sortedTags.slice(0, 20);
    setTopTags(topTags);

    const selectedItems = new Set();
    const filtered = [];

    topTags.forEach((tag) => {
      const itemsWithTag = itemTagsMap[tag] || [];

      if (itemsWithTag.length > 0) {
        const remainingItems = itemsWithTag.filter((item) => !selectedItems.has(item));
        if (remainingItems.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingItems.length);
          const selectedItem = remainingItems[randomIndex];
          filtered.push(selectedItem);
          selectedItems.add(selectedItem);
        }
      }
    });

    setFilteredItems(filtered);
    initializePackery();
  };

  const getTagColor = (tag) => {
    const hashCode = tag.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colorIndex = Math.abs(hashCode) % colors.length;

    return colors[colorIndex];
  };

  useEffect(() => {
    if (gridRef.current) {
      initializePackery();
    }

    // Clean up the previous Packery instance when the component unmounts
    return () => {
      if (packeryRef.current) {
        packeryRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full">
    {showSwiper && (
        <ImageSwiper items={filteredItems} activeIndex={swiperIndex} onClose={handleCloseSwiper} />
    )}

    <header className="px-5 py-4 w-full flex justify-between">
        
        <h2 className="font-semibold text-gray-800 text-center">
            <button className="rounded-lg px-1 text-white text-lg font-semibold mr-2 bg-indigo-600" onClick={toggleTopTags}>
                Tags 👀
            </button>
            {topTags.length > 0 && showTopTags && (
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
                        items={items}
                        setItems={setItems}
                        setFilteredItems={setFilteredItems}
                    />
                );
            })}
        </div>
    </div>
</div>
);
};

export default EnhancedTable;
