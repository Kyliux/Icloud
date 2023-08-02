import React, { useEffect, useState } from "react";
import { Gallery } from "./Gallery";
import { Iscan } from "./Iscan";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import Navbar from './Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Background  from "./Background";



function App() {
  const [activeView, setActiveView] = useState("gallery");
  const [leftPadding, setLeftPadding] = useState(0);

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "m5rwi-daaaa-aaaal-acrpq-cai",
      }))();
  }, []);

  /*const toggleView = () => {
    setActiveView(activeView === "gallery" ? "gallery" /*iscan  : "gallery");
  };*/

  useEffect(() => {
    const handleResize = () => {
      const imageWidth = window.innerHeight * 0.312;  // 30vh in pixels
      const numWholeImages = Math.floor(window.innerWidth / imageWidth);
      const leftoverSpace = window.innerWidth - numWholeImages * imageWidth;
      setLeftPadding(leftoverSpace / 2); 

    };

    window.addEventListener("resize", handleResize);
    handleResize(); // call once on mount to set initial padding

    return () => window.removeEventListener("resize", handleResize); // cleanup on unmount
  }, []);

  return (
    <>
      <Router>

      <main style={{ margin: 0, padding: 0 }}>
      <Background />
      
        <div className="mx-auto pt-16" style={{  margin: 0, padding: 0 }}>
          <div className="text-center" >
            {/* USELESS BS
            activeView === "gallery" ? (
              <h1
                onClick={toggleView}
                className="cursor-pointer text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                <span className="text-teal-800">T</span>he{" "}
                <span className="text-blue-600">i</span>
                <span className="text-red-500">C</span>lou
                <span className="text-yellow-500">d</span>
              </h1>
            ) : (
              <h1
                onClick={toggleView}
                className="cursor-pointer text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                <span className="text-teal-800">T</span>he{" "}
                <span className="text-blue-600">i</span>
                <span className="text-red-500">S</span>can
                <h2>"my private stuff, nothing to see here"</h2>
              </h1> 
            )*/}
            <Auth>
              {/*
              became useless, rly ??
              
              activeView === "gallery" ? <Gallery style={{ padding: leftPadding }} /> : <Iscan style={{ padding: leftPadding }} />*/}

            </Auth>
          </div>
        </div>
      </main>
      </Router>
    </>
  );
}

export default App;
