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
  const itemTagsMapRef = useRef({});

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
  }, [filteredItems]);

  useEffect(() => {
    if (user && principal.includes(user.key)) {
      setHasCRUDAccess(true);
    }
    list();
    initializePackery();
  }, [user]);

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
    const topTags = sortedTags.slice(0, 40);
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

  const handleRemoveAllWithTag = async () => {
    const tagSuffix = getTagFromURL();
    if (tagSuffix) {
      const confirmRemoveAll = window.confirm(`Are you sure you want to remove all items with the tag "${tagSuffix}"?`);
      if (confirmRemoveAll) {
        try {
          setInProgress(true);
          const itemsToRemove = items.filter((item) => {
            const itemTags = item.data.tags
              ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
              : [];
            return itemTags.includes(tagSuffix.toLowerCase());
          });

          for (const itemToRemove of itemsToRemove) {
            const { data: { url } } = itemToRemove;
            await delDoc({ collection: notes, doc: itemToRemove });
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

  async function list() {
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
    let tagSuffix;
    if (location.pathname.includes('/gallery/')) {
      tagSuffix = location.pathname.split('/gallery/')[1];
    } else if (location.pathname.includes('/map/')) {
      tagSuffix = location.pathname.split('/map/')[1];
    }
    return tagSuffix;
  };

  const handleItemsFiltering = () => {
    const tagSuffix = getTagFromURL();
    let filtered;
    if (tagSuffix == undefined) {
      return;
    } else if (tagSuffix === "") {
      filtered = items;
    } else {
      filtered = items.filter((item) => {
        const itemTags = item.data.tags
          ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
          : [];
        return itemTags.includes(tagSuffix.toLowerCase());
      });
    }
    setFilteredItems(filtered);
    initializePackery();
  };

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
        <h2 className="font-semibold text-gray-800 text-center" style={{ zIndex: 999 }}>
          {topTags.length > 0 && showTopTags && (
            <div className="mt-2 mx-auto">
              <div className="flex flex-wrap justify-center mt-2" style={{ width: "90%", marginLeft: "4%" }}>
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
                      const tagSuffix = tag;
                      let filtered;
                      if (!tagSuffix || tagSuffix === "") {
                        filtered = items;
                      } else {
                        filtered = items.filter((item) => {
                          const itemTags = item.data.tags
                            ? String(item.data.tags).split(",").map((tag) => tag.toLowerCase().trim())
                            : [];
                          return itemTags.includes(tagSuffix.toLowerCase());
                        });
                      }
                      setFilteredItems(filtered);
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
