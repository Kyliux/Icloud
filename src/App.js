import React, { useEffect, useState } from "react";
import { Background } from "./Background";
import { Gallery } from "./Gallery";
import { Iscan } from "./Iscan";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";

function App() {
  const [activeView, setActiveView] = useState("gallery");

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "m5rwi-daaaa-aaaal-acrpq-cai",
      }))();
  }, []);

  const toggleView = () => {
    setActiveView(activeView === "gallery" ? "iscan" : "gallery");
  };

  return (
    <>
      <main>
        <div className="mx-auto pt-16">
          <div className="text-center">
            {activeView === "gallery" ? (
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
              </h1>
            )}

            <Auth>
              {activeView === "gallery" ? <Gallery /> : <Iscan />}
            </Auth>
          </div>
        </div>
        <Background />
      </main>
    </>
  );
}

export default App;
