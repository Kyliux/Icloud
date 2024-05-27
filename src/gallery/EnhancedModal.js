import React, { useContext, useEffect, useState } from "react";
import { setDoc, uploadFile } from "@junobuild/core";
import { AuthContext } from "../Auth";
import { nanoid } from "nanoid";
import { principal } from "../config/Principalid";
import emojiRegex from 'emoji-regex';
import { useRef } from "react";

export const EnhancedModal = ({ notes, images, videos, defaultratio, showModal, setShowModal }) => {
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [tags, setTags] = useState("");
  const [logos, setLogos] = useState("");
  const [valid, setValid] = useState(false);
  const [progress, setProgress] = useState(false);
  const [files, setFiles] = useState([]);
  const [hasCRUDAccess, setHasCRUDAccess] = useState(false);
  const [gps, setGps] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const isEmoji = input => emojiRegex().test(input);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setValid(inputText !== "" && user !== undefined && user !== null);
    if (user && principal.includes(user.key)) {
      setHasCRUDAccess(true);
    }
  }, [showModal, inputText, user]);

  useEffect(() => {
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        setGps({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoadingLocation(false);
      },
      error => {
        console.error("Error occurred while getting user's location", error);
        setLoadingLocation(false);
      }
    );
  }, []);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleFileInputClick = () => {
      console.log("Choose File input clicked!");
    };

    if (fileInputRef.current && !progress) {
      fileInputRef.current.addEventListener("click", handleFileInputClick);
    }

    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener("click", handleFileInputClick);
      }
    };
  }, [progress]);

  const reload = () => {
    let event = new Event("reload");
    window.dispatchEvent(event);
  };

  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getClosestRatio = (ratio) => {
    const ratioValues = [1 / 6, 1 / 4, 1 / 2, 1, 2, 3, 4, 6];
    const closestRatio = ratioValues.reduce((prev, curr) => {
      return Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev;
    });
    return defaultratio ? defaultratio : closestRatio;
  };

  const add = async () => {
    if ([null, undefined].includes(user)) {
      return;
    }
  
    setProgress(true);
  
    try {
      const position = await getCoordinates();
      setGps({ lat: position.coords.latitude, lng: position.coords.longitude });
  
      const uploadQueue = [...files]; // Copy the files array to the upload queue
  
      const processNextBatch = async () => {
        const currentBatch = uploadQueue.splice(0, 3); // Process up to 6 files at a time
  
        await Promise.all(
          currentBatch.map(async (file, index) => {
            console.log(`Uploading file ${index + 1} of ${currentBatch.length}`);
            const filename = `${user.key}-${file.name}`;
  
            let collection;
            let ratio;
            let url;
            let type;
  
            if (file.type.startsWith("image/")) {
              collection = images;
              const image = new Image();
              image.src = URL.createObjectURL(file);
              await image.decode();
              ratio = getClosestRatio(image.width / image.height);
            } else if (file.type.startsWith("video/")) {
              collection = videos;
              const video = document.createElement("video");
              video.src = URL.createObjectURL(file);
  
              const videoLoadPromise = new Promise((resolve, reject) => {
                video.addEventListener("loadedmetadata", () => {
                  ratio = video.videoWidth / video.videoHeight;
                  resolve();
                });
  
                video.addEventListener("error", reject);
              });
  
              await videoLoadPromise;
            }
  
            if (collection) {
              const currentTimestamp = Date.now(); // Get the current timestamp
              const mergedFilename = `${currentTimestamp}_${filename}`; // Merge timestamp with original filename

              const { downloadUrl } = await uploadFile({
                collection,
                data: file,
                filename : mergedFilename,
                token: nanoid(),
              });
  
              url = downloadUrl;
              type = collection.slice(0, -1);
            }
  
            const key = nanoid();
            const currentDate = new Date().toISOString();
  
            await setDoc({
              collection: notes,
              doc: {
                key,
                data: {
                  text: inputText,
                  type,
                  title: inputTitle,
                  tags,
                  ratio,
                  date: currentDate,
                  gps,
                  logos,
                  ...(url !== undefined && { url }),
                },
              },
            });
  
            console.log(`File ${index + 1} of ${currentBatch.length} uploaded`);
          })
        );
  
        if (uploadQueue.length > 0) {
          // If there are more files in the queue, process the next batch
          await processNextBatch();
        }
      };
  
      await processNextBatch();
  
      console.log("All files uploaded successfully");
      setShowModal(false);
      reload();
    } catch (err) {
      console.error(err);
    }
  
    setProgress(false);
  };

  return (
    <>
      <div id="modal-root"></div>

      <div className="mt-10 flex items-center justify-center gap-x-6" style={{ zIndex: 999 }}>
        {/*hasCRUDAccess && (
          <button style={{ zIndex: 999 }}
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add an entry
          </button>
        )*/}
      </div>

      {/* Modal Root */}
      {showModal && hasCRUDAccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" style={{ zIndex: 1000 }}>
          <div className="bg-white rounded p-8 shadow-lg">
            <textarea
              type="text"
              className="form-control mb-4 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none"
              placeholder="Feeling ? (only Emoji)"
              onChange={(e) => {
                if (isEmoji(e.target.value) || e.target.value === '') {
                  setLogos(e.target.value);
                }
              }}
              value={logos}
              disabled={progress}
            />
            <textarea
              className="form-control mb-4 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none resize-none"
              rows="5"
              type="text"
              placeholder="Title"
              onChange={(e) => {
                setInputTitle(e.target.value);
              }}
              value={inputTitle}
              disabled={progress}
            ></textarea>
            <textarea
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none resize-none"
              rows="5"
              placeholder="Your diary entry"
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={inputText}
              disabled={progress}
            ></textarea>
            <input
              type="file"
              ref={fileInputRef}
              className="my-4 text-slate-500 text-lg leading-relaxed"
              accept="image/*, video/*"
              onChange={(event) => setFiles(Array.from(event.target.files))}
              disabled={progress}
              multiple
            />
            <input
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none"
              placeholder="Tags (separated by commas)"
              onChange={(e) => {
                const trimmedValue = e.target.value.trim();
                const tagsArray = trimmedValue.split(',').map(tag => tag.trim());
                const cleanedTags = tagsArray.join(',');
                setTags(cleanedTags);
              }}
              value={tags}
              disabled={progress}
            />
            {progress && (
              <div className="text-center mb-4">
                <p>Uploading...</p>
                {/* Add your loading spinner or progress bar here */}
              </div>
            )}

            {!progress && valid && (
              <div className="text-center text-green-500 mb-4">
                <p>Entry added successfully!</p>
              </div>
            )}

            {!progress && !valid && (
              <div className="text-center text-red-500 mb-4">
                <p>Failed to add entry. Please check your input.</p>
              </div>
            )}

            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              {progress ? (
                <div
                  className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <button
                    className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  <button
                    className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-25"
                    type="button"
                    onClick={add}
                    disabled={!valid}
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
