import React from "react";

export const metadata = {
  title: "Map",
};

export default function page() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Find On Map</h1>
      </div>

      <div className="w-full h-screen bg-gray-300 mt-6 rounded">
      Google Map
      </div>
      
    </section>
  );
}
