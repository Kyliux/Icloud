import { Background } from "./Background";
import { Table } from "./Table";
import { Modal } from "./Modal";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "m5rwi-daaaa-aaaal-acrpq-cai",
      }))();
  }, []);

  return (
    <>
        <main>
            <div className="mx-auto pt-16">
              <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-teal-800">T</span>he <span className="text-blue-600">i</span><span className="text-red-500">C</span>lou<span className="text-yellow-500">d</span>
</h1>


                <Auth>
                  <Table />

                  <Modal />
                </Auth>
              </div>
            </div>
            <Background />
        </main>
    </>
  );
}

export default App;
